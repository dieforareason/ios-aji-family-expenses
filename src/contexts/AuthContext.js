import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentSession, logout } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const session = await getCurrentSession();
            setUser(session);
        } catch (error) {
            console.error('Error checking session:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = (userData) => {
        setUser(userData);
    };

    const signOut = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
