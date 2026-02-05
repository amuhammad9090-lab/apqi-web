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
      // We return early here because we can't test connection without credentials
      return { success: false, ...results };
    }

    // 2. Test Connection & Latency by trying to query a public table
    const start = performance.now();
    
    // We use a lightweight query. Even if the table doesn't exist or RLS blocks it,
    // getting a response from the server proves connectivity.
    const { error, status } = await supabase
      .from('news') 
      .select('id', { count: 'exact', head: true }); 
      
    const end = performance.now();
    results.latency = Math.round(end - start);

    if (error) {
      // Common RLS/Auth errors (401, 403) mean the connection works, but access is denied.
      // For a connection test, this still counts as a successful connection to the server.
      if (status === 401 || status === 403) {
        console.warn('⚠️ Connection successful, but access denied (RLS/Auth). This is normal for public read attempts on protected tables. Latency: %sms', results.latency);
        results.connectionSuccessful = true;
        results.details = 'Supabase server reachable, but RLS or authentication might be restricting access to specific data.';
      } else if (error.message && (error.message.includes("fetch failed") || error.message.includes("Failed to fetch"))) {
        results.error = 'Network connection failed.';
        results.details = `Could not reach Supabase server. Check your internet connection or if the Supabase URL is correct. Error: ${error.message}`;
      } else {
        // Other API errors (e.g. 404 table not found) still mean we connected successfully
        if (status === 404 || error.code === 'PGRST200') {
             results.connectionSuccessful = true;
             results.details = 'Connected to Supabase, but the specific table was not found. This is a configuration issue, not a connection issue.';
        } else {
            results.error = 'Supabase client error.';
            results.details = `An unexpected error occurred while connecting. Details: ${error.message} (Code: ${error.code || 'N/A'}, Status: ${status || 'N/A'})`;
        }
      }
      
      if (results.error) {
          // If we explicitly set an error above, return failure
          return { success: false, ...results };
      }
    } 
    
    // If we got here, either no error occurred, or it was a "soft" error (RLS/404) that implies connectivity
    results.connectionSuccessful = true;
    console.log(`✅ Supabase connection verified in ${results.latency}ms.`);
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