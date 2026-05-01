import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import API from '../../api';

export default function ShowtimesScreen() {
    const [showtimes, setShowtimes] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const { showId, showTitle } = route.params || {};

    const fetchShowtimes = async () => {
        try {
            const res = await API.get(`/showtimes?showId=${showId}`);
            setShowtimes(res.data);
        } catch {
            Alert.alert('Σφάλμα', 'Αδυναμία φόρτωσης ωραρίων');
        }
    };

    useFocusEffect(useCallback(() => { fetchShowtimes(); }, [showId]));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎟️ {showTitle}</Text>
            <Text style={styles.subheader}>Διαθέσιμες Ημερομηνίες & Ώρες</Text>
            <FlatList
                data={showtimes}
                keyExtractor={item => item.showtime_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}
                        onPress={() => navigation.navigate('Booking', {
                            showtimeId: item.showtime_id,
                            showTitle,
                            showDate: item.show_date,
                            showTime: item.show_time,
                            price: item.price,
                            availableSeats: item.available_seats
                        })}>
                        <View style={styles.row}>
                            <Text style={styles.date}>📅 {new Date(item.show_date).toLocaleDateString('el-GR')}</Text>
                            <Text style={styles.time}>🕐 {item.show_time}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.seats}>💺 {item.available_seats} διαθέσιμες θέσεις</Text>
                            <Text style={styles.price}>€{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Δεν υπάρχουν διαθέσιμες παραστάσεις</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e', padding: 10 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginVertical: 10 },
    subheader: { fontSize: 14, color: '#a0a0b0', textAlign: 'center', marginBottom: 15 },
    card: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#e94560' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    date: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
    time: { color: '#ffffff', fontSize: 14 },
    seats: { color: '#a0a0b0', fontSize: 13 },
    price: { color: '#e94560', fontSize: 16, fontWeight: 'bold' },
    empty: { textAlign: 'center', color: '#a0a0b0', marginTop: 50 }
});