import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCategories, addExpense, updateExpense } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';
import { formatDate } from '../utils/formatters';

const AddEditExpenseScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const expenseToEdit = route.params?.expense;
    const isEditing = !!expenseToEdit;

    const [title, setTitle] = useState(expenseToEdit?.title || '');
    const [amount, setAmount] = useState(expenseToEdit?.amount?.toString() || '');
    const [categoryId, setCategoryId] = useState(expenseToEdit?.categoryId || null);
    const [date, setDate] = useState(expenseToEdit ? new Date(expenseToEdit.date) : new Date());
    const [notes, setNotes] = useState(expenseToEdit?.notes || '');
    const [categories, setCategories] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    const handleSave = async () => {
        if (!title || !amount || !categoryId) {
            Alert.alert('Error', 'Mohon lengkapi Judul, Jumlah, dan Kategori');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Jumlah harus berupa angka positif');
            return;
        }

        if (date > new Date()) {
            Alert.alert('Error', 'Tanggal tidak boleh di masa depan');
            return;
        }

        setLoading(true);
        try {
            const expenseData = {
                title,
                amount: numAmount,
                categoryId,
                date: date.toISOString(),
                notes,
                userId: isEditing ? expenseToEdit.userId : user.userId,
            };

            if (isEditing) {
                await updateExpense(expenseToEdit.id, expenseData);
            } else {
                await addExpense(expenseData);
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan pengeluaran');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const categoryItems = categories.map(c => ({
        label: c.name,
        value: c.id,
        color: c.color || colors.text.primary
    }));

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={commonStyles.container}
        >
            <ScrollView style={styles.content}>
                <Text style={styles.headerTitle}>
                    {isEditing ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                </Text>

                <Text style={commonStyles.label}>Judul</Text>
                <TextInput
                    style={commonStyles.input}
                    placeholder="Contoh: Belanja Bulanan"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={commonStyles.label}>Jumlah (Rp)</Text>
                <TextInput
                    style={commonStyles.input}
                    placeholder="0"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />

                <Text style={commonStyles.label}>Kategori</Text>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={setCategoryId}
                        items={categoryItems}
                        value={categoryId}
                        placeholder={{ label: 'Pilih Kategori...', value: null }}
                        style={pickerSelectStyles}
                    />
                </View>

                <Text style={commonStyles.label}>Tanggal</Text>
                <TouchableOpacity
                    style={commonStyles.input}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{formatDate(date, 'long')}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}

                <Text style={commonStyles.label}>Catatan (Opsional)</Text>
                <TextInput
                    style={[commonStyles.input, styles.textArea]}
                    placeholder="Catatan tambahan..."
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity
                    style={[commonStyles.button, loading && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={commonStyles.buttonText}>
                        {isEditing ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.lg,
    },
    pickerContainer: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.sm, // Add padding for picker
        justifyContent: 'center',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: colors.text.primary,
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: colors.text.primary,
        paddingRight: 30,
    },
});

export default AddEditExpenseScreen;
