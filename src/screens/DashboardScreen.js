import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, getCategories } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/StatCard';
import ExpenseCard from '../components/ExpenseCard';
import { formatCurrency } from '../utils/formatters';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setLoading(true);
        try {
            const [expensesData, categoriesData] = await Promise.all([
                getExpenses(),
                getCategories(),
            ]);
            setExpenses(expensesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(exp => new Date(exp.date).toDateString() === today);
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    // Recent expenses (last 5)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <View style={commonStyles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadData} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.greeting}>Halo, {user?.name}!</Text>
                    <Text style={styles.role}>{user?.role === 'admin' ? 'Administrator' : 'User'}</Text>
                </View>

                <StatCard
                    title="Total Pengeluaran"
                    value={formatCurrency(totalExpenses)}
                    subtitle={`${expenses.length} transaksi`}
                    color={colors.primary}
                />

                <StatCard
                    title="Pengeluaran Hari Ini"
                    value={formatCurrency(todayTotal)}
                    subtitle={`${todayExpenses.length} transaksi`}
                    color={colors.secondary}
                />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pengeluaran Terbaru</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                            <Text style={styles.seeAll}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>

                    {recentExpenses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Belum ada pengeluaran</Text>
                            <TouchableOpacity
                                style={commonStyles.button}
                                onPress={() => navigation.navigate('AddExpense')}
                            >
                                <Text style={commonStyles.buttonText}>Tambah Pengeluaran</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        recentExpenses.map(expense => {
                            const category = categories.find(c => c.id === expense.categoryId);
                            return (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    category={category}
                                    onPress={() => navigation.navigate('ExpenseDetail', { expense })}
                                    canEdit={false}
                                />
                            );
                        })
                    )}
                </View>

                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('AddExpense')}
                    >
                        <Text style={styles.actionButtonText}>+ Tambah Pengeluaran</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => navigation.navigate('Reports')}
                    >
                        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                            📊 Lihat Laporan
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: spacing.lg,
        backgroundColor: colors.primary,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.white,
    },
    role: {
        fontSize: 14,
        color: colors.primaryLight,
        marginTop: spacing.xs,
    },
    section: {
        marginTop: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
    },
    seeAll: {
        fontSize: 14,
        color: colors.primary,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.text.hint,
        marginBottom: spacing.md,
    },
    quickActions: {
        padding: spacing.md,
        marginTop: spacing.md,
    },
    actionButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: spacing.md,
        alignItems: 'center',
        marginVertical: spacing.sm,
    },
    actionButtonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        color: colors.primary,
    },
});

export default DashboardScreen;
