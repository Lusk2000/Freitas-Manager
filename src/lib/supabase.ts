import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://chjpachegjlbqvnkjyxt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoanBhY2hlZ2psYnF2bmtqeXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Nzg0NjQsImV4cCI6MjA5MjU1NDQ2NH0.XytvIRl4Vaw4IuB52DVAU1iLVO1pmuKWe6WadZA7shk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
