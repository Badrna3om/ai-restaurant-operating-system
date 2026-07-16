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
