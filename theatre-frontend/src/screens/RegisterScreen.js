import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../api';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            await API.post('/register', { name, email, password });
            const res = await API.post('/login', { email, password });
            await AsyncStorage.setItem('token', res.data.token);
            navigation.replace('Theatres');
        } catch (err) {
            Alert.alert('Σφάλμα', 'Η εγγραφή απέτυχε');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎭 Εγγραφή</Text>
            <TextInput style={styles.input} placeholder="Όνομα" placeholderTextColor="#a0a0b0" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#a0a0b0" value={email}
                onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#a0a0b0" value={password}
                onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Εγγραφή</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Έχεις ήδη λογαριασμό; Σύνδεση</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#1a1a2e' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#e94560' },
    input: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e94560', color: '#ffffff' },
    button: { backgroundColor: '#e94560', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link: { textAlign: 'center', marginTop: 15, color: '#e94560' }
});