import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, getCategories, getUsers, deleteExpense } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import ExpenseCard from '../components/ExpenseCard';
import { formatCurrency } from '../utils/formatters';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const ExpenseListScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setLoading(true);
        try {
            const [expensesData, categoriesData, usersData] = await Promise.all([
                getExpenses(),
                getCategories(),
                getUsers(),
            ]);
            setExpenses(expensesData);
            setCategories(categoriesData);
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (expense) => {
        navigation.navigate('AddExpense', { expense });
    };

    const handleDelete = (expense) => {
        Alert.alert(
            'Hapus Pengeluaran',
            'Apakah Anda yakin ingin menghapus pengeluaran ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteExpense(expense.id);
                            loadData();
                        } catch (error) {
                            Alert.alert('Error', 'Gagal menghapus pengeluaran');
                        }
                    },
                },
            ]
        );
    };

    const canEditExpense = (expense) => {
        return user?.role === 'admin' || expense.userId === user?.userId;
    };

    // Sort expenses
    const sortedExpenses = [...expenses].sort((a, b) => {
        if (sortBy === 'date') {
            const comparison = new Date(b.date) - new Date(a.date);
            return sortOrder === 'desc' ? comparison : -comparison;
        } else {
            const comparison = parseFloat(b.amount) - parseFloat(a.amount);
            return sortOrder === 'desc' ? comparison : -comparison;
        }
    });

    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    const renderExpense = ({ item }) => {
        const category = categories.find(c => c.id === item.categoryId);
        const canEdit = canEditExpense(item);

        return (
            <ExpenseCard
                expense={item}
                category={category}
                onPress={() => { }}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
                canEdit={canEdit}
            />
        );
    };

    return (
        <View style={commonStyles.container}>
            <View style={styles.header}>
                <Text style={styles.totalLabel}>Total Pengeluaran</Text>
                <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
                <Text style={styles.count}>{expenses.length} transaksi</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => {
                        if (sortBy === 'date') {
                            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                        } else {
                            setSortBy('date');
                            setSortOrder('desc');
                        }
                    }}
                >
                    <Text style={styles.sortText}>
                        Tanggal {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => {
                        if (sortBy === 'amount') {
                            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                        } else {
                            setSortBy('amount');
                            setSortOrder('desc');
                        }
                    }}
                >
                    <Text style={styles.sortText}>
                        Jumlah {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={sortedExpenses}
                renderItem={renderExpense}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadData} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Belum ada pengeluaran</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        color: colors.primaryLight,
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text.white,
        marginVertical: spacing.xs,
    },
    count: {
        fontSize: 14,
        color: colors.primaryLight,
    },
    controls: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sortButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        backgroundColor: colors.background,
        borderRadius: 8,
    },
    sortText: {
        fontSize: 14,
        color: colors.text.primary,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.text.hint,
    },
    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 32,
        color: colors.text.white,
    },
});

export default ExpenseListScreen;
