import bcrypt from 'bcrypt-react-native';
import { getUsers, addUser, saveSession, clearSession, getSession } from './storage';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

/**
 * Verify a password
 */
export const verifyPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};

/**
 * Login user
 */
export const login = async (username, password) => {
    try {
        const users = await getUsers();
        const user = users.find(u => u.username === username);

        if (!user) return null;

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) return null;

        const session = {
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString(),
        };

        await saveSession(session);
        return session;

    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
};

/**
 * Logout user
 */
export const logout = async () => {
    await clearSession();
};

/**
 * Create user
 */
export const createUser = async (userData) => {
    try {
        const passwordHash = await hashPassword(userData.password);

        const newUser = await addUser({
            name: userData.name,
            username: userData.username,
            passwordHash,
            role: userData.role || 'user',
        });

        const { passwordHash: _, ...userWithoutHash } = newUser;
        return userWithoutHash;

    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
    return await getSession();
};
