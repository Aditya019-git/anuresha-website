import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jiicmekkvausrlmjlxla.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppaWNtZWtrdmF1c3JsbWpseGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDI0MDQsImV4cCI6MjA5MzExODQwNH0.fRiVQwMJUs4xwz_HK_wkkToOfQPdp9Flt4Glj20YAnA';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppaWNtZWtrdmF1c3JsbWpseGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU0MjQwNCwiZXhwIjoyMDkzMTE4NDA0fQ.QZSdKuiA8-Dp1k1vaJgCD6N_7uZFNVSCBknbVtXyxc0';

export const supabase = createClient(supabaseUrl, anonKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
