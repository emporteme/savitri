import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {Link} from "expo-router";

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Savitri</Text>
            <Image source={require("../../assets/images/splash.png")} style={styles.logo} />
            <Text style={styles.subtitle}>Build the future of blockchain and discover new world with Savitri</Text>
            <View style={styles.spacer} />
            <View style={styles.buttonContainer}>
                <Link href={"authenticate"} style={styles.loginButton}>
                    <Text style={styles.loginText}>Log In</Text>
                </Link>
                <Link href={"registration"}style={styles.registerButton}>
                    <Text style={styles.registerText}>Register</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9E3FFE',
        marginTop: "40%",
    },
    logo: {
        width: 450,
        height: 300,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#2A2831',
        lineHeight: 22,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 40,
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        width: "100%",
        paddingBottom: 32,
    },
    loginButton: {
        backgroundColor: '#9E3FFE',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 20,
        width: "95%",
        textAlign:"center",
        alignSelf: "center",
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
    },
    registerButton: {
        borderColor: '#C864FA',
        backgroundColor: "#F1E4FF",
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: "95%",
        textAlign:"center",
        alignSelf: "center",
    },
    registerText: {
        color: '#9E3FFE',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
});
