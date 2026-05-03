-- Run this in your Supabase SQL Editor to create the necessary tables for ToolsWaala

-- Table for UPI Payment Pages
CREATE TABLE public.upi_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    upi_id TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2),
    theme INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add an index on the slug for fast lookups
CREATE INDEX upi_pages_slug_idx ON public.upi_pages (slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.upi_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to UPI pages
CREATE POLICY "Allow public read access" 
ON public.upi_pages FOR SELECT 
USING (true);

-- Allow public insert access (for the free tool without auth)
CREATE POLICY "Allow public insert access" 
ON public.upi_pages FOR INSERT 
WITH CHECK (true);
