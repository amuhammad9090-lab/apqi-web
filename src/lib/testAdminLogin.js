import { supabase } from '@/lib/customSupabaseClient';

/**
 * Task 4: Test Login Functionality
 * Usage: Import this function in AdminLoginPage or main.jsx and call testAdminLogin()
 * or run it via console if exposed to window.
 */
export const testAdminLogin = async () => {
  console.group("🔐 Admin Login Test Debugger");
  const email = 'admin@apqiquran.com';
  const password = 'Madrasah-000';

  console.log(`Attempting login for: ${email}`);

  try {
    // 1. Test Auth Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Auth Login Failed:", error);
      console.groupEnd();
      return { success: false, error };
    }

    console.log("✅ Auth Login Successful!");
    console.log("User ID:", data.user.id);

    // 2. Test RLS / Admin Role Access
    console.log("Checking 'public.users' for admin role...");
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile Fetch Failed (RLS Issue?):", profileError);
      console.groupEnd();
      return { success: false, error: profileError };
    }

    console.log("✅ Profile Fetched:", profile);
    
    if (profile.role === 'admin') {
      console.log("🎉 SUCCESS: User is verified as ADMIN.");
      console.groupEnd();
      return { success: true, user: data.user, profile };
    } else {
      console.warn("⚠️ WARNING: User logged in but role is NOT 'admin'.");
      console.log("Current Role:", profile.role);
      console.groupEnd();
      return { success: false, error: new Error("User is not admin") };
    }

  } catch (err) {
    console.error("❌ Unexpected Test Error:", err);
    console.groupEnd();
    return { success: false, error: err };
  }
};