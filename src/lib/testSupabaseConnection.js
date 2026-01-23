import { supabase } from '@/lib/customSupabaseClient';

/**
 * Diagnostic tool to verify Supabase connectivity and configuration
 */
export const testSupabaseConnection = async () => {
  console.group('🔌 Supabase Connection Diagnostics');
  
  const results = {
    urlConfigured: false,
    keyConfigured: false,
    connectionSuccessful: false,
    latency: 0,
    error: null,
    details: ''
  };

  try {
    // 1. Check Environment Variables (Client-side check)
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    results.urlConfigured = !!url && url.length > 0;
    results.keyConfigured = !!key && key.length > 0;

    console.log('Environment Check:', {
      URL_SET: results.urlConfigured,
      KEY_SET: results.keyConfigured
    });

    if (!results.urlConfigured || !results.keyConfigured) {
      results.error = 'Missing Supabase environment variables.';
      results.details = 'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set in your .env file.';
      throw new Error(results.error);
    }

    // 2. Test Connection & Latency by trying to query a public table
    const start = performance.now();
    
    const { error, status } = await supabase
      .from('news') // Use a public table like 'news'
      .select('id', { count: 'exact', head: true }); // Lightweight query to check connectivity
      
    const end = performance.now();
    results.latency = Math.round(end - start);

    if (error) {
      // Common RLS/Auth errors (401, 403) mean the connection works, but access is denied.
      // For a connection test, this still counts as a successful connection to the server.
      if (status === 401 || status === 403) {
        console.warn('⚠️ Connection successful, but access denied (RLS/Auth). This is normal for public read attempts on protected tables. Latency: %sms', results.latency);
        results.connectionSuccessful = true;
        results.details = 'Supabase server reachable, but RLS or authentication might be restricting access to specific data.';
      } else if (error.message.includes("fetch failed") || error.code === 'ECONNREFUSED') {
        results.error = 'Network connection failed.';
        results.details = `Could not reach Supabase server. Check your internet connection or if the Supabase URL is correct. Error: ${error.message}`;
      } else {
        results.error = 'Supabase client error.';
        results.details = `An unexpected error occurred while connecting. Details: ${error.message} (Code: ${error.code || 'N/A'}, Status: ${status || 'N/A'})`;
      }
      if (results.error) throw new Error(results.error);
    } else {
      results.connectionSuccessful = true;
      console.log(`✅ Supabase connection verified in ${results.latency}ms.`);
    }

    return { success: true, ...results };

  } catch (error) {
    if (!results.error) { // If error wasn't already set by a more specific check
      results.error = `Supabase connection failed: ${error.message}`;
      results.details = results.details || `An unexpected error occurred: ${error.message}`;
    }
    console.error('❌ Supabase Connection Error:', results.error, results.details);
    return { success: false, ...results };
  } finally {
    console.groupEnd();
  }
};