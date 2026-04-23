import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../../api';

export default function TheatresScreen() {
    const [theatres, setTheatres] = useState([]);
    const [search, setSearch] = useState('');
    const navigation = useNavigation();

    const fetchTheatres = async () => {
        try {
            const res = await API.get(`/theatres?search=${search}`);
            setTheatres(res.data);
        } catch {
            Alert.alert('Σφάλμα', 'Αδυναμία φόρτωσης θεάτρων');
        }
    };

    useEffect(() => { fetchTheatres(); }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎭 Θέατρα</Text>
            <TextInput style={styles.search} placeholder="🔍 Αναζήτηση..." placeholderTextColor="#a0a0b0"
                value={search} onChangeText={setSearch} onSubmitEditing={fetchTheatres} />
            <FlatList
                data={theatres}
                keyExtractor={item => item.theatre_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}
                        onPress={() => navigation.navigate('Shows', { theatreId: item.theatre_id, theatreName: item.name })}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.location}>📍 {item.location}</Text>
                        <Text style={styles.desc}>{item.description}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.profileText}>👤 Προφίλ & Κρατήσεις</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e', padding: 10 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginVertical: 15 },
    search: { backgroundColor: '#16213e', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e94560', color: '#ffffff' },
    card: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#e94560' },
    name: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
    location: { color: '#a0a0b0', marginTop: 5 },
    desc: { color: '#a0a0b0', marginTop: 5, fontSize: 12 },
    profileBtn: { backgroundColor: '#e94560', padding: 15, borderRadius: 10, alignItems: 'center', margin: 10 },
    profileText: { color: '#fff', fontWeight: 'bold' }
});