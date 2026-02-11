
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '@/lib/customSupabaseClient';
import { securityLogger } from '@/lib/securityLogger';
import { cookieManager } from '@/lib/cookieManager';
import { loginUser, logoutUser, registerUser } from '@/lib/firebaseAuth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
  const [loading, setLoading] = useState(true);

  // Helper to fetch user role from custom 'users' table in Supabase
  const fetchUserRole = async (userId) => {
    try {
      // Use maybeSingle() to safely handle missing user records
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        securityLogger.logError(error, 'AuthContext.fetchUserRole');
        return 'member'; // Default to member on error
      }
      
      // If data is null (user not found in table), default to member
      return data?.role || 'member';
    } catch (err) {
      securityLogger.logError(err, 'AuthContext.fetchUserRole.catch');
      return 'member';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          const role = await fetchUserRole(user.uid);
          setCurrentUser(user);
          setUserRole(role);
          // Set a non-HttpOnly cookie for client-side awareness
          cookieManager.setCookie('apqi_user_session', 'active', 7);
          securityLogger.logAuthAttempt(true, 'session_restore');
        } else {
          setCurrentUser(null);
          setUserRole(null);
          cookieManager.removeCookie('apqi_user_session');
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    const { user, error } = await registerUser(email, password);
    if (error) {
      securityLogger.logAuthAttempt(false, email);
      throw error;
    }
    securityLogger.logAuthAttempt(true, email);
    return user;
  };

  const login = async (email, password) => {
    const { user, error } = await loginUser(email, password);
    if (error) {
      securityLogger.logAuthAttempt(false, email);
      throw error;
    }
    
    // Fetch role immediately after login
    if (user) {
      const role = await fetchUserRole(user.uid);
      setUserRole(role);
    }

    securityLogger.logAuthAttempt(true, email);
    return user;
  };

  const logout = async () => {
    const { error } = await logoutUser();
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
