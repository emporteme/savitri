import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Services } from '@/services/Services';

export default function Authenticate() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const services = new Services();

    const handleLogin = async () => {
        try {
            const response = await services.PostResource('api/v1/auth/authenticate', JSON.stringify({
                email,
                password,
            }));

            const { jwt_token, rt_token } = response.data;

            await SecureStore.setItemAsync('jwt_token', jwt_token);
            await SecureStore.setItemAsync('rt_token', rt_token);
            Alert.alert("Login Successful", "You have logged in successfully!");
        } catch (error) {
            Alert.alert("Login Error", "Invalid email or password.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

