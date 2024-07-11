import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Alert,
    FlatList,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import elliptic, { eddsa as EdDSA } from 'elliptic';
import { ethers } from 'ethers';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {Services} from "@/services/services";

const Wallet: React.FC = () => {
    const [wallets, setWallets] = useState<{ type: string, publicKey: string, privateKey: string }[]>([]);
    const [ballance, setBallance] = useState<number>(0);
    const ec = new EdDSA('ed25519');
    const navigate = useRouter();
    const services = new Services();

    useEffect(() => {

        loadKeys();
    }, []);

    const loadKeys = async () => {
        const keys = await SecureStore.getItemAsync('wallets');
        if (keys) {
            setWallets(JSON.parse(keys));
        }
        services.TestGetResource(`data/ledger/e61efc8551c27314497605e4ed36b12e30637c075132509fb566f08ecd09d84c`)
            .then(res=>setBallance(res.balance))
    };

    const createEthereumWallet = async () => {
        try {
            const randomBytes = await Crypto.getRandomBytesAsync(32);
            const privateKey = ethers.hexlify(randomBytes);
            const wallet = new ethers.Wallet(privateKey);

            const newWallet = { type: 'Ethereum', publicKey: wallet.address, privateKey: wallet.privateKey };
            const updatedWallets = [...wallets, newWallet];
            await SecureStore.setItemAsync('wallets', JSON.stringify(updatedWallets));

            setWallets(updatedWallets);
            Alert.alert('Success', 'Ethereum wallet has been created.');
        } catch (error) {
            console.error('Error creating Ethereum wallet:', error);
            Alert.alert('Error', 'Failed to create Ethereum wallet.');
        }
    };

    const handleCopyAddress = async (publicKey: string) => {
        await Clipboard.setStringAsync(publicKey);
        Alert.alert('Public Key', `Copied to clipboard: ${publicKey}`);
    };

    const renderWalletItem = ({ item }: { item: { type: string, publicKey: string, privateKey: string } }) => (
        <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
                <View style={styles.walletIconContainer}>
                    <Image source={require('./img/savitri.png')} style={styles.savitriIcon}/>
                </View>
                <View>
                    <Text style={styles.walletTitle}>Savitri wallet</Text>
                    <View style={styles.walletDetails}>
                        <Text style={styles.walletAddress}>{item.publicKey.slice(0, 6)}...{item.publicKey.slice(-4)}</Text>
                        <Pressable onPress={() => handleCopyAddress(item.publicKey)}>
                            <Ionicons name="copy" size={16} color="#6B96FE" />
                        </Pressable>
                    </View>
                </View>
            </View>

            <Text style={styles.walletBalance}>${ballance}</Text>
        </View>
    );

    return (
        <ScrollView horizontal={true} style={{ padding: 16, height: '50%' }}>
            <FlatList
                data={wallets}
                renderItem={renderWalletItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
            />
            <View style={styles.createWalletContainer}>
                <TouchableOpacity onPress={() => navigate.push("wallet/seedPhrase")}>
                    <View style={styles.createWallet}>
                        <Text style={styles.plusSign}>+</Text>
                        <Text style={styles.createWalletText}>Add wallet</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    createWalletContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FCE8FF',
        width: 335,
        borderRadius: 16,
        marginRight: 16,
    },
    createWallet: {
        width: '100%',
        height: 138,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    plusSign: {
        borderRadius: 90,
        fontSize: 24,
        color: '#9E3FFE',
        backgroundColor: "#F1E4FF",
        paddingHorizontal: 8,
        paddingBottom: 4,
        marginRight: 8,
    },
    createWalletText: {
        color: '#9E3FFE',
        fontSize: 18,
    },
    walletCard: {
        backgroundColor: '#FCE8FF',
        borderRadius: 16,
        padding: 16,
        marginRight: 16,
        width:335,
        height:138
    },
    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    walletIconContainer: {
        marginRight: 8,

    },
    savitriIcon:{
        width:40,
        height:35.7
    },
    walletTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    walletDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    walletAddress: {
        color: '#6B96FE',
    },
    walletBalance: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9E3FFE',
    },
});

export default Wallet;
