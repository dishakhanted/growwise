#!/bin/bash
# =============================================================================
# Poonji.ai — Supabase Migration & Setup Script
# =============================================================================

set -e

NEW_PROJECT_ID="gzbcnungrjtyiuadqsqq"
NEW_PROJECT_URL="https://gzbcnungrjtyiuadqsqq.supabase.co"
NEW_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YmNudW5ncmp0eWl1YWRxc3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTA1NjQsImV4cCI6MjA5NTgyNjU2NH0.EnTCk00fE8eFCSsOYM74NpimLKeyk0HedW6StRKCAWo"
NEW_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YmNudW5ncmp0eWl1YWRxc3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI1MDU2NCwiZXhwIjoyMDk1ODI2NTY0fQ.gaVIAmkmpbFO6G0dV97QHMEeeHY8_T3utmFii7qBQbo"
NEW_DB_PASSWORD="Khanted@101"
BACKUP_FILE="/Users/dishakhanted/Desktop/db_cluster-18-12-2025@08-02-53.backup"

# URL-encode password (@ and other special chars break the connection string)
ENCODED_DB_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''${NEW_DB_PASSWORD}''', safe=''))")
NEW_DB_URL="postgresql://postgres:${ENCODED_DB_PASSWORD}@db.${NEW_PROJECT_ID}.supabase.co:5432/postgres"
FUNCTIONS_DIR="./supabase/functions/waitlist-submit"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log()     { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

echo ""
echo "=============================================="
echo "  Poonji.ai — Supabase Setup"
echo "=============================================="
echo ""

log "Validating configuration..."
[ -z "$NEW_PROJECT_ID" ]      && error "NEW_PROJECT_ID is not set."
[ -z "$NEW_PROJECT_URL" ]     && error "NEW_PROJECT_URL is not set."
[ -z "$NEW_ANON_KEY" ]        && error "NEW_ANON_KEY is not set."
[ -z "$NEW_SERVICE_ROLE_KEY" ] && error "NEW_SERVICE_ROLE_KEY is not set."
[ -z "$NEW_DB_PASSWORD" ]     && error "NEW_DB_PASSWORD is not set."
success "Configuration looks good."

log "Checking prerequisites..."
if ! command -v psql &> /dev/null; then
  warn "psql not found. Installing via Homebrew..."
  brew install libpq && brew link --force libpq || brew install postgresql || error "Failed to install postgresql."
fi
export PATH="/usr/local/opt/libpq/bin:/opt/homebrew/opt/libpq/bin:$PATH"
success "psql is available: $(psql --version)"

if ! command -v supabase &> /dev/null; then
  warn "Supabase CLI not found. Installing..."
  brew install supabase/tap/supabase || error "Failed to install Supabase CLI."
fi
success "Supabase CLI is available: $(supabase --version)"

if [ -n "$BACKUP_FILE" ]; then
  log "Restoring backup from: $BACKUP_FILE"
  [ ! -f "$BACKUP_FILE" ] && error "Backup file not found at: $BACKUP_FILE"
  psql "$NEW_DB_URL" < "$BACKUP_FILE" && success "Backup restored successfully." \
    || error "Backup restore failed. Check your DB password and connection string."
else
  warn "No BACKUP_FILE specified — skipping restore."
fi

log "Creating waitlist table (if not exists)..."
psql "$NEW_DB_URL" <<SQL
CREATE TABLE IF NOT EXISTS waitlist (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text,
  last_name  text,
  birthday   date,
  email      text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS birthday date;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_email_unique'
  ) THEN
    ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_unique UNIQUE (email);
  END IF;
END
\$\$;

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'waitlist' AND policyname = 'allow_service_insert'
  ) THEN
    CREATE POLICY allow_service_insert ON waitlist
      FOR INSERT WITH CHECK (true);
  END IF;
END
\$\$;
SQL

success "Waitlist table ready."

log "Fetching current waitlist entries..."
echo ""
psql "$NEW_DB_URL" -c "SELECT id, email, created_at FROM waitlist ORDER BY created_at DESC LIMIT 10;" \
  || warn "Could not fetch waitlist entries — table may be empty."
echo ""

log "Using existing Edge Function at $FUNCTIONS_DIR/index.ts (not overwriting)."

log "Linking to Supabase project: $NEW_PROJECT_ID..."
supabase link --project-ref "$NEW_PROJECT_ID" || error "Failed to link project. Run 'supabase login' first."

log "Setting Edge Function secrets..."
supabase secrets set \
  WAITLIST_SUPABASE_URL="${NEW_PROJECT_URL}" \
  WAITLIST_SUPABASE_SERVICE_KEY="${NEW_SERVICE_ROLE_KEY}" \
  || error "Failed to set function secrets."

log "Deploying Edge Function..."
supabase functions deploy waitlist-submit --no-verify-jwt || error "Edge Function deploy failed."
success "Edge Function deployed."

log "Updating .env files (Vite vars)..."
ENV_FILE=".env"
ENV_LOCAL=".env.local"

update_env() {
  local file=$1
  if [ -f "$file" ]; then
    sed -i.bak "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=\"${NEW_PROJECT_URL}\"|g" "$file"
    sed -i.bak "s|VITE_SUPABASE_PUBLISHABLE_KEY=.*|VITE_SUPABASE_PUBLISHABLE_KEY=\"${NEW_ANON_KEY}\"|g" "$file"
    sed -i.bak "s|VITE_SUPABASE_PROJECT_ID=.*|VITE_SUPABASE_PROJECT_ID=\"${NEW_PROJECT_ID}\"|g" "$file"
    sed -i.bak "s|VITE_WAITLIST_SUPABASE_URL=.*|VITE_WAITLIST_SUPABASE_URL=\"${NEW_PROJECT_URL}\"|g" "$file"
    sed -i.bak "s|VITE_WAITLIST_SUPABASE_ANON_KEY=.*|VITE_WAITLIST_SUPABASE_ANON_KEY=\"${NEW_ANON_KEY}\"|g" "$file"
    success "Updated $file"
  else
    warn "$file not found — skipping."
  fi
}

update_env "$ENV_FILE"
update_env "$ENV_LOCAL"

if [ ! -f "$ENV_FILE" ] && [ ! -f "$ENV_LOCAL" ]; then
  cat > ".env.local" << EOF
VITE_SUPABASE_URL="${NEW_PROJECT_URL}"
VITE_SUPABASE_PUBLISHABLE_KEY="${NEW_ANON_KEY}"
VITE_SUPABASE_PROJECT_ID="${NEW_PROJECT_ID}"
VITE_WAITLIST_SUPABASE_URL="${NEW_PROJECT_URL}"
VITE_WAITLIST_SUPABASE_ANON_KEY="${NEW_ANON_KEY}"
EOF
  success "Created .env.local with new Supabase credentials."
fi

OLD_PROJECT_ID="gvjfcdttfczigeqsilml"
log "Searching codebase for old project ID: $OLD_PROJECT_ID..."
matches=$(grep -rl "$OLD_PROJECT_ID" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=.next \
  --exclude="*.bak" \
  --exclude="poonji_supabase_setup.sh" 2>/dev/null || true)

if [ -n "$matches" ]; then
  echo "$matches" | while read -r file; do
    sed -i.bak "s|${OLD_PROJECT_ID}|${NEW_PROJECT_ID}|g" "$file"
    success "Updated: $file"
  done
else
  warn "Old project ID not found in codebase."
fi

log "Testing Edge Function with a test email..."
RESPONSE=$(curl -s -X POST \
  "${NEW_PROJECT_URL}/functions/v1/waitlist-submit" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","birthday":"2000-01-01","email":"test-setup@poonji.ai","turnstile_token":"localhost-bypass-token"}')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"success":true'; then
  success "Edge Function is working correctly!"
else
  warn "Unexpected response. Check: supabase functions logs waitlist-submit"
fi

echo ""
echo "=============================================="
echo -e "${GREEN}  All done! Summary:${NC}"
echo "=============================================="
echo ""
echo "  New Project URL : $NEW_PROJECT_URL"
echo "  Edge Function   : ${NEW_PROJECT_URL}/functions/v1/waitlist-submit"
echo "  Waitlist Table  : waitlist"
echo ""
