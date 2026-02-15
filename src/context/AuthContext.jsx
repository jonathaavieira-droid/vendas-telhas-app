import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const ADMIN_EMAIL = 'jonatha.vieira@telhaco.com.br';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user || null;
            setUser(u);
            if (u) {
                loadRole(u.id, u.email);
            } else {
                setLoading(false);
            }
        }).catch(() => {
            setLoading(false);
        });

        // 2. Listen for login/logout
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user || null;
            setUser(u);
            if (u) {
                loadRole(u.id, u.email);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadRole = async (userId, email) => {
        // Admin bypass by email — instant, no DB needed
        if (email === ADMIN_EMAIL) {
            setRole('admin');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .maybeSingle();

            if (!error && data?.role) {
                setRole(data.role);
            } else {
                // Profile not found — keep null, don't override to 'vendor'
                console.warn("Profile not found for", userId, error?.message);
                setRole(null);
            }
        } catch {
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try { await supabase.auth.signOut(); } catch { }
        setRole(null);
        setUser(null);
        window.localStorage.clear();
        window.location.href = '/login';
    };

    // Admin check: DB role OR email match
    const isAdmin = role === 'admin' || user?.email === ADMIN_EMAIL;
    const canEditMainData = isAdmin;

    // For display: if role didn't load from DB, show based on isAdmin
    const displayRole = isAdmin ? 'admin' : (role || 'vendor');

    return (
        <AuthContext.Provider value={{ user, role: displayRole, loading, signOut, isAdmin, canEditMainData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
