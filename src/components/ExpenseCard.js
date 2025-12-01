import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/common';
import { formatCurrency, formatDate } from '../utils/formatters';

const ExpenseCard = ({ expense, category, onPress, onEdit, onDelete, canEdit }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.categoryDot, { backgroundColor: category?.color || colors.text.hint }]} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{expense.title}</Text>
                        <Text style={styles.category}>{category?.name || 'Unknown'}</Text>
                    </View>
                </View>
                <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.date}>{formatDate(expense.date, 'long')}</Text>
                {canEdit && (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                            <Text style={styles.deleteText}>Hapus</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {expense.notes && (
                <Text style={styles.notes} numberOfLines={2}>{expense.notes}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.md,
        marginVertical: spacing.sm,
        marginHorizontal: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.sm,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
    category: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 2,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: colors.text.hint,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: spacing.sm,
    },
    editText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    deleteText: {
        color: colors.error,
        fontSize: 14,
        fontWeight: '500',
    },
    notes: {
        fontSize: 14,
        color: colors.text.secondary,
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
});

export default ExpenseCard;
