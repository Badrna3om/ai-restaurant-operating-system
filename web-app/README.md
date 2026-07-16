# Restaurant Interactive Menu & Operations Dashboard

Public portfolio version of the Round One Step restaurant web application.

## Included interfaces

- Interactive digital menu
- WhatsApp order handoff
- Dine-in and takeaway selection
- Kitchen dashboard
- Waiter and cashier dashboard
- Reports dashboard
- Supabase realtime order updates
- Paid-and-close session webhook integration

## Configuration

Open `app.js` and replace:

```js
whatsappNumber: "YOUR_WHATSAPP_NUMBER"
supabaseUrl: "YOUR_SUPABASE_URL"
supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY"
closeSessionWebhook: "YOUR_N8N_CLOSE_SESSION_WEBHOOK"
```

Do not commit production credentials or private customer data.

## Deployment

The project can be deployed as a static site on Netlify.
