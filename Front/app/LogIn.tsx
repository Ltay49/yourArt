import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { UserContext } from '../utils/UserConext'

export default function LogIn() {
    const { user, setUser } = useContext(UserContext);

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loggedIn = !!user;

    // Login handler
    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`https://yourart-production.up.railway.app/api/userProfile/${username}`);
            if (!res.ok) {
                throw new Error(`Status: ${res.status}`);
            }
            const data = await res.json();
            setUser(data);
        } catch (err: any) {
            setError('Failed to fetch profile. Make sure the username is correct.');
        } finally {
            setLoading(false);
        }
    };

    // Signup handler
    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('https://yourart-production.up.railway.app/api/userProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, surname, username, email }),
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Status: ${res.status}`);
            }
            const data = await res.json();
            setUser(data);
            setMode('login'); // optional
        } catch (err: any) {
            setError(`Sign up failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setUsername('');
        setFirstname('');
        setSurname('');
        setEmail('');
        setError(null);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{loggedIn ? 'Welcome' : mode === 'login' ? 'Log In' : 'Sign Up'}</Text>

            {!loggedIn && mode === 'signup' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        value={firstname}
                        onChangeText={setFirstname}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Surname"
                        value={surname}
                        onChangeText={setSurname}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </>
            )}

            {!loggedIn && (
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={loggedIn ? handleLogout : mode === 'login' ? handleLogin : handleSignUp}
                disabled={
                    loading ||
                    (!loggedIn &&
                        ((mode === 'login' && username.trim() === '') ||
                            (mode === 'signup' &&
                                (firstname.trim() === '' ||
                                    surname.trim() === '' ||
                                    username.trim() === '' ||
                                    email.trim() === ''))))
                }
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : loggedIn ? 'Log Out' : mode === 'login' ? 'Log In' : 'Sign Up'}
                </Text>
            </TouchableOpacity>

            {!loggedIn && (
                <TouchableOpacity
                    onPress={() => {
                        setError(null);
                        setMode(mode === 'login' ? 'signup' : 'login');
                    }}
                >
                    <Text style={styles.toggleText}>
                        {mode === 'login' ? "Don't have an account? Sign Up" : 'Have an account? Log In'}
                    </Text>
                </TouchableOpacity>
            )}

            {loading && <ActivityIndicator size="small" color="#000" />}

            {error && <Text style={styles.error}>{error}</Text>}

            {loggedIn && user && (
                <View style={styles.profile}>
                    <Text style={styles.success}>Welcome, {user.firstname || user.username}!</Text>
                    <Text>User ID: {user._id}</Text>
                </View>
            )}
        </ScrollView>
    );
}

// keep your styles as before...

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
    },
    button: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
    },
    toggleText: {
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    success: {
        fontWeight: 'bold',
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    profile: {
        marginTop: 10,
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 6,
    },
});
