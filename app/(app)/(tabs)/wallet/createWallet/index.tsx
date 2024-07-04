import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalletBack from "@/components/walletBack";
import * as SecureStore from 'expo-secure-store';
import elliptic, { eddsa as EdDSA } from 'elliptic';
import { useRouter } from 'expo-router';

export default function CreateWallet() {
    const [seedPhrase, setSeedPhrase] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [wallets, setWallets] = useState<{ type: string, publicKey: string, privateKey: string }[]>([]);
    const ec = new EdDSA('ed25519');
    const navigate = useRouter();

    const isFormValid = seedPhrase && password && confirmPassword && password === confirmPassword;

    const loadKeys = async () => {
        const keys = await SecureStore.getItemAsync('wallets');
        if (keys) {
            setWallets(JSON.parse(keys));
        }
    };

    const createIkarusWallet = async () => {
        let secret: any;

        if (window.crypto && window.crypto.getRandomValues) {
            secret = new Uint8Array(32);
            window.crypto.getRandomValues(secret);
        } else {
            console.warn('Warning: Using insecure methods to generate private key');
            secret = [];
            for (let i = 0; i < 32; i++) {
                secret.push(Math.floor(Math.random() * 256));
            }
        }

        const key = ec.keyFromSecret(secret);
        const privateKeyHex = key.getSecret('hex');
        const publicKeyHex = key.getPublic('hex');

        const newWallet = { type: 'Ikarus', publicKey: publicKeyHex, privateKey: privateKeyHex };
        const updatedWallets = [...wallets, newWallet];
        await SecureStore.setItemAsync('wallets', JSON.stringify(updatedWallets));

        setWallets(updatedWallets);
        requestTokens(publicKeyHex);
    };

    const requestTokens = async (publicKey: string) => {
        try {
            const url = `https://masternode-test.ikarusway.com/wallet/${publicKey}`;
            const response = await fetch(url);
            if (response.status === 200) {
                Alert.alert('Success', '100 tokens have been transferred to your wallet.');
                navigate.push('/wallet');
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    const handleCreateWallet = async () => {
        if (isFormValid) {
            await createIkarusWallet();
            console.log('Wallet created');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <WalletBack/>
            </View>
            <Text style={styles.title}>Protect your wallet</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Seed phrase</Text>
                <TextInput
                    style={styles.inputSeed}
                    placeholder="Paste your seed phrase"
                    value={seedPhrase}
                    onChangeText={setSeedPhrase}
                    multiline
                    textAlign={"center"}
                    placeholderTextColor={"#ABABAB"}
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
                        placeholderTextColor={"#ABABAB"}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor={"#ABABAB"}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={handleCreateWallet}
                disabled={!isFormValid}
            >
                <Text style={styles.buttonText}>Create wallet</Text>
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
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f3f3f3',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000000',
        width: "98%",
        marginLeft:0
    },
    inputSeed:{
        backgroundColor: '#f3f3f3',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000000',
        width:"100%"
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#a259ff',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#d1d1d1',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
