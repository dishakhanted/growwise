# Poonji

Institutional landing site for [poonji.ai](https://poonji.ai) — prediction markets through principal-protected structured bonds.

The previous consumer fintech app (AI personal finance coach) is preserved on the [`legacy`](https://github.com/dishakhanted/growwise/tree/legacy) branch.

## Development

```bash
npm install
npm run dev
```

### Environment variables

- `VITE_WAITLIST_SUPABASE_URL` — Supabase project URL for early-access submissions
- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (optional in local dev)

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase Edge Functions (`waitlist-submit` for access requests)
