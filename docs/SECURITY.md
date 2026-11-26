# Security Notes

This repository is a sanitized portfolio version.

Before production use:

- Enable Supabase Row Level Security.
- Do not expose service-role keys in the browser.
- Store secrets in n8n credentials or environment variables.
- Authenticate dashboard actions.
- Validate webhook requests.
- Add rate limiting and idempotency checks.
- Remove or mask customer data from logs.
- Restrict database permissions to the minimum required.
- Rotate any credential that has previously been exposed.
- Add monitoring, alerts, backups, and error-handling workflows.

The included frontend uses placeholder configuration values and must be configured securely before deployment.

## Public Portfolio Review — 26 November 2026

This repository's checked-out tracked files were inspected with a **bounded static scan** for common hard-coded GitHub, OpenAI, AWS, Telegram, JWT, private-key and Authorization token formats. No direct match was found in the inspected files. This is **not** a complete security assessment, a full Git-history audit, or proof that no sensitive operational details were ever published.

**Deployment boundary:** Restaurant order/payment endpoints require authentication, RLS and server-side authorization; the public implementation is not production-ready.

Do not push real credentials, customer transactions or deployment secrets into this public repo. A `.gitignore` helps prevent accidental future additions but **does not hide files already committed**. Rotate any credential discovered in a public commit or log.

The public examples are designed for code review and demonstration. Operational deployments require separate environment review and verification.
