import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kpmfrpeytuuhzutuokhn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbWZycGV5dHV1aHp1dHVva2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTI4NjQsImV4cCI6MjA4ODcyODg2NH0.OmWkmKHZ--X9PWYZRv7vWsze4yq733fncjWtcZjS6vk";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
