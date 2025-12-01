import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/common';

const StatCard = ({ title, value, subtitle, color = colors.primary }) => {
    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.md,
        marginVertical: spacing.sm,
        marginHorizontal: spacing.md,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 12,
        color: colors.text.hint,
    },
});

export default StatCard;
