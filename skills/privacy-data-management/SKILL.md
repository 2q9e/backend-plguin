---
name: privacy-data-management
description: Map an application's personal-data flows, review retention and deletion practices, or draft fact-grounded Terms of Use and Privacy Policy text.
---

# Privacy and data management

Use this skill to inventory product data practices, review the data lifecycle, or prepare user-facing Terms of Use and Privacy Policy drafts. Start from what the product and organization actually do. A draft or technical review is not a legal determination and cannot establish legal sufficiency.

## Procedure

1. **Define the product and scope.** Record the service, features, repository/configuration or process materials reviewed, relevant user groups, organization role if known, and jurisdictions or contracts supplied by the user. Do not infer a jurisdiction or organizational role from a product's location alone.
2. **Build a data inventory and flow map before drafting.** For each data type—including account and profile data, user content, payment/support records, logs, analytics, tokens, and inferred data—record:
   - what is collected, created, or inferred and whether collection is optional;
   - the product purpose and feature that uses it;
   - where it is collected, transmitted, processed, and stored;
   - vendors, subprocessors, staff, and services that receive or can access it;
   - retention period or decision criteria, storage copies, backups, and log paths;
   - export, correction, deletion, and incident-handling processes that are known.
   Mark each item as observed, supplied, inferred, or unknown. Recommend minimizing data that has no established product need, but do not silently remove or change collection behavior.
3. **Trace the lifecycle.** Check collection forms and APIs, storage and replicas, analytics and support systems, third-party transfers, logs, backups, exports, and deletion paths. Determine what deletion actually removes, what persists in backups and for how long, and whether any external service needs a separate action. Do not describe a user right, exception, retention period, or deletion capability unless evidence or the user confirms it.
4. **Separate legal documents and ground each claim.** Terms of Use describe the service relationship and usage rules; a Privacy Policy describes actual personal-data practices and user-facing disclosures. Draft them as distinct outputs unless asked otherwise. Use verified inventory facts and supplied business terms. Mark missing details as questions or explicit placeholders; never invent purposes, vendors, sharing, retention, legal bases, rights, consent flows, or security guarantees. Keep any data-practice summary consistent with observed product behavior.
5. **Handle law and uncertainty carefully.** The research notes summarize FTC guidance, PIPEDA principles, GDPR Article 13, and the voluntary NIST Privacy Framework, but their scope differs. If legal applicability or current wording matters, establish the relevant jurisdiction and organizational facts and check authoritative current sources. Describe jurisdiction-dependent issues as questions for qualified legal review. Do not present a generic template, checklist, or generated draft as legal advice, compliance certification, or legally sufficient.
6. **Make review and upkeep possible.** Date/version a draft, list assumptions and unresolved questions, identify the evidence behind material claims, and note product or vendor changes that would make it stale. Present the draft for review before it is published or substituted for existing terms or notices.

## Evidence and coverage

- Read [Database, Encryption, and User Data Research](../../research/DATABASE_DATA_PRIVACY_RESEARCH.md), especially sections 1 and 5, for the inventory, lifecycle, and policy-drafting workflow. Use [Reference Projects](../../research/REFERENCE_PROJECTS.md) section “What is worth combining” for scope and coverage principles. Follow the shared [finding and action contract](../../references/finding-contract.md), including its policy-draft evidence rule.
- Tie each material policy statement to an inspected file/configuration or a fact supplied by the user. Keep a concise inventory that distinguishes evidence from assumptions and unknowns. Cite inspected legal or standards sources with their scope and checked date when current legal facts are discussed.
- State the scope examined: code paths, forms, schemas, logs, vendors, processes, environments, and jurisdictions actually covered. Say “not observed in the inspected scope” where appropriate. Repository inspection alone cannot establish deployed collection, vendor behavior, staff access, actual retention, backup expiry, or fulfillment of requests.
- If facts conflict or are missing, preserve that uncertainty in the draft and provide focused questions. Do not resolve factual gaps by copying a template.

## Action boundaries

Read-only inspection and preparation of draft text are within scope. Do not export, inspect, delete, or disclose live personal data; change retention or deletion jobs; contact users, vendors, or regulators; or publish/replace legal documents without exact authorization for that action. Keep personal data and secrets out of findings and examples. Escalate legal interpretation to qualified counsel rather than presenting an assumption as a requirement.
