import { supabase } from '@/lib/customSupabaseClient';

/**
 * Health Check Utility
 * Diagnoses Supabase connection and configuration issues
 */
export const healthCheck = {
  /**
   * Run a full system health check
   * @returns {Promise<{status: 'healthy'|'degraded'|'critical', checks: object, message: string}>}
   */
  run: async () => {
    const results = {
      connection: { status: 'pending', details: null },
      usersTable: { status: 'pending', details: null },
      adminUser: { status: 'pending', details: null }
    };

    try {
      // 1. Check Basic Connection with Supabase auth endpoint
      // This is more reliable than checking tables
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        results.connection = { status: 'failed', details: sessionError.message };
        return { status: 'critical', checks: results, message: 'Could not connect to Supabase. Please check your internet connection.' };
      }
      results.connection = { status: 'ok', details: 'Connected successfully' };

      // 2. Try to query users table, but handle gracefully if it doesn't exist
      try {
        const { data: userData, error: tableError } = await supabase
          .from('users')
          .select('id, role')
          .limit(1)
          .timeout(5000); // 5 second timeout
        
        if (tableError) {
          // Table doesn't exist or RLS blocked - but we can still proceed
          results.usersTable = { status: 'warning', details: 'Users table not fully accessible yet' };
          console.warn('Users table check warning:', tableError.message);
        } else {
          results.usersTable = { status: 'ok', details: 'Table accessible' };
        }
      } catch (tableQueryError) {
        results.usersTable = { status: 'warning', details: 'Could not verify users table' };
        console.warn('Users table query error:', tableQueryError.message);
      }

      // 3. Try to check for Admin User (non-critical)
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('users')
          .select('email')
          .eq('role', 'admin')
          .limit(1)
          .timeout(5000); // 5 second timeout

        if (adminError) {
          results.adminUser = { status: 'warning', details: 'Could not verify admin user yet' };
          console.warn('Admin check warning:', adminError.message);
        } else if (!adminData || adminData.length === 0) {
          results.adminUser = { status: 'missing', details: 'No admin user found yet' };
        } else {
          results.adminUser = { status: 'ok', details: 'Admin user found' };
        }
      } catch (adminQueryError) {
        results.adminUser = { status: 'warning', details: 'Could not verify admin user' };
        console.warn('Admin check error:', adminQueryError.message);
      }

      // Final status: Only critical if connection failed
      // Degraded if tables not accessible
      // Healthy if everything works
      const hasConnectionIssue = results.connection.status !== 'ok';
      const hasTableIssues = results.usersTable.status === 'failed';

      if (hasConnectionIssue) {
        return { 
          status: 'critical', 
          checks: results, 
          message: 'Connection error. Please check your internet and try again.' 
        };
      }

      if (hasTableIssues) {
        return { 
          status: 'degraded', 
          checks: results, 
          message: 'Supabase connected but database not fully configured yet. Run database setup.' 
        };
      }

      return { 
        status: 'healthy', 
        checks: results, 
        message: 'All systems operational.' 
      };

    } catch (err) {
      console.error('Health check error:', err);
      return { 
        status: 'critical', 
        checks: results, 
        message: `Connection error: ${err.message}` 
      };
    }
  }
};