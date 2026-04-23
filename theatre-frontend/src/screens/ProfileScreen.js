import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../../api';

export default function ProfileScreen() {
    const [reservations, setReservations] = useState([]);
    const navigation = useNavigation();

    const fetchReservations = async () => {
        try {
            const res = await API.get('/reservations/user');
            setReservations(res.data);
        } catch {
            Alert.alert('Σφάλμα', 'Αδυναμία φόρτωσης κρατήσεων');
        }
    };

    const cancelReservation = async (id) => {
        Alert.alert('Ακύρωση', 'Θέλεις να ακυρώσεις αυτή την κράτηση;', [
            { text: 'Όχι' },
            { text: 'Ναι', onPress: async () => {
                try {
                    await API.delete(`/reservations/${id}`);
                    Alert.alert('Επιτυχία', 'Η κράτηση ακυρώθηκε');
                    fetchReservations();
                } catch {
                    Alert.alert('Σφάλμα', 'Αποτυχία ακύρωσης');
                }
            }}
        ]);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigation.replace('Login');
    };

    useEffect(() => { fetchReservations(); }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>👤 Οι Κρατήσεις μου</Text>
            <FlatList
                data={reservations}
                keyExtractor={item => item.reservation_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.showTitle}>{item.show_title}</Text>
                        <Text style={styles.theatre}>🎭 {item.theatre_name}</Text>
                        <Text style={styles.info}>📅 {new Date(item.show_date).toLocaleDateString('el-GR')} | 🕐 {item.show_time}</Text>
                        <Text style={styles.info}>🎟️ {item.tickets} εισιτήρια | 💶 €{item.total_price}</Text>
                        <TouchableOpacity style={styles.cancelBtn}
                            onPress={() => cancelReservation(item.reservation_id)}>
                            <Text style={styles.cancelText}>Ακύρωση Κράτησης</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Δεν υπάρχουν κρατήσεις</Text>}
            />
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Text style={styles.logoutText}>Αποσύνδεση</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e', padding: 10 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginVertical: 15 },
    card: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#e94560' },
    showTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
    theatre: { color: '#e94560', fontSize: 13, marginBottom: 5 },
    info: { color: '#a0a0b0', fontSize: 13, marginBottom: 3 },
    cancelBtn: { backgroundColor: '#e94560', padding: 8, borderRadius: 8, marginTop: 10, alignItems: 'center' },
    cancelText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    empty: { textAlign: 'center', color: '#a0a0b0', marginTop: 50 },
    logout: { backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center', margin: 10 },
    logoutText: { color: '#fff', fontWeight: 'bold' }
});