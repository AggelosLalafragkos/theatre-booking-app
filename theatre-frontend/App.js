import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TheatresScreen from './src/screens/TheatresScreen';
import ShowsScreen from './src/screens/ShowsScreen';
import ShowtimesScreen from './src/screens/ShowtimesScreen';
import BookingScreen from './src/screens/BookingScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login"
                screenOptions={{ headerStyle: { backgroundColor: '#16213e' }, headerTintColor: '#e94560', headerTitleStyle: { fontWeight: 'bold' } }}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: '🎭 Theatre Booking' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Εγγραφή' }} />
                <Stack.Screen name="Theatres" component={TheatresScreen} options={{ title: 'Θέατρα' }} />
                <Stack.Screen name="Shows" component={ShowsScreen} options={{ title: 'Παραστάσεις' }} />
                <Stack.Screen name="Showtimes" component={ShowtimesScreen} options={{ title: 'Ωράρια' }} />
                <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Κράτηση' }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Προφίλ' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}