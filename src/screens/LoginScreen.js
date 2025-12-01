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
import { login } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/colors';
import { commonStyles, spacing } from '../styles/common';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Harap isi username dan password');
            return;
        }

        setLoading(true);
        try {
            const user = await login(username, password);

            if (user) {
                signIn(user);
            } else {
                Alert.alert('Error', 'Username atau password salah');
            }
        } catch (error) {
            Alert.alert('Error', 'Terjadi kesalahan saat login');
            console.error('Login error:', error);
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
                    <Text style={styles.title}>Aji Family Expenses</Text>
                    <Text style={styles.subtitle}>Kelola Pengeluaran Keluarga</Text>

                    <TextInput
                        style={commonStyles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        style={commonStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[commonStyles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text.white} />
                        ) : (
                            <Text style={commonStyles.buttonText}>Masuk</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.hint}>
                        Default: admin / admin123
                    </Text>
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
    hint: {
        fontSize: 12,
        color: colors.text.hint,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});

export default LoginScreen;
