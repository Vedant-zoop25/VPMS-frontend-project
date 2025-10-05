// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// **IMPORTANT**: Replace with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://paqfannuibnjeszhhzwt.supabase.co';
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcWZhbm51aWJuamVzemhoend0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjA4MzgsImV4cCI6MjA3NTEzNjgzOH0.L3oFR68termORrxkN6FToubpRavtsq3K94LzI-7KdqM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);