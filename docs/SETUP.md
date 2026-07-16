# Setup Guide

## Requirements

- n8n instance
- Kapso WhatsApp API account
- Supabase project
- OpenRouter or another supported LLM provider
- Netlify account or another static hosting provider

## n8n

1. Import the workflow files from `workflows/`.
2. Create and assign your own credentials.
3. Replace placeholder Data Table IDs.
4. Configure the Kapso trigger.
5. Configure the LLM model nodes.
6. Configure Supabase credentials.
7. Activate the workflows.

## Web App

Open `web-app/app.js` and replace:

```js
whatsappNumber: "YOUR_WHATSAPP_NUMBER"
supabaseUrl: "YOUR_SUPABASE_URL"
supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY"
closeSessionWebhook: "YOUR_N8N_CLOSE_SESSION_WEBHOOK"
```

Deploy the `web-app` folder to Netlify.

## Important

Do not place service-role keys or privileged database credentials in frontend JavaScript.
