-- Strengthen RLS on conversations/messages to enforce row ownership

-- Conversations: ensure all operations are scoped to the authenticated user
alter table public.conversations enable row level security;

create policy if not exists "Users can view own conversations"
  on public.conversations
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert own conversations"
  on public.conversations
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update own conversations"
  on public.conversations
  for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete own conversations"
  on public.conversations
  for delete
  using (auth.uid() = user_id);

-- Messages: ensure all operations are scoped to the owning conversation/user
alter table public.messages enable row level security;

create policy if not exists "Users can view own messages"
  on public.messages
  for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and c.user_id = auth.uid()
    )
  );

create policy if not exists "Users can insert own messages"
  on public.messages
  for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and c.user_id = auth.uid()
    )
  );

create policy if not exists "Users can update own messages"
  on public.messages
  for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and c.user_id = auth.uid()
    )
  );

create policy if not exists "Users can delete own messages"
  on public.messages
  for delete
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and c.user_id = auth.uid()
    )
  );
