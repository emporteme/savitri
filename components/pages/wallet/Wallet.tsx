import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, Button, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import elliptic, { eddsa as EdDSA } from 'elliptic';

const Wallet: React.FC = () => {
    const [wallets, setWallets] = useState<{ publicKey: string, privateKey: string }[]>([]);
    const ec = new EdDSA('ed25519');

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        const keys = await SecureStore.getItemAsync('wallets');
        if (keys) {
            setWallets(JSON.parse(keys));
        } else {
            createWallet();
        }
    };

    const createWallet = async () => {
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

        const newWallet = { publicKey: publicKeyHex, privateKey: privateKeyHex };
        const updatedWallets = [...wallets, newWallet];
        await SecureStore.setItemAsync('wallets', JSON.stringify(updatedWallets));

        setWallets(updatedWallets);
        requestTokens(publicKeyHex);
    };

    const requestTokens = async (publicKey: any) => {
        try {
            const url = `https://masternode-test.ikarusway.com/wallet/${publicKey}`;
            const response = await fetch(url);
            if (response.status === 200) {
                Alert.alert('Success', '100 tokens have been transferred to your wallet.');
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    const handleCopyAddress = (publicKey: string) => {
        Alert.alert('Public Key', publicKey);
    };

    const renderWalletItem = ({ item }: { item: { publicKey: string, privateKey: string } }) => (
        <View style={{ display: 'flex', flexDirection: 'column', padding: 16, borderWidth: 1, borderColor: 'gray', borderRadius: 8, marginBottom: 16 }}>
            <View style={{ paddingBottom: 16, borderBottomWidth: 1, borderColor: 'gray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 16 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'violet' }}></View>
                    <Text style={{ fontWeight: '500', fontSize: 18 }}>Account</Text>
                </View>
                <View>
                    <Ionicons name="chevron-down-outline" size={24} color="black" />
                </View>
            </View>
            <View style={{ paddingTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 16 }}>
                    <Text style={{ fontWeight: '600' }}>Address:</Text>
                    <Pressable
                        style={{ borderRadius: 20, backgroundColor: '#6B96FE20', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}
                        onPress={() => handleCopyAddress(item.publicKey)}
                    >
                        <Text style={{ color: '#6B96FE' }}>{item.publicKey.slice(0, 6)}...{item.publicKey.slice(-4)}</Text>
                        <Ionicons name="copy" size={16} color="#6B96FE" />
                    </Pressable>
                </View>
                <View>
                    <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ padding: 16, height: '50%' }}>
            <Button title="Create Wallet" onPress={createWallet} />
            <FlatList
                data={wallets}
                renderItem={renderWalletItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default Wallet;
