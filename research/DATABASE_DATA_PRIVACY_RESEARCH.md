<!-- Copyright (c) 2026 2q9e. See ../LICENSE for terms. -->

# Database, Encryption, and User Data Research

**Research date:** 2026-11-16  
**Purpose:** Research safe database development, database security, encryption and keys, password storage, and data-management/privacy-policy workflows.

## Findings in brief

Start data-management work with a map of actual collection and data flows. Then review storage, access, keys, backups, logs, sharing, retention, export, and deletion. A Privacy Policy or Terms of Use drafted before those facts are known risks claiming behavior that the product does not have. This is a design recommendation inferred from privacy principles and disclosure requirements; the cited legal materials are jurisdiction-specific and do not make a generic template legally sufficient.

Passwords, other secrets, and user data are different categories and need different controls. Passwords should be salted and adaptively hashed, not encrypted or stored as plaintext. Encryption keys should be managed separately from the data they protect when the architecture permits; at-rest encryption alone does not protect data from an application or host that can also read the key and plaintext. ([Temoshok et al., 2025, §3.1.1.2](https://pages.nist.gov/800-63-4/sp800-63b.html); [OWASP Foundation, n.d.-a](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)).

## 1. Data lifecycle and policy drafting

### Build a data map before writing legal copy

For each data type, record:

- What the product collects, creates, or infers, including account data, logs, analytics, support records, tokens, payment data, and uploaded content.
- Why each item is needed, whether collection is optional, and which product feature uses it.
- Where it is stored and processed, which vendors or subprocessors receive it, and which staff/services can access it.
- How long it is kept, how it is deleted, how backups age out, how export/deletion requests work, and what happens during an incident.
- Which jurisdictions, user groups, and legal or contractual obligations apply.

This follows data-minimization and lifecycle principles found in the FTC business guide, the voluntary NIST Privacy Framework Version 1.0, Canadian PIPEDA principles, and GDPR's collection notice requirements. NIST Privacy Framework 1.1 remains an initial public draft as of this research date, not a final replacement ([National Institute of Standards and Technology, 2020, 2025]). The precise obligations differ by jurisdiction and use case. PIPEDA generally applies to private-sector commercial activity across Canada, including federally regulated employees and certain interprovincial or international flows; Alberta, British Columbia, and Quebec have substantially similar private-sector laws that generally govern certain processing within those provinces. Check jurisdiction and organizational scope before treating PIPEDA as applicable ([Office of the Privacy Commissioner of Canada, 2024]). PIPEDA's published principles cover accountability, identifying purposes, consent, limiting collection, retention, safeguards, openness, and access; GDPR Article 13 calls for collection-time disclosures that include purposes/legal basis, retention period or criteria, and other information ([Federal Trade Commission, n.d.](https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business); [Office of the Privacy Commissioner of Canada, 2025](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/); [European Parliament and Council of the European Union, 2016, Art. 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/)).

### Terms of Use and Privacy Policy are separate outputs

The Terms of Use describe the relationship and rules for using the service; a Privacy Policy describes the service's actual personal-data practices and user-facing disclosures. Their contents should be based on product behavior, organizational roles, and relevant jurisdiction—not generated from a generic product description. A safer drafting workflow is:

1. Gather the data map and current terms/process facts.
2. Ask for missing facts rather than inventing vendors, retention periods, legal bases, user rights, or deletion behavior.
3. Produce a plain-language draft with unresolved points visibly marked, plus a data-practice summary that can be checked against product behavior.
4. Identify jurisdiction-dependent questions for qualified legal review and date/version the draft.
5. Revisit the documents when collection, vendors, retention, or user-facing features change.

This workflow is an inference from disclosure and accuracy obligations; it is not legal advice or a guarantee that generated text is legally sufficient. OpenAI's current public plugin submission guide also requires privacy-policy and terms URLs for an MCP plugin review, which makes accurate product facts important for this plugin itself ([OpenAI, n.d.](https://developers.openai.com/plugins/deploy/submission)).

## 2. Database development and operational handling

Database advice should be specific to the selected engine, version, schema, workload, and deployment. Useful general checks include:

- Use parameterized query values; allowlist dynamic identifiers or ordering clauses. A bound parameter does not enforce access rights.
- Use least-privilege application accounts, separate environment credentials, private network access where practical, and verified TLS for remote connections. Do not use a database superuser as the normal application identity ([OWASP Foundation, n.d.-b](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html)).
- Review migrations for lock duration, destructive data changes, compatibility with rolling deployment, rollback/recovery, and backup state. Use transactions for groups of changes that must be all-or-nothing where supported. PostgreSQL's documentation describes transactions as bundling steps atomically, with rollback of a failed/unwanted group ([PostgreSQL Global Development Group, n.d.-c](https://www.postgresql.org/docs/18/tutorial-transactions.html)).
- Review slow queries with engine-specific plans and observed workload data before adding indexes or changing query structure. PostgreSQL EXPLAIN shows the planner's chosen access and join plan; EXPLAIN ANALYZE executes the statement and adds profiling overhead. It can produce side effects for writes, so its safe use needs explicit handling ([PostgreSQL Global Development Group, n.d.-b](https://www.postgresql.org/docs/18/sql-explain.html)).
- Define backup method, retention, encryption, access, and restore objectives. PostgreSQL documents distinct SQL dump, filesystem backup, and continuous-archiving approaches with different tradeoffs. A successful backup job alone does not establish recoverability; a restore test is needed to verify the intended recovery path ([PostgreSQL Global Development Group, n.d.-a](https://www.postgresql.org/docs/18/backup.html)).
- Watch connection pool limits, query timeouts, pagination, and backpressure as resource and availability controls. The right thresholds need measured workload and engine/deployment context.

These are not engine-neutral tuning recipes. A useful plugin should detect suspicious patterns, explain the evidence, and ask for engine/version/workload context before prescribing schema or pool values.

## 3. Database and data encryption

### Choose a layer from the threat model

Encryption may apply at the application, database, filesystem, or hardware/provider layer. These layers address different threats. Disk or managed-database encryption may help protect lost media or some provider-side access paths, but it generally does not protect against a compromised application/database identity that can read decrypted rows. Application/field encryption can reduce the scope of some database exposures but may constrain search, indexing, joins, and key recovery. OWASP recommends beginning with the threat model and minimizing stored sensitive data ([OWASP Foundation, n.d.-a](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)).

### Separate keys from protected data

Do not hard-code keys or commit them with application source. Where possible, use a managed key or secrets service with tightly scoped identities. In envelope encryption, a data-encryption key (DEK) encrypts application data and a separately protected key-encryption key (KEK) protects the DEK. The encrypted DEK may be stored beside ciphertext only if the KEK remains separately protected. If a host or shared environment gives an attacker both data and keys, this separation offers little protection. Plan key rotation, old-backup decryption, compromise response, and recovery before rollout ([OWASP Foundation, n.d.-a](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html); [OWASP Foundation, n.d.-c](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)).

Vault Transit and database secrets engines are useful architecture references: one offers cryptographic operations while the calling system stores ciphertext, and the other can issue short-lived, role-scoped database credentials. They also add a service dependency, availability requirements, configuration, and recovery work; they are examples, not a requirement for every app ([HashiCorp, n.d.-b](https://developer.hashicorp.com/vault/docs/secrets/transit); [HashiCorp, n.d.-a](https://developer.hashicorp.com/vault/docs/secrets/databases/postgresql)).

## 4. Password storage

Within its digital-identity guidance for authentication of users interacting with government information systems, NIST SP 800-63B-4 requires centrally verified passwords to be salted and hashed with a suitable password-hashing scheme, a cost factor as high as practical without harming verifier performance, a salt of at least 32 bits, and storage of the salt and hash. It recommends recording the scheme and cost metadata; if an additional secret key is used, that key is stored separately from password hashes. These are technical guidelines for the publication's stated context, not a universal legal requirement ([Temoshok et al., 2025, §3.1.1.2](https://pages.nist.gov/800-63-4/sp800-63b.html)).

OWASP gives more specific implementation advice: it lists several Argon2id minimum configurations, including 19 MiB memory/two iterations/parallelism one, 46 MiB/one iteration/parallelism one, and 12 MiB/three iterations/parallelism one. Choose and benchmark a work factor on the target because expensive hashing under login concurrency can increase CPU use and enable denial of service. These parameter values are OWASP guidance, not a NIST algorithm mandate. Prefer a maintained framework/library implementation over custom password hashing; rate-limit failed login attempts as part of authentication defenses, and retain algorithm/cost metadata to support upgrades ([OWASP Foundation, n.d.-d](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html); [Temoshok et al., 2025, §3.2.2](https://pages.nist.gov/800-63-4/sp800-63b.html)).

For plugin review, useful findings include plaintext or reversibly encrypted password storage, use of a fast general-purpose hash without a password scheme, weak/absent salts, hard-coded pepper, or a password verification path with no login throttling. A finding should identify the implementation and library evidence; it should not generate a bespoke cryptographic routine.

## 5. Other data-management risks

- Secrets can leak through source files, logs, stack traces, analytics, support exports, database audit settings, backups, sample data, and test fixtures. Secret/PII scanners and catalog tags help locate candidates but cannot guarantee full discovery.
- Audit logs may capture SQL text or parameter values. Configure narrowly, restrict log access, set retention, and assess ingestion costs. pgAudit documents that broad audit settings may increase volume and latency and that statements/parameters can expose data ([pgAudit, n.d.](https://github.com/pgaudit/pgaudit)).
- PII recognition tools such as Presidio can suggest sensitive columns or anonymize data, but detection is fallible and the project has moved to independent, community-governed ownership. Treat results as leads that need owner review; a masking label does not prove database encryption, retention, or deletion controls ([Data Privacy Stack, n.d.-a](https://github.com/data-privacy-stack/presidio/blob/main/docs/faq.md); [Data Privacy Stack, n.d.-b](https://github.com/data-privacy-stack/presidio/blob/main/docs/project_transition.md)).

## Source guide

| Source | Evidence location | Supports | Does not establish |
|---|---|---|---|
| NIST SP 800-63B-4 | §3.1.1.2 | Salted password hashing, performance-aware work factor, algorithm metadata, separate optional secret key | A universal algorithm choice or OWASP's Argon2id parameter values |
| OWASP password, database, cryptographic storage, and key-management guidance | Algorithm/key/database sections | Practical secure-storage, key separation, access, and lifecycle recommendations | Which deployment architecture fits every threat model |
| FTC, OPC Canada, GDPR | Business guide; PIPEDA principles; GDPR Art. 13 | Data minimization, purpose, safeguards, transparency, retention, and collection disclosures in relevant contexts | Uniform worldwide legal requirements or a complete policy template |
| NIST Privacy Framework | Version 1.0 final; Version 1.1 initial public draft | Voluntary privacy risk-management outcomes | Law, compliance determination, or a final Version 1.1 publication |
| PostgreSQL documentation | PostgreSQL 18 Transactions, EXPLAIN, backup/restore | Engine-specific transaction behavior, query-plan review, EXPLAIN ANALYZE caveats, backup choices | Behavior of all other database engines or production recoverability without a restore test |
| HashiCorp Vault docs | Transit and PostgreSQL secrets engine | One example of separating key operations and issuing temporary DB credentials | Operational suitability or security of a particular Vault deployment |

## References

Data Privacy Stack. (n.d.-a). *Frequently asked questions*. GitHub. Retrieved November 16, 2026, from https://github.com/data-privacy-stack/presidio/blob/main/docs/faq.md

Data Privacy Stack. (n.d.-b). *Project transition*. GitHub. Retrieved November 16, 2026, from https://github.com/data-privacy-stack/presidio/blob/main/docs/project_transition.md

European Parliament and Council of the European Union. (2016). *Regulation (EU) 2016/679 (General Data Protection Regulation)*, Article 13. EUR-Lex. https://eur-lex.europa.eu/eli/reg/2016/679/oj/

Federal Trade Commission. (n.d.). *Protecting personal information: A guide for business*. Retrieved November 16, 2026, from https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business

HashiCorp. (n.d.-a). *PostgreSQL database secrets engine*. HashiCorp Developer. Retrieved November 16, 2026, from https://developer.hashicorp.com/vault/docs/secrets/databases/postgresql

HashiCorp. (n.d.-b). *Transit secrets engine*. HashiCorp Developer. Retrieved November 16, 2026, from https://developer.hashicorp.com/vault/docs/secrets/transit

National Institute of Standards and Technology. (2020). *NIST Privacy Framework: A tool for improving privacy through enterprise risk management, Version 1.0* (NIST CSWP 10). https://doi.org/10.6028/NIST.CSWP.10

National Institute of Standards and Technology. (2025). *NIST Privacy Framework 1.1* (NIST CSWP 40, initial public draft). https://doi.org/10.6028/NIST.CSWP.40.ipd

Office of the Privacy Commissioner of Canada. (2024, May 1). *PIPEDA requirements in brief*. https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief/

Office of the Privacy Commissioner of Canada. (2025, May 29). *PIPEDA fair information principles*. https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/

OpenAI. (n.d.). *Upload and submit your plugin*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/deploy/submission

OWASP Foundation. (n.d.-a). *Cryptographic storage cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 16, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html

OWASP Foundation. (n.d.-b). *Database security cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 16, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html

OWASP Foundation. (n.d.-c). *Key management cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 16, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html

OWASP Foundation. (n.d.-d). *Password storage cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 16, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

OWASP Foundation. (n.d.-e). *Secrets management cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 16, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

pgAudit. (n.d.). *PostgreSQL audit extension* [Computer software]. GitHub. Retrieved November 16, 2026, from https://github.com/pgaudit/pgaudit

PostgreSQL Global Development Group. (n.d.-a). *Backup and restore*. PostgreSQL 18 documentation. Retrieved November 16, 2026, from https://www.postgresql.org/docs/18/backup.html

PostgreSQL Global Development Group. (n.d.-b). *EXPLAIN*. PostgreSQL 18 documentation. Retrieved November 16, 2026, from https://www.postgresql.org/docs/18/sql-explain.html

PostgreSQL Global Development Group. (n.d.-c). *Transactions*. PostgreSQL 18 documentation. Retrieved November 16, 2026, from https://www.postgresql.org/docs/18/tutorial-transactions.html

Temoshok, D., Fenton, J. L., Choong, Y.-Y., Lefkovitz, N., Regenscheid, A., Galluzzo, R., & Richer, J. P. (2025). *Digital identity guidelines: Authentication and authenticator management* (NIST Special Publication 800-63B-4). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.SP.800-63b-4
