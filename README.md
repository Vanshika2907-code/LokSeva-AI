<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

## Deploy on Render

This project deploys as one Render **Web Service**: Express serves both the
production React build and all `/api/*` routes, so browser requests remain on
the same public URL.

1. Push the repository (without `.env`) and create a new Render Blueprint from
   `render.yaml`.
2. Supply the prompted variables in Render's environment settings:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`,
   `RESEND_API_KEY`, and `EMAIL_FROM`.
3. In Supabase, add the Render public URL to the project's allowed redirect
   URLs if you use Supabase email authentication.

`VITE_SUPABASE_ANON_KEY` is the browser-safe Supabase anon key. Never set a
Supabase service-role key with a `VITE_` prefix.

### OTP email delivery

Render free web services block outbound SMTP ports, including Gmail's 465 and
587. The Render Blueprint therefore sets `EMAIL_PROVIDER=resend`, which sends
OTP email through Resend's HTTPS API.

In Render, configure:

1. `RESEND_API_KEY` — a server-side Resend API key.
2. `EMAIL_FROM` — for example, `LokSeva Portal <otp@your-verified-domain>`.
   The domain must be verified in Resend before it can send to citizens.

For local Gmail testing, keep `EMAIL_PROVIDER=smtp` with `GMAIL_USER` and
`GMAIL_APP_PASSWORD` in your uncommitted `.env`. The SMTP defaults are
`smtp.gmail.com`, port `587`, `SMTP_SECURE=false` (STARTTLS); port `465`
requires `SMTP_SECURE=true`.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2c07e535-17d4-4b71-bec3-1eb949909d0f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
