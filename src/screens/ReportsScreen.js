import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, getCategories } from '../services/storage';
import CategoryPieChart from '../components/CategoryPieChart';
import ExpenseLineChart from '../components/ExpenseLineChart';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/formatters';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const ReportsScreen = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('month'); // 'week', 'month', 'year'

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

    const filterExpensesByPeriod = (allExpenses, selectedPeriod) => {
        const now = new Date();
        const start = new Date();

        if (selectedPeriod === 'week') {
            start.setDate(now.getDate() - 7);
        } else if (selectedPeriod === 'month') {
            start.setMonth(now.getMonth() - 1);
        } else if (selectedPeriod === 'year') {
            start.setFullYear(now.getFullYear() - 1);
        }

        return allExpenses.filter(e => new Date(e.date) >= start);
    };

    const filteredExpenses = filterExpensesByPeriod(expenses, period);
    const totalAmount = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const avgAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

    // Prepare Pie Chart Data
    const expensesByCategory = {};
    filteredExpenses.forEach(e => {
        if (!expensesByCategory[e.categoryId]) {
            expensesByCategory[e.categoryId] = 0;
        }
        expensesByCategory[e.categoryId] += parseFloat(e.amount);
    });

    const pieData = Object.keys(expensesByCategory).map(catId => {
        const category = categories.find(c => c.id === catId);
        return {
            name: category ? category.name : 'Unknown',
            amount: expensesByCategory[catId],
            color: category ? category.color : colors.text.hint,
            legendFontColor: colors.text.primary,
            legendFontSize: 12,
        };
    }).sort((a, b) => b.amount - a.amount);

    // Prepare Line Chart Data (Daily for week/month, Monthly for year)
    const lineChartLabels = [];
    const lineChartData = [];

    if (period === 'week' || period === 'month') {
        // Group by day
        const days = {};
        filteredExpenses.forEach(e => {
            const dateStr = new Date(e.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            if (!days[dateStr]) days[dateStr] = 0;
            days[dateStr] += parseFloat(e.amount);
        });

        // Take last 6 entries for readability
        const sortedDays = Object.keys(days).sort((a, b) => new Date(a) - new Date(b)).slice(-6);
        sortedDays.forEach(day => {
            lineChartLabels.push(day);
            lineChartData.push(days[day]);
        });
    } else {
        // Group by month
        const months = {};
        filteredExpenses.forEach(e => {
            const dateStr = new Date(e.date).toLocaleDateString('id-ID', { month: 'short' });
            if (!months[dateStr]) months[dateStr] = 0;
            months[dateStr] += parseFloat(e.amount);
        });

        const sortedMonths = Object.keys(months).slice(-6); // Last 6 months
        sortedMonths.forEach(month => {
            lineChartLabels.push(month);
            lineChartData.push(months[month]);
        });
    }

    // Ensure we have at least some data for the chart to render
    if (lineChartData.length === 0) {
        lineChartLabels.push('No Data');
        lineChartData.push(0);
    }

    return (
        <View style={commonStyles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadData} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Laporan & Analisis</Text>
                    <View style={styles.periodSelector}>
                        {['week', 'month', 'year'].map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.periodButton, period === p && styles.periodButtonActive]}
                                onPress={() => setPeriod(p)}
                            >
                                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                                    {p === 'week' ? 'Minggu' : p === 'month' ? 'Bulan' : 'Tahun'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <StatCard
                        title="Total"
                        value={formatCurrency(totalAmount)}
                        color={colors.primary}
                    />
                    <StatCard
                        title="Rata-rata"
                        value={formatCurrency(avgAmount)}
                        color={colors.secondary}
                    />
                </View>

                <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>Pengeluaran per Kategori</Text>
                    {pieData.length > 0 ? (
                        <CategoryPieChart data={pieData} />
                    ) : (
                        <Text style={styles.noDataText}>Belum ada data untuk periode ini</Text>
                    )}
                </View>

                <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>Tren Pengeluaran</Text>
                    <ExpenseLineChart data={lineChartData} labels={lineChartLabels} />
                </View>

                <View style={styles.breakdownSection}>
                    <Text style={styles.chartTitle}>Rincian Kategori</Text>
                    {pieData.map((item, index) => (
                        <View key={index} style={styles.breakdownItem}>
                            <View style={styles.breakdownLeft}>
                                <View style={[styles.dot, { backgroundColor: item.color }]} />
                                <Text style={styles.breakdownName}>{item.name}</Text>
                            </View>
                            <View style={styles.breakdownRight}>
                                <Text style={styles.breakdownAmount}>{formatCurrency(item.amount)}</Text>
                                <Text style={styles.breakdownPercent}>
                                    {((item.amount / totalAmount) * 100).toFixed(1)}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: spacing.md,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 4,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    periodButtonActive: {
        backgroundColor: colors.primary,
    },
    periodText: {
        color: colors.text.secondary,
        fontWeight: '600',
    },
    periodTextActive: {
        color: colors.text.white,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.sm,
    },
    chartSection: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        marginBottom: spacing.sm,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
        alignSelf: 'flex-start',
    },
    noDataText: {
        color: colors.text.hint,
        fontStyle: 'italic',
        marginVertical: spacing.lg,
    },
    breakdownSection: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    breakdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.sm,
    },
    breakdownName: {
        fontSize: 16,
        color: colors.text.primary,
    },
    breakdownRight: {
        alignItems: 'flex-end',
    },
    breakdownAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
    breakdownPercent: {
        fontSize: 12,
        color: colors.text.secondary,
    },
});

export default ReportsScreen;
