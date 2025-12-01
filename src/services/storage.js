import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    USERS: '@aji_users',
    CATEGORIES: '@aji_categories',
    EXPENSES: '@aji_expenses',
    SESSION: '@aji_session',
    INITIALIZED: '@aji_initialized',
};

// Default categories in Indonesian
const DEFAULT_CATEGORIES = [
    { id: '1', name: 'Makanan & Minuman', color: '#FF6384', createdAt: new Date().toISOString() },
    { id: '2', name: 'Transportasi', color: '#36A2EB', createdAt: new Date().toISOString() },
    { id: '3', name: 'Belanja', color: '#FFCE56', createdAt: new Date().toISOString() },
    { id: '4', name: 'Tagihan', color: '#4BC0C0', createdAt: new Date().toISOString() },
    { id: '5', name: 'Kesehatan', color: '#9966FF', createdAt: new Date().toISOString() },
    { id: '6', name: 'Pendidikan', color: '#FF9F40', createdAt: new Date().toISOString() },
    { id: '7', name: 'Hiburan', color: '#FF6384', createdAt: new Date().toISOString() },
    { id: '8', name: 'Lainnya', color: '#C9CBCF', createdAt: new Date().toISOString() },
];

// User operations
export const getUsers = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.USERS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
};

export const saveUsers = async (users) => {
    try {
        await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

export const addUser = async (user) => {
    const users = await getUsers();
    const newUser = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await saveUsers(users);
    return newUser;
};

export const deleteUser = async (userId) => {
    const users = await getUsers();
    const filtered = users.filter(u => u.id !== userId);
    await saveUsers(filtered);
};

// Category operations
export const getCategories = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
};

export const saveCategories = async (categories) => {
    try {
        await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
        console.error('Error saving categories:', error);
    }
};

export const addCategory = async (category) => {
    const categories = await getCategories();
    const newCategory = {
        ...category,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    await saveCategories(categories);
    return newCategory;
};

export const deleteCategory = async (categoryId) => {
    const categories = await getCategories();
    const filtered = categories.filter(c => c.id !== categoryId);
    await saveCategories(filtered);
};

// Expense operations
export const getExpenses = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.EXPENSES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting expenses:', error);
        return [];
    }
};

export const saveExpenses = async (expenses) => {
    try {
        await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
        console.error('Error saving expenses:', error);
    }
};

export const addExpense = async (expense) => {
    const expenses = await getExpenses();
    const newExpense = {
        ...expense,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    await saveExpenses(expenses);
    return newExpense;
};

export const updateExpense = async (expenseId, updates) => {
    const expenses = await getExpenses();
    const index = expenses.findIndex(e => e.id === expenseId);
    if (index !== -1) {
        expenses[index] = {
            ...expenses[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        await saveExpenses(expenses);
        return expenses[index];
    }
    return null;
};

export const deleteExpense = async (expenseId) => {
    const expenses = await getExpenses();
    const filtered = expenses.filter(e => e.id !== expenseId);
    await saveExpenses(filtered);
};

// Session operations
export const getSession = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.SESSION);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
};

export const saveSession = async (session) => {
    try {
        await AsyncStorage.setItem(KEYS.SESSION, JSON.stringify(session));
    } catch (error) {
        console.error('Error saving session:', error);
    }
};

export const clearSession = async () => {
    try {
        await AsyncStorage.removeItem(KEYS.SESSION);
    } catch (error) {
        console.error('Error clearing session:', error);
    }
};

// Initialize app with default data
export const isInitialized = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.INITIALIZED);
        return data === 'true';
    } catch (error) {
        return false;
    }
};

export const initializeApp = async (adminPassword) => {
    try {
        // Create default categories
        await saveCategories(DEFAULT_CATEGORIES);

        // Mark as initialized
        await AsyncStorage.setItem(KEYS.INITIALIZED, 'true');

        return true;
    } catch (error) {
        console.error('Error initializing app:', error);
        return false;
    }
};
