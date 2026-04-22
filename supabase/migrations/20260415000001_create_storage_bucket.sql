INSERT INTO storage.buckets (id, name, public)
VALUES ('update-images', 'update-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "admin upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'update-images');

-- Allow public read
CREATE POLICY "public read images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'update-images');
