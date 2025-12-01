import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { isInitialized, getUsers } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import FirstTimeSetupScreen from '../screens/FirstTimeSetupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ExpenseListScreen from '../screens/ExpenseListScreen';
import AddEditExpenseScreen from '../screens/AddEditExpenseScreen';
import ReportsScreen from '../screens/ReportsScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon Helper
const TabIcon = ({ name, color, size }) => {
    // In a real app, use Ionicons or similar
    // For now, we'll use text as placeholders since we didn't install vector icons
    const icons = {
        Dashboard: '🏠',
        Expenses: '💰',
        Reports: '📊',
        Admin: '⚙️',
    };

    return <Text style={{ fontSize: size, color }}>{icons[name] || '?'}</Text>;
};
import { Text } from 'react-native';

const AdminTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => (
                <TabIcon name="Admin" color={color} size={size} />
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.text.secondary,
        })}
    >
        <Tab.Screen name="Users" component={UserManagementScreen} options={{ title: 'Kelola User' }} />
        <Tab.Screen name="Categories" component={CategoryManagementScreen} options={{ title: 'Kelola Kategori' }} />
    </Tab.Navigator>
);

const MainTabs = () => {
    const { user, signOut } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => (
                    <TabIcon name={route.name} color={color} size={size} />
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text.secondary,
                headerRight: () => (
                    <Text
                        onPress={signOut}
                        style={{ marginRight: 16, color: colors.error, fontWeight: '600' }}
                    >
                        Logout
                    </Text>
                ),
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Beranda' }} />
            <Tab.Screen name="Expenses" component={ExpenseListScreen} options={{ title: 'Pengeluaran' }} />
            <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Laporan' }} />
            {isAdmin && (
                <Tab.Screen
                    name="Admin"
                    component={AdminTabs}
                    options={{
                        title: 'Admin',
                        headerShown: false
                    }}
                />
            )}
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { user, loading } = useAuth();
    const [initialized, setInitialized] = useState(null);

    useEffect(() => {
        checkInitialization();
    }, []);

    const checkInitialization = async () => {
        const result = await isInitialized();
        if (result) {
            // Check if users exist - if app is initialized but no users, reset
            const users = await getUsers();
            if (users.length === 0) {
                // App was initialized but no users exist - reset initialization
                await AsyncStorage.removeItem('@aji_initialized');
                setInitialized(false);
                return;
            }
        }
        setInitialized(result);
    };

    if (loading || initialized === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!initialized ? (
                    <Stack.Screen name="FirstTimeSetup">
                        {props => <FirstTimeSetupScreen {...props} onComplete={() => setInitialized(true)} />}
                    </Stack.Screen>
                ) : !user ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen
                            name="AddExpense"
                            component={AddEditExpenseScreen}
                            options={{ headerShown: true, title: 'Pengeluaran' }}
                        />
                        <Stack.Screen
                            name="ExpenseDetail"
                            component={AddEditExpenseScreen} // Reusing for detail view for now
                            options={{ headerShown: true, title: 'Detail Pengeluaran' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
