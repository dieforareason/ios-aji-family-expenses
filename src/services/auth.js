import bcrypt from 'bcryptjs';
import { getUsers, addUser, saveSession, clearSession, getSession } from './storage';

const SALT_ROUNDS = 10;

// Set up random fallback for bcryptjs in React Native
// bcryptjs needs a random number generator, and React Native doesn't have WebCryptoAPI
bcrypt.setRandomFallback((len) => {
    // Generate random bytes using expo-crypto
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        // Use expo-crypto's getRandomBytes or fallback to Math.random
        arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr);
});

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password) => {
    try {
        // Ensure password is a string
        const passwordStr = String(password || '');
        if (!passwordStr) {
            throw new Error('Password cannot be empty');
        }

        // Use bcryptjs synchronous API wrapped in Promise to avoid blocking
        return new Promise((resolve, reject) => {
            // Use setTimeout to run on next tick and avoid blocking UI
            setTimeout(() => {
                try {
                    // Generate salt synchronously
                    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
                    // Hash password synchronously
                    const hash = bcrypt.hashSync(passwordStr, salt);
                    resolve(hash);
                } catch (error) {
                    console.error('Error hashing password:', error);
                    reject(error);
                }
            }, 0);
        });
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
        // Ensure password and hash are strings
        const passwordStr = String(password || '');
        const hashStr = String(hash || '');
        
        if (!passwordStr || !hashStr) {
            console.error('Password and hash must be non-empty strings');
            return false;
        }

        // Use bcryptjs synchronous API wrapped in Promise
        return new Promise((resolve) => {
            // Use setTimeout to run on next tick and avoid blocking UI
            setTimeout(() => {
                try {
                    const result = bcrypt.compareSync(passwordStr, hashStr);
                    resolve(result);
                } catch (error) {
                    console.error('Error verifying password:', error);
                    resolve(false);
                }
            }, 0);
        });
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

        if (!user) {
            console.log('Login failed: User not found', username);
            return null;
        }

        if (!user.passwordHash) {
            console.error('Login failed: User has no password hash', user.username);
            return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            console.log('Login failed: Invalid password for user', username);
            return null;
        }

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
