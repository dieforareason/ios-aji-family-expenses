import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { createUser } from '../services/auth';
import { initializeApp } from '../services/storage';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const FirstTimeSetupScreen = ({ onComplete }) => {
    const [name, setName] = useState('Administrator');
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [confirmPassword, setConfirmPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);

    const handleSetup = async () => {
        if (!name || !username || !password || !confirmPassword) {
            Alert.alert('Error', 'Harap isi semua field');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Password tidak cocok');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password minimal 6 karakter');
            return;
        }

        setLoading(true);
        try {
            // Initialize app with default categories
            await initializeApp();

            // Create admin user
            await createUser({
                name,
                username,
                password,
                role: 'admin',
            });

            Alert.alert(
                'Berhasil',
                'Setup selesai! Silakan login dengan akun yang baru dibuat.',
                [{ text: 'OK', onPress: onComplete }]
            );
        } catch (error) {
            Alert.alert('Error', 'Terjadi kesalahan saat setup');
            console.error('Setup error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={commonStyles.container}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Setup Awal</Text>
                    <Text style={styles.subtitle}>Buat akun administrator</Text>

                    <Text style={commonStyles.label}>Nama</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="Nama lengkap"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={commonStyles.label}>Username</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={commonStyles.label}>Password</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="Password (min. 6 karakter)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <Text style={commonStyles.label}>Konfirmasi Password</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="Ulangi password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[commonStyles.button, loading && styles.buttonDisabled]}
                        onPress={handleSetup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text.white} />
                        ) : (
                            <Text style={commonStyles.buttonText}>Buat Akun Admin</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

export default FirstTimeSetupScreen;
