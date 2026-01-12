# Waitlist Submit Edge Function

This Edge Function handles waitlist submissions with:
- Cloudflare Turnstile CAPTCHA verification
- Rate limiting (by IP and email)
- Input validation
- Error handling

## Setup

1. Deploy this function to your **waitlist Supabase project** (not the main app project):
   ```bash
   cd supabase/functions/waitlist-submit
   supabase functions deploy waitlist-submit --project-ref <waitlist-project-ref>
   ```

2. Set required secrets in your waitlist Supabase project:
   ```bash
   # Cloudflare Turnstile secret key
   supabase secrets set TURNSTILE_SECRET_KEY=<your-turnstile-secret-key>
   
   # Waitlist database credentials (the same Supabase instance)
   supabase secrets set WAITLIST_SUPABASE_URL=<your-waitlist-supabase-url>
   supabase secrets set WAITLIST_SUPABASE_SERVICE_KEY=<your-waitlist-service-role-key>
   ```

## Environment Variables

- `TURNSTILE_SECRET_KEY`: Your Cloudflare Turnstile secret key
- `WAITLIST_SUPABASE_URL`: The Supabase URL for your waitlist database
- `WAITLIST_SUPABASE_SERVICE_KEY`: The service role key for your waitlist database

## Rate Limiting

- **Per IP**: 5 submissions per hour
- **Per Email**: 3 submissions per hour

Rate limits are stored in-memory and reset when the function restarts. For production with multiple instances, consider using Redis or Supabase KV.

## API

### POST `/functions/v1/waitlist-submit`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "birthday": "1990-01-01",
  "email": "john@example.com",
  "turnstile_token": "token-from-turnstile-widget"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "You're on the waitlist! 🎉"
}
```

**Error Responses:**
- `400`: Invalid input or missing CAPTCHA
- `409`: Email already exists (duplicate)
- `429`: Rate limit exceeded
- `500`: Server error
