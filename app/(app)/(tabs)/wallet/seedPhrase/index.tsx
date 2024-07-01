import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { generateMnemonic } from 'bip39';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install the vector icons library
import Clipboard from '@react-native-clipboard/clipboard';
import {Link, useRouter} from "expo-router";
import { Buffer } from 'buffer';
import WalletBack from "@/components/walletBack";

global.Buffer = Buffer; // Add this line to polyfill Buffer

export default function SeedPhrase() {
    let seed = generateMnemonic(128);
    let generatedSeed = seed.split(' ');
    const navigate = useRouter();

    const copyToClipboard = () => {
        Clipboard.setString(seed);
        navigate.push('/wallet/createWallet');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <WalletBack/>
            </View>
            <Text style={styles.title}>Seed phrase</Text>
            <Text style={styles.description}>
                Seed phrase is the master-key you can use to access your wallet. Write it down somewhere safe and never share it with anyone. Ikarus will not be able to recover your seed phrase.
            </Text>
            <View style={styles.seedContainer}>
                {generatedSeed.map((word, index) => (
                    <View key={index} style={styles.wordContainer}>
                        <Text style={styles.word}>{word}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                <Text style={styles.buttonText}>Copy and Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555555',
        marginBottom: 24,
    },
    seedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    wordContainer: {
        backgroundColor: '#f3e8ff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
        width: '48%',
        alignItems: 'center',
    },
    word: {
        fontSize: 16,
        color: '#000000',
    },
    button: {
        backgroundColor: '#a259ff',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
