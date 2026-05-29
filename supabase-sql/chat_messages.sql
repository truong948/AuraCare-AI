-- Chat Messages table for persistent chat history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  image_url text,
  suggestions jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created 
  ON public.chat_messages(user_id, created_at DESC);

-- RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can read their own messages
CREATE POLICY "Users read own chat" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "Users insert own chat" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages (clear history)
CREATE POLICY "Users delete own chat" ON public.chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Admin can read all
CREATE POLICY "Admin read all chat" ON public.chat_messages
  FOR SELECT USING (public.is_admin());
