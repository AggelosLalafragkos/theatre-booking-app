import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../../api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const res = await API.post('/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigation.replace('Theatres');
        } catch (err) {
            Alert.alert('Σφάλμα', 'Λάθος email ή password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎭 Theatre Booking</Text>
            <Text style={styles.subtitle}>Κρατήσεις Θεατρικών Παραστάσεων</Text>
            <TextInput style={styles.input} placeholder="Email" value={email}
                onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password}
                onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Σύνδεση</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Δεν έχεις λογαριασμό; Εγγραφή</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#1a1a2e' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#e94560' },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 30, color: '#a0a0b0' },
    input: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e94560', color: '#ffffff' },
    button: { backgroundColor: '#e94560', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link: { textAlign: 'center', marginTop: 15, color: '#e94560' }
});