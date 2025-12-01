import { format } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }

    // Format number with Indonesian locale settings
    const formatted = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);

    return `Rp ${formatted}`;
};

/**
 * Format date in Indonesian format
 * @param {Date|string} date - The date to format
 * @param {string} formatStr - The format string ('short' or 'long')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'short') => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (formatStr === 'short') {
        return format(dateObj, 'dd/MM/yyyy', { locale: id });
    } else if (formatStr === 'long') {
        return format(dateObj, 'dd MMMM yyyy', { locale: id });
    } else {
        return format(dateObj, formatStr, { locale: id });
    }
};

/**
 * Parse currency string to number
 * @param {string} currencyStr - Currency string (e.g., "Rp 1.000.000")
 * @returns {number} The numeric value
 */
export const parseCurrency = (currencyStr) => {
    if (typeof currencyStr === 'number') return currencyStr;

    // Remove "Rp", spaces, and dots (thousand separator)
    const cleaned = currencyStr.replace(/Rp\s?/g, '').replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(cleaned) || 0;
};
