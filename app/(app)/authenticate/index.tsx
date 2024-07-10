import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Services } from '@/services/services';
import { Ionicons } from '@expo/vector-icons';

export default function Authenticate() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.title}>Log In</Text>
            <Image source={require("../../../assets/images/splash.png")} style={styles.logo} />
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email address</Text>
                <TextInput
                    style={styles.mailInput}
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor={"#BEBDBD"}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor={"#BEBDBD"}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.spacer} />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9E3FFE',
        marginTop: "20%",
        marginBottom: 10,
    },
    logo: {
        width: 300,
        height: 270,
        marginBottom: 120,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "500",
        color: '#2A2831',
        marginBottom: 4,
    },
    input: {
        height: 50,
        paddingHorizontal: 16,
        width: '100%',
    },
    mailInput:{
        height: 50,
        paddingHorizontal: 16,
        width: '100%',
        borderColor:"#E8E6E6",
        borderWidth: 1,
        borderRadius: 8,
    },
    passwordContainer: {
        borderColor:"#E8E6E6",
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    spacer: {
        flex: 1,
    },
    loginButton: {
        backgroundColor: '#9E3FFE',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 20,
        width: "95%",
        alignItems: "center",
        alignSelf: "center",
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
