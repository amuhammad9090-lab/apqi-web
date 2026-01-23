import { supabase } from '@/lib/customSupabaseClient';

/**
 * Simple Supabase Connection Tester
 * Checks initialization and session retrieval only.
 */
export const testSupabaseAuth = async () => {
  const result = {
    connected: false,
    session: null,
    error: null,
    details: ''
  };

  try {
    // 1. Test Client Initialization
    if (!supabase) {
      throw new Error("Supabase client not initialized.");
    }

    // 2. Try to get session (Tests connection to Auth server)
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    result.connected = true;
    result.session = data.session;
    result.details = "Successfully connected to Supabase Auth.";

  } catch (err) {
    result.error = err.message;
    result.details = "Failed to connect to Supabase.";
    console.error("Supabase Auth Test Failed:", err);
  }

  return result;
};