-- Enable Storage Extension (Usually enabled by default)
-- Create a public bucket called 'images'
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow anyone to upload to 'images' (For Demo purposes - restricted in prod)
create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'images' );

-- Policy to allow anyone to see images
create policy "Public Select"
on storage.objects for select
using ( bucket_id = 'images' );
