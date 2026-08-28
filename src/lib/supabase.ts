import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://plcniuneauibmwkymooy.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsY25pdW5lYXVpYm13a3ltb295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODg3OTMsImV4cCI6MjEwMzQ2NDc5M30.pPAVTykYQlOsYIRGkK0Diaaz__kLgCSOP5S8_7AV54I";

// Live Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = () => true;