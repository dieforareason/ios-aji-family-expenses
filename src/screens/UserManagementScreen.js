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
    ScrollView,
} from 'react-native';
import { getUsers, createUser, deleteUser } from '../services/auth';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const UserManagementScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!name || !username || !password) {
            Alert.alert('Error', 'Mohon lengkapi semua field');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password minimal 6 karakter');
            return;
        }

        try {
            await createUser({ name, username, password, role });
            setModalVisible(false);
            resetForm();
            loadUsers();
            Alert.alert('Sukses', 'User berhasil ditambahkan');
        } catch (error) {
            Alert.alert('Error', 'Gagal menambahkan user');
        }
    };

    const handleDeleteUser = (userId) => {
        Alert.alert(
            'Hapus User',
            'Apakah Anda yakin ingin menghapus user ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteUser(userId);
                            loadUsers();
                        } catch (error) {
                            Alert.alert('Error', 'Gagal menghapus user');
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setName('');
        setUsername('');
        setPassword('');
        setRole('user');
    };

    const renderUser = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role.toUpperCase()}</Text>
                <Text style={styles.userUsername}>@{item.username}</Text>
            </View>
            {item.username !== 'admin' && (
                <TouchableOpacity
                    onPress={() => handleDeleteUser(item.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteText}>Hapus</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={commonStyles.container}>
            <FlatList
                data={users}
                renderItem={renderUser}
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
                        <Text style={styles.modalTitle}>Tambah User Baru</Text>

                        <Text style={commonStyles.label}>Nama Lengkap</Text>
                        <TextInput
                            style={commonStyles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nama Lengkap"
                        />

                        <Text style={commonStyles.label}>Username</Text>
                        <TextInput
                            style={commonStyles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Username"
                            autoCapitalize="none"
                        />

                        <Text style={commonStyles.label}>Password</Text>
                        <TextInput
                            style={commonStyles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry
                        />

                        <Text style={commonStyles.label}>Role</Text>
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'user' && styles.roleButtonActive]}
                                onPress={() => setRole('user')}
                            >
                                <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>User</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
                                onPress={() => setRole('admin')}
                            >
                                <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>Admin</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[commonStyles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[commonStyles.button, styles.saveButton]}
                                onPress={handleAddUser}
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
    userCard: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    userRole: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
        marginTop: 2,
    },
    userUsername: {
        fontSize: 14,
        color: colors.text.secondary,
        marginTop: 2,
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
    roleContainer: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    roleButton: {
        flex: 1,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        marginHorizontal: 4,
        borderRadius: 4,
    },
    roleButtonActive: {
        backgroundColor: colors.primary,
    },
    roleText: {
        color: colors.primary,
        fontWeight: '600',
    },
    roleTextActive: {
        color: colors.text.white,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default UserManagementScreen;
