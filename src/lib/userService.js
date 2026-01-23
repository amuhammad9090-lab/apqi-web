import { supabase } from '@/lib/customSupabaseClient';

/**
 * User Service Utility
 * Handles interactions with the custom 'users' table in Supabase.
 */

export const userService = {
  /**
   * Check if an email is already registered in the custom users table
   * @param {string} email 
   * @returns {Promise<boolean>} - True if exists, false otherwise
   */
  checkEmailExists: async (email) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error('Failed to verify email availability.');
    }
  },

  /**
   * Register a new user into the custom users table
   * @param {Object} userData - User data including hashed password
   * @returns {Promise<Object>} - Created user data
   */
  registerUser: async (userData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }
};