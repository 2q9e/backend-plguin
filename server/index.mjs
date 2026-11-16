import https from "node:https";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const OSV_QUERY_URL = "https://api.osv.dev/v1/query";
const OSV_RECORD_URL = "https://osv.dev/vulnerability/";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 1_000_000;

const safeCoordinate = z.string()
  .min(1)
  .max(256)
  .regex(/^[^\u0000-\u001f\u007f]+$/, "Use a non-empty public package coordinate without control characters.");

const inputSchema = z.object({
  ecosystem: safeCoordinate.describe("OSV ecosystem, such as npm or PyPI."),
  packageName: safeCoordinate.describe("Exact public package name. Do not send private package identifiers."),
  version: safeCoordinate.describe("Exact resolved package version to check.")
}).strict();

const eventSchema = z.object({
  introduced: z.string().optional(),
  fixed: z.string().optional(),
  last_affected: z.string().optional(),
  limit: z.string().optional()
}).strict();

const outputSchema = z.object({
  status: z.enum(["checked", "not_checked"]),
  query: z.object({
    ecosystem: z.string(),
    packageName: z.string(),
    version: z.string()
  }).strict(),
  sourceUrl: z.string(),
  checkedAt: z.string(),
  reason: z.string().optional(),
  advisories: z.array(z.object({
    id: z.string(),
    sourceUrl: z.string(),
    published: z.string().optional(),
    modified: z.string().optional(),
    withdrawn: z.string().optional(),
    affected: z.array(z.object({
      ecosystem: z.string(),
      packageName: z.string(),
      ranges: z.array(z.object({
        type: z.string(),
        events: z.array(eventSchema)
      }).strict()),
      fixedVersions: z.array(z.string())
    }).strict())
  }).strict())
}).strict();

function requestOsv(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      package: { name: query.packageName, ecosystem: query.ecosystem },
      version: query.version
    });

    const request = https.request(OSV_QUERY_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "backend-plugin-osv/0.2.0"
      }
    }, (response) => {
      let size = 0;
      const chunks = [];

      response.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_RESPONSE_BYTES) {
          request.destroy(new Error("OSV response exceeded the size limit."));
          return;
        }
        chunks.push(chunk);
      });

      response.on("end", () => {
        if (response.statusCode !== 200) {
          reject(new Error("OSV returned a non-success status."));
          return;
        }

        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch {
          reject(new Error("OSV returned invalid JSON."));
        }
      });
    });

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error("OSV request timed out."));
    });
    request.on("error", reject);
    request.end(body);
  });
}

function safeString(value, maxLength = 256) {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(value)) return undefined;
  return value;
}

function normalizeAffected(entries, query) {
  if (!Array.isArray(entries)) return [];

  return entries.flatMap((entry) => {
    const packageInfo = entry?.package;
    if (packageInfo?.name !== query.packageName || packageInfo?.ecosystem !== query.ecosystem) return [];

    const ranges = Array.isArray(entry.ranges) ? entry.ranges.flatMap((range) => {
      const type = safeString(range?.type, 40);
      if (!type || !Array.isArray(range?.events)) return [];

      const events = range.events.flatMap((event) => {
        if (!event || typeof event !== "object" || Array.isArray(event)) return [];
        const normalized = {};
        for (const key of ["introduced", "fixed", "last_affected", "limit"]) {
          const value = safeString(event[key], 128);
          if (value) normalized[key] = value;
        }
        return Object.keys(normalized).length ? [normalized] : [];
      });

      return [{ type, events }];
    }) : [];

    const fixedVersions = [...new Set(
      ranges.flatMap((range) => range.events.map((event) => event.fixed).filter(Boolean))
    )];

    return [{
      ecosystem: query.ecosystem,
      packageName: query.packageName,
      ranges,
      fixedVersions
    }];
  });
}

function normalizeAdvisory(record, query) {
  const id = safeString(record?.id, 200);
  if (!id) return undefined;

  const advisory = {
    id,
    sourceUrl: OSV_RECORD_URL + encodeURIComponent(id),
    affected: normalizeAffected(record.affected, query)
  };

  for (const field of ["published", "modified", "withdrawn"]) {
    const value = safeString(record[field], 64);
    if (value) advisory[field] = value;
  }

  return advisory;
}

async function lookup(query) {
  const checkedAt = new Date().toISOString();

  try {
    const payload = await requestOsv(query);
    if (!payload || (payload.vulns !== undefined && !Array.isArray(payload.vulns))) {
      throw new Error("OSV returned an unexpected response.");
    }

    return {
      status: "checked",
      query,
      sourceUrl: OSV_QUERY_URL,
      checkedAt,
      advisories: (payload.vulns ?? [])
        .map((record) => normalizeAdvisory(record, query))
        .filter(Boolean)
    };
  } catch {
    return {
      status: "not_checked",
      query,
      sourceUrl: OSV_QUERY_URL,
      checkedAt,
      reason: "The public OSV lookup did not return usable metadata. No advisory conclusion can be drawn.",
      advisories: []
    };
  }
}

const server = new McpServer({
  name: "backend-plugin-osv",
  version: "0.2.0",
  instructions: "This read-only tool checks one exact public package version against OSV. The ecosystem, package name, and version are sent to api.osv.dev. Results are an aggregator signal, not a complete advisory review or a fixed-version recommendation. Corroborate material results with the package maintainer or vendor. The tool omits advisory prose and reference lists."
});

server.registerTool(
  "query_package_advisories",
  {
    title: "Check a package version in OSV",
    description: "Query the public OSV database for advisories matching one exact package ecosystem, name, and resolved version. Sends only those package coordinates to api.osv.dev. Returns whitelisted metadata (IDs, timestamps, affected range events, and fixed-version fields); it omits advisory prose, details, and reference lists. Treat results as an aggregator signal and verify any proposed fix with the package maintainer or vendor. If the source is unavailable, status is not_checked.",
    inputSchema,
    outputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (query) => {
    const result = await lookup(query);
    return {
      structuredContent: result,
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

await serveStdio(() => server);
