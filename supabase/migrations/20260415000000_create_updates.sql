CREATE TABLE public.updates (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text NOT NULL,
  date        text NOT NULL,
  icon        text NOT NULL,
  img         text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public website)
CREATE POLICY "public read" ON public.updates
  FOR SELECT USING (true);

-- Only authenticated admins can write
CREATE POLICY "admin write" ON public.updates
  FOR ALL USING (auth.role() = 'authenticated');
