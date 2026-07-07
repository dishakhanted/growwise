# Production Hardening Plan

Prioritized, step‑by‑step actions to address the code review findings. Start at Priority 0 and work downward.

## Priority 0 — Block external abuse and misconfig
1) Lock CORS for financial-chat  
   - In `supabase/functions/financial-chat/index.ts`, replace `Access-Control-Allow-Origin: "*"` with an allowlist of prod/stage domains.  
   - Reject requests with an origin header not in the allowlist; return 403 early.
2) Enforce auth for non-demo calls  
   - In `index.ts`, if `demo` is absent, require `Authorization` and `auth.getUser` success; otherwise 401.  
   - Add a rate-limit/backoff (per IP and per user) before hitting Gemini.
3) Validate environment configuration at startup  
   - Edge: assert `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL_MAIN`. Fail fast with a descriptive log.  
   - Frontend: add a small env schema (e.g., zod) for `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (or align to `VITE_SUPABASE_PUBLISHABLE_KEY`), `VITE_SUPABASE_PROJECT_REF`.

## Priority 1 — Input validation, limits, and cost controls
4) Add request schemas and size caps for financial-chat  
   - Define zod/valibot schemas for `messages`, `contextType`, `contextData`, `viewMode`, `endpoint`.  
   - Hard limits: max messages (e.g., 30), max chars per message (e.g., 2k), max payload size (e.g., 50KB). Reject early with 400.  
   - Normalize/trim messages before logging or sending to Gemini.
5) Add output guards for Gemini  
   - Require JSON mode for structured contexts and validate parsed structure; on parse failure, return a sanitized fallback.  
   - Enforce max tokens and strip unsafe content (URLs, PII echoes) before caching/returning.
6) Tighten logging and redaction  
   - Centralize logging helpers to redact email, tokens, IDs, and free text.  
   - Avoid logging request bodies or full errorText from Gemini; log requestId + code only.  
   - Remove localStorage-based debug toggles in production builds.

## Priority 2 — Data security and session handling
7) Harden session storage on the frontend  
   - Prefer cookie-based Supabase auth; if staying with `localStorage`, add CSP, HttpOnly alt storage, and XSS audits.  
   - Remove PII from client logs and disable debug logging in prod.  
   - Ensure `waitlistClient` and other API helpers send auth headers consistently.
8) Verify/extend RLS across Supabase tables  
   - Confirm RLS policies on `conversations`, `messages`, `goals`, `linked_accounts`, etc., all scoped by `auth.uid()`.  
   - Add policies for INSERT/UPDATE/DELETE symmetry and row ownership checks.

## Priority 3 — Caching correctness and freshness
9) Wire cache invalidation  
   - Call `invalidateCache` after goal/account/profile mutations (server-side functions or DB triggers).  
   - Add TTL monitoring and a scheduled cleanup (`cleanup_expired_summaries`) job.  
   - Upgrade hash to SHA-256 for data snapshots to reduce collisions.
10) Cache safety checks  
   - Skip caching on partial/errored Gemini responses.  
   - Include `promptType` + `model` in cache metadata for future migrations.

## Priority 4 — LLM safety and UX resilience
11) Add content safety and prompt-injection guards  
   - Pre-filter user input for toxic/off-domain content; reject or downscope.  
   - Add a system preamble that rejects instructions to ignore safeguards.  
   - Post-filter outputs for safety categories; degrade gracefully on blocks.
12) Improve UX fallback paths  
   - Provide deterministic, cached summaries when Gemini fails (already partially done for summaries); extend to suggestion flows.  
   - Add UI error boundaries for chat/dashboard and retry with exponential backoff.

## Priority 5 — Observability and testing
13) Observability  
   - Emit metrics: cache hit rate, LLM latency/cost, 4xx/5xx counts, auth failures.  
   - Propagate `requestId` to frontend responses and logs.  
   - Add structured audit logs with minimal, non-PII context.
14) Testing and QA  
   - Add integration tests for financial-chat (auth required, demo allowed, cache hit/miss, decision handling).  
   - Add unit tests for cache hashing, suggestion parsing, and prompt loaders.  
   - Add e2e smoke tests for protected routes (redirect behavior) and chat happy-path/error-path flows.

## Priority 6 — Deployment readiness
15) Configuration hygiene  
   - Align env variable names between README, Vercel, and Supabase.  
   - Add preflight checks in CI to fail on missing envs.  
   - Document domain allowlists and rotate keys before go-live.

Execution tips
- Do Priority 0–1 before any launch; these block abuse and misconfig.  
- Ship changes behind feature flags where possible.  
- After each tranche, rerun integration/e2e tests and verify Supabase policies in staging.  
- Rotate service keys once CORS/auth/rate limits are in place.
