import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://momqrkldbyqjmyvisgcb.supabase.co/rest/v1/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbXFya2xkYnlxam15dmlzZ2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTAwOTYsImV4cCI6MjA5MzYyNjA5Nn0.DHxzJQxW85Va8_7tdis2tCLXisnSJMeY7j7319fv0u8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)