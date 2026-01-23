import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { securityLogger } from '@/lib/securityLogger';
import { cookieManager } from '@/lib/cookieManager';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
  const [loading, setLoading] = useState(true);

  // Helper to fetch user role from custom 'users' table
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        securityLogger.logError(error, 'AuthContext.fetchUserRole');
        return 'member'; // Default to member on error or if user doesn't exist yet in public.users
      }
      return data?.role || 'member';
    } catch (err) {
      securityLogger.logError(err, 'AuthContext.fetchUserRole.catch');
      return 'member';
    }
  };

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          securityLogger.logError(error, 'AuthContext.getSession');
        }

        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setCurrentUser(session.user);
          setUserRole(role);
          // Set a non-HttpOnly cookie for client-side awareness if needed
          cookieManager.setCookie('apqi_user_session', 'active', 7);
        } else {
          setCurrentUser(null);
          setUserRole(null);
          cookieManager.removeCookie('apqi_user_session');
        }
      } catch (error) {
        securityLogger.logError(error, 'AuthContext.getSession.catch');
      } finally {
        setLoading(false);
      }
    };
    getSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Only fetch role if we don't have it or user changed
        if (!currentUser || currentUser.id !== session.user.id) {
            const role = await fetchUserRole(session.user.id);
            setUserRole(role);
        }
        setCurrentUser(session.user);
        cookieManager.setCookie('apqi_user_session', 'active', 7);
        securityLogger.logAuthAttempt(true, 'session_refresh');
      } else {
        setCurrentUser(null);
        setUserRole(null);
        cookieManager.removeCookie('apqi_user_session');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [currentUser]); // Added currentUser to dependency array to ensure role is fetched if currentUser changes

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      securityLogger.logAuthAttempt(false, email);
      throw error;
    }
    securityLogger.logAuthAttempt(true, email);
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      securityLogger.logAuthAttempt(false, email);
      throw error;
    }
    
    // Fetch role immediately after login
    if (data.user) {
      const role = await fetchUserRole(data.user.id);
      setUserRole(role);
    }

    securityLogger.logAuthAttempt(true, email);
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      securityLogger.logError(error, 'AuthContext.logout');
      throw error;
    }
    setCurrentUser(null);
    setUserRole(null);
    cookieManager.removeCookie('apqi_user_session');
    cookieManager.clearAll(); // Clear other non-essential cookies
  };

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};