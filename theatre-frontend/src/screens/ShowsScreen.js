import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../../api';

export default function ShowsScreen() {
    const [shows, setShows] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const { theatreId, theatreName } = route.params || {};

    const fetchShows = async () => {
        try {
            const res = await API.get(`/shows?theatreId=${theatreId}`);
            setShows(res.data);
        } catch {
            Alert.alert('Σφάλμα', 'Αδυναμία φόρτωσης παραστάσεων');
        }
    };

    useEffect(() => { fetchShows(); }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎬 {theatreName}</Text>
            <Text style={styles.subheader}>Διαθέσιμες Παραστάσεις</Text>
            <FlatList
                data={shows}
                keyExtractor={item => item.show_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}
                        onPress={() => navigation.navigate('Showtimes', { showId: item.show_id, showTitle: item.title })}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.rating}>{item.age_rating}</Text>
                        </View>
                        <Text style={styles.desc}>{item.description}</Text>
                        <Text style={styles.duration}>⏱️ {item.duration} λεπτά</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Δεν υπάρχουν παραστάσεις</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e', padding: 10 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginVertical: 10 },
    subheader: { fontSize: 14, color: '#a0a0b0', textAlign: 'center', marginBottom: 15 },
    card: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#e94560' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', flex: 1 },
    rating: { backgroundColor: '#e94560', color: '#fff', padding: 4, borderRadius: 5, fontSize: 11, fontWeight: 'bold' },
    desc: { color: '#a0a0b0', marginTop: 8, fontSize: 13 },
    duration: { color: '#a0a0b0', marginTop: 5, fontSize: 12 },
    empty: { textAlign: 'center', color: '#a0a0b0', marginTop: 50 }
});