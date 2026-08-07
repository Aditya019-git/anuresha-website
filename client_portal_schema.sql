-- 1. Create Clients Table
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT NOT NULL, -- For a real production app, hash this! For a sem project, plain/simple hashing is okay.
  otp_code TEXT,
  otp_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Projects Table (Replaces basic leads for serious clients)
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  property_type TEXT NOT NULL, -- e.g., 'Residential', 'Commercial'
  property_size TEXT NOT NULL, -- e.g., '3BHK', '2000 Sq.Ft'
  selected_services JSONB NOT NULL, -- e.g., ['Plumbing', 'Painting']
  estimated_price TEXT NOT NULL, -- e.g., '750000 - 820000'
  status TEXT DEFAULT 'Pending Approval', -- 'Pending Approval', 'In Progress', 'Completed'
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add completed_services for Milestone tracking
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS completed_services TEXT[] DEFAULT '{}';

-- 3. Create Project Updates Table (For the live timeline)
CREATE TABLE public.project_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  update_text TEXT NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array of Supabase Storage URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Update existing Leads table to handle drop-offs (The Capture First strategy)
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS property_type TEXT,
ADD COLUMN IF NOT EXISTS property_size TEXT,
ADD COLUMN IF NOT EXISTS selected_services JSONB,
ADD COLUMN IF NOT EXISTS estimated_price TEXT;

-- 5. Reviews Table (For Client Feedback on Completed Projects)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bills Table (For Dynamic Invoicing)
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    items JSONB NOT NULL DEFAULT '[]', -- Array of { description, quantity, unit, rate, amount }
    subtotal NUMERIC DEFAULT 0,
    gst_percentage NUMERIC DEFAULT 18,
    grand_total NUMERIC DEFAULT 0,
    bank_details JSONB, -- { accountName, accountNumber, ifsc, bankName, upiId }
    status TEXT DEFAULT 'Draft', -- 'Draft', 'Published', 'Paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
