# Security Action Plan (Finance App)

Priority-ordered steps to close remaining risks. Each item lists owner cues and completion criteria. Rotate leaked keys immediately.

## 0) Emergency: Rotate leaked secrets
- Rotate Supabase keys (main and waitlist projects): anon/publishable and service-role. Update Supabase/Vercel/local envs. Assume leaked.
- Optional: if allowed, rewrite git history to purge `.env`; force-push; then re-rotate keys.
- Completion: new keys deployed; old keys revoked; envs updated; history scrub (if chosen).

## 1) Authentication & Session Hardening
- Migrate Supabase auth to secure cookies (PKCE + cookie storage) or add strict CSP if staying with `localStorage`.
- Disable client debug logging in prod (`VITE_DEBUG_LOGGING=false`); audit client logs for PII.
- Completion: tokens not readable by JS (or CSP in place); logging minimized in prod.

## 2) Backend RLS & Access Control
- Audit all tables: ensure RLS enabled with SELECT/INSERT/UPDATE/DELETE policies scoped to `auth.uid()`. Tables to verify: goals, linked_accounts, profiles, messages, conversations, summary_cache, goal_recommendations, any waitlist tables.
- Add tests (or SQL checks) that block cross-tenant access.
- Completion: RLS on; symmetric policies; tests pass.

## 3) Edge Function Safety & Limits
- Already added: CORS allowlist, auth required, rate limiting, request validation, safety preamble, input safety filter, response sanitizer, no-cache on parse failure.
- Improve: shared rate limiter (KV/Redis/Cloudflare) vs in-memory; stronger safety classifier (replace regex filter).
- Completion: shared limiter configured; classifier integrated; env validated at startup.

## 4) Logging & Redaction
- Edge: scrub logs to avoid user content/context; log requestId, status, code only. Disable verbose logs in prod.
- Frontend: keep info/debug off in prod; no user-entered text in logs.
- Completion: code review of logging; prod logging minimal and non-PII.

## 5) Config & Env Hygiene
- Frontend env validation (zod) for `VITE_*`; fail build/CI on missing keys.
- Maintain `.env.example` only; `.env*` ignored (already done).
- Completion: CI fails on missing env; no secrets in repo.

## 6) Content Security Policy
- Add strict CSP in `index.html`: default-src 'self'; script-src 'self'; connect-src self + Supabase domains; img/font/style as needed; block inline/eval.
- Completion: CSP header/meta present; app still functions.

## 7) Caching Freshness
- Call cache invalidation after any financial data mutation (accounts/profiles/net worth updates). Add scheduled cleanup for expired cache.
- Completion: invalidation wired for all mutations; cron/edge schedule in place.

## 8) Testing & Observability
- Integration tests: financial-chat (auth required, demo allowed, cache hit/miss, safety 422, rate-limit 429).
- RLS tests for all tables.
- E2E: protected-route redirects, chat safety error message, retry/backoff.
- Metrics: requestId propagated (done), add counters for rate-limit hits, safety blocks, cache hit rate, 4xx/5xx.
- Completion: tests green; metrics visible in dashboards.

## 9) Waitlist Surface
- Confirm waitlist Supabase project keys rotated and RLS enabled on waitlist tables.
- Ensure TURNSTILE_SECRET_KEY set; fail closed if missing.
- Completion: keys rotated; RLS verified; secret required in prod.

## 10) Dependency & Supply Chain
- Run `npm audit`/`pnpm audit`; update critical/high deps.
- Lock CSP to disallow unexpected third-party scripts; review any embeds.
- Completion: no high/critical vulns; CSP restricts third-party.
