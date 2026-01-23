import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://varphhzvnbvjatnixbxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcnBoaHp2bmJ2amF0bml4Ynh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDI3OTQsImV4cCI6MjA4MzYxODc5NH0.OHlOk-VkoqIiMEa3noUgKw685noU544nITjN46xXPrA';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
