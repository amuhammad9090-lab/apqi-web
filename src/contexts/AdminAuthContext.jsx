import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
	const context = useContext(AdminAuthContext);
	if (context === undefined) {
		throw new Error('useAdminAuth must be used within an AdminAuthProvider');
	}
	return context;
};

export const AdminAuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const checkAdminPrivileges = async (userId) => {
		if (!userId) return null;

		try {
			// Fetch role from public.users in Supabase
			const { data, error } = await supabase
				.from('users')
				.select('role')
				.eq('id', userId)
				.single();

			if (error) {
				// If RLS blocks us or row missing, assume not admin
				console.warn('Admin check failed:', error.message);
				return null;
			}

			if (data?.role === 'admin') {
				return { id: userId, role: 'admin' };
			}
			return null;
		} catch (err) {
			console.error('Admin privilege check error:', err);
			return null;
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				const adminUser = await checkAdminPrivileges(currentUser.uid);
				if (adminUser) {
					setUser({ ...currentUser, ...adminUser });
				} else {
					setUser(null);
				}
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const signInWithPassword = async (email, password) => {
		try {
			setLoading(true);
			setError(null);

			// 1. Perform Firebase Auth Login
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const firebaseUser = userCredential.user;

			// 2. Check Permissions in Supabase immediately
			const adminUser = await checkAdminPrivileges(firebaseUser.uid);

			if (!adminUser) {
				await firebaseSignOut(auth);
				throw new Error("Access Denied: You do not have administrator privileges.");
			}

			// Success
			setUser({ ...firebaseUser, ...adminUser });
			return { user: firebaseUser, error: null };

		} catch (err) {
			console.error("Admin Login Error:", err);
			setError(err.message);
			return { user: null, error: err };
		} finally {
			setLoading(false);
		}
	};

	const signOut = async () => {
		try {
			await firebaseSignOut(auth);
			setUser(null);
		} catch (err) {
			setError(err.message);
		}
	};

	const value = {
		user,
		adminUser: user,
		loading,
		error,
		signInWithPassword,
		login: signInWithPassword,
		signOut,
		logout: signOut  // Alias for compatibility
	};

	return (
		<AdminAuthContext.Provider value={value}>
			{children}
		</AdminAuthContext.Provider>
	);
};