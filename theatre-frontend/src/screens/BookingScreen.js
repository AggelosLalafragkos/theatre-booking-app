import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../../api';

export default function BookingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { showtimeId, showTitle, showDate, showTime, price, availableSeats } = route.params || {};
    const [tickets, setTickets] = useState('1');

    const totalPrice = (parseFloat(price || 0) * parseInt(tickets || 0)).toFixed(2);

    const handleBooking = async () => {
        if (!tickets || parseInt(tickets) < 1) {
            Alert.alert('Σφάλμα', 'Παρακαλώ βάλε έγκυρο αριθμό εισιτηρίων');
            return;
        }
        if (parseInt(tickets) > parseInt(availableSeats)) {
            Alert.alert('Σφάλμα', `Μέγιστος αριθμός διαθέσιμων θέσεων: ${availableSeats}`);
            return;
        }
        try {
            await API.post('/reservations', {
                showtime_id: parseInt(showtimeId),
                tickets: parseInt(tickets)
            });
            navigation.navigate('Profile');
            Alert.alert(
                'Επιτυχία!',
                `Η κράτησή σας για "${showTitle}" καταχωρήθηκε!\nΣύνολο: €${totalPrice}`
            );
        } catch {
            Alert.alert('Σφάλμα', 'Αποτυχία κράτησης');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎟️ Κράτηση Εισιτηρίων</Text>
            <View style={styles.infoCard}>
                <Text style={styles.showTitle}>{showTitle}</Text>
                <Text style={styles.info}>📅 {showDate ? new Date(showDate).toLocaleDateString('el-GR') : ''}</Text>
                <Text style={styles.info}>🕐 {showTime}</Text>
                <Text style={styles.info}>💺 {availableSeats} διαθέσιμες θέσεις</Text>
                <Text style={styles.info}>💶 €{price} / εισιτήριο</Text>
            </View>
            <Text style={styles.label}>Αριθμός Εισιτηρίων:</Text>
            <TextInput style={styles.input} value={tickets}
                onChangeText={setTickets} keyboardType="numeric" />
            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Σύνολο:</Text>
                <Text style={styles.totalPrice}>€{totalPrice}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleBooking}>
                <Text style={styles.buttonText}>Επιβεβαίωση Κράτησης</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginBottom: 20 },
    infoCard: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#e94560' },
    showTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 10 },
    info: { color: '#a0a0b0', marginBottom: 5, fontSize: 14 },
    label: { color: '#ffffff', fontSize: 16, marginBottom: 10 },
    input: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#e94560', color: '#ffffff', fontSize: 18 },
    totalCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 20 },
    totalLabel: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    totalPrice: { color: '#e94560', fontSize: 22, fontWeight: 'bold' },
    button: { backgroundColor: '#e94560', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});