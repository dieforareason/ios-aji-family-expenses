import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    Modal,
} from 'react-native';
import { getCategories, addCategory, deleteCategory } from '../services/storage';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const CategoryManagementScreen = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Error', 'Nama kategori tidak boleh kosong');
            return;
        }

        try {
            // Pick a random color for now
            const randomColor = colors.categories[Math.floor(Math.random() * colors.categories.length)];

            await addCategory({
                name: newCategoryName,
                color: randomColor,
            });

            setModalVisible(false);
            setNewCategoryName('');
            loadCategories();
        } catch (error) {
            Alert.alert('Error', 'Gagal menambahkan kategori');
        }
    };

    const handleDeleteCategory = (categoryId) => {
        Alert.alert(
            'Hapus Kategori',
            'Apakah Anda yakin ingin menghapus kategori ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCategory(categoryId);
                            loadCategories();
                        } catch (error) {
                            Alert.alert('Error', 'Gagal menghapus kategori');
                        }
                    },
                },
            ]
        );
    };

    const renderCategory = ({ item }) => (
        <View style={styles.categoryCard}>
            <View style={styles.categoryInfo}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.name}</Text>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteCategory(item.id)}
                style={styles.deleteButton}
            >
                <Text style={styles.deleteText}>Hapus</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={commonStyles.container}>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tambah Kategori Baru</Text>

                        <Text style={commonStyles.label}>Nama Kategori</Text>
                        <TextInput
                            style={commonStyles.input}
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                            placeholder="Contoh: Liburan"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[commonStyles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[commonStyles.button, styles.saveButton]}
                                onPress={handleAddCategory}
                            >
                                <Text style={commonStyles.buttonText}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: spacing.md,
    },
    categoryCard: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: spacing.sm,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
    deleteButton: {
        padding: spacing.sm,
    },
    deleteText: {
        color: colors.error,
        fontWeight: '600',
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
    },
    fabText: {
        fontSize: 32,
        color: colors.text.white,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.lg,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.background,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    saveButton: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    cancelButtonText: {
        color: colors.text.primary,
        fontWeight: '600',
    },
});

export default CategoryManagementScreen;
