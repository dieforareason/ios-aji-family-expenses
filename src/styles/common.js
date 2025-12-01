import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

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

    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: spacing.md,
        fontSize: 16,
        marginVertical: spacing.sm,
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: spacing.md,
        alignItems: 'center',
        marginVertical: spacing.sm,
    },

    buttonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: '600',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },

    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },

    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: spacing.xs,
    },
});

export const isTablet = width >= 768;
