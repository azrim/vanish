# 👻 Vanish

Temporary emails that disappear. Generate. Read. Gone.

## Stack

- **Frontend:** React + Vite → Cloudflare Pages
- **API:** Cloudflare Pages Functions
- **Database:** Supabase (PostgreSQL)
- **Email:** Cloudflare Email Routing

## Features

- 🎲 Generate random temp emails
- 🌐 5 custom domains
- 📬 Auto-refresh inbox (5s)
- 📧 Read HTML/text emails
- ⏰ Auto-delete after 24 hours
- 🌑 Dark theme

## Domains

- `azrim.biz.id`
- `azrim.my.id`
- `scarlett.my.id`
- `solvege.my.id`
- `sukiliar.pro`

## Setup

1. Run `supabase/schema.sql` in Supabase SQL Editor
2. `cd frontend && npm install`
3. `npm run dev` for local dev
4. `npm run build` for production
5. Deploy to Cloudflare Pages

## Deploy

```bash
cd frontend
npm install
npm run build
npx wrangler pages deploy dist --project-name=vanish
```

## License

MIT
