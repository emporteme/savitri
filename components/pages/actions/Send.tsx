import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Modal} from 'react-native';
import * as Location from 'expo-location';
import elliptic, { eddsa as EdDSA } from 'elliptic';
import * as SecureStore from 'expo-secure-store';
import WalletList from "@/components/pages/wallet/WalletList";
import Ionicons from "@expo/vector-icons/Ionicons";

const ec = new EdDSA('ed25519');

function toHex(arr: Uint8Array) {
    return elliptic.utils.toHex(arr).toLowerCase();
}

function fromHex(hex: string) {
    return elliptic.utils.toArray(hex.toLowerCase(), 'hex');
}

function getRandomString(n: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default function AppSend() {
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [devPubKey, setDevPubKey] = useState<string | null>(null);
    const [isDevKeyRegistered, setIsDevKeyRegistered] = useState(false);
    const [location, setLocation] = useState<any>(null);
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [amountToSend, setAmountToSend] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const storedPrivateKey = await SecureStore.getItemAsync('privateKey');
                let loadedPrivateKey;

                if (!storedPrivateKey) {
                    const randomSecret = elliptic.utils.randomBytes(32);
                    const keyPair = ec.keyFromSecret(randomSecret);
                    loadedPrivateKey = toHex(keyPair.getSecret());
                    const publicKeyHex = toHex(keyPair.getPublic());
                    await SecureStore.setItemAsync('privateKey', loadedPrivateKey);
                    setPublicKey(publicKeyHex);
                } else {
                    loadedPrivateKey = storedPrivateKey;
                    const keyFromPrivate = ec.keyFromSecret(fromHex(loadedPrivateKey));
                    setPublicKey(toHex(keyFromPrivate.getPublic()));
                }

                setPrivateKey(loadedPrivateKey);
                console.log('Loaded Private Key:', loadedPrivateKey);

                const devKey = getRandomString(64);
                setDevPubKey(devKey);
                await SecureStore.setItemAsync('devPubKey', devKey);

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }
                const currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);
            } catch (error) {
                console.error('Initialization error:', error);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        if (privateKey && devPubKey && !isDevKeyRegistered) {
            signDevkey(devPubKey, privateKey);
            setIsDevKeyRegistered(true);
        } else if (privateKey && devPubKey) {
            const intervalId = setInterval(signLocation, 10 * 1000);
            return () => clearInterval(intervalId);
        }
    }, [privateKey, isDevKeyRegistered, devPubKey]);

    const signDevkey = async (devpubkey: string, privateKey: string) => {
        const API_URL = 'https://pool-test.ikarusway.com/node/get_from_ledger';

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            const DEVREG_SC = {
                data: {
                    name: "Если ты это читаешь... ты гей",
                    devpubkey: devpubkey,
                    pubkey: publicKey,
                    sw: 'true',
                    timestamp: currentLocation.timestamp / 1000,
                },
                tx_type: "BB00"
            };

            console.log('One time data:', DEVREG_SC);

            const { signature, orderedData } = signData(DEVREG_SC.data, privateKey);
            orderedData.signature = signature;

            const data = {
                pubkey: publicKey,
                ...orderedData,
                signature
            };

            const sendToPool = {
                tx: data,
                type: 'BB00'
            };

            const stringify = JSON.stringify(sendToPool);
            console.log('Stringified data:', stringify);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: stringify
            });

            console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Error occurred while registering device key');
            }

            console.log('Device key registered successfully');
        } catch (error) {
            console.error('Error registering device key:', error);
        }
    };

    const signLocation = async () => {
        try {
            if (!privateKey) {
                throw new Error('Private key is not available');
            }

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            const dataToSend = {
                tx: {
                    pubkey: publicKey,
                    company_id: 1,
                    coords: {
                        accuracy: currentLocation.coords.accuracy,
                        altitude: currentLocation.coords.altitude,
                        altitudeAccuracy: currentLocation.coords.altitudeAccuracy,
                        heading: currentLocation.coords.heading,
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                        speed: currentLocation.coords.speed,
                    },
                    devpubkey: devPubKey,
                    mocked: currentLocation.mocked,
                    timestamp: currentLocation.timestamp / 1000,
                },
                type: 'AA05',
            };

            console.log('Data before signing:', dataToSend);

            const { signature, orderedData } = signData(dataToSend.tx, privateKey);
            orderedData.signature = signature;
            dataToSend.tx = orderedData;

            const tx = {
                pubkey: publicKey,
                ...orderedData,
                signature
            };

            const sendToPool = {
                tx,
                type: 'AA05'
            };

            const stringify = JSON.stringify(sendToPool);
            console.log('Stringified data:', stringify);

            await sendToAPI(stringify);
        } catch (error) {
            console.error('Error signing location:', error);
        }
    };

    const sendToAPI = async (dataToSend: string) => {
        const API_URL = 'https://pool-test.ikarusway.com/node/get_from_ledger';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: dataToSend
            });

            console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Error sending data to API');
            }

            console.log('Location sent successfully');
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    };

    function jsonToUnicodeHex(json: object): string {
        const jsonString = JSON.stringify(json);
        let unicodeString = '';

        for (let i = 0; i < jsonString.length; i++) {
            const charCode = jsonString.charCodeAt(i);
            if (charCode > 127) {
                unicodeString += '\\u' + ('0000' + charCode.toString(16)).slice(-4);
            } else {
                unicodeString += jsonString[i];
            }
        }

        let hexString = '';
        for (let i = 0; i < unicodeString.length; i++) {
            hexString += unicodeString.charCodeAt(i).toString(16);
        }

        return hexString;
    }

    const signData = (data: any, privateKey: string) => {
        try {
            const orderedData = sortObjectKeys(data);
            const dataString = JSON.stringify(orderedData);
            const hexMessage = jsonToUnicodeHex(JSON.parse(dataString));

            const key = ec.keyFromSecret(fromHex(privateKey));
            const signature = toHex(key.sign(hexMessage).toBytes());

            return { signature, orderedData };
        } catch (error) {
            console.error('Error signing data:', error);
            throw error;
        }
    };

    const sortObjectKeys = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        } else if (typeof obj === 'object' && obj !== null) {
            const sortedKeys = Object.keys(obj).sort();
            const result: any = {};
            sortedKeys.forEach((key) => {
                result[key] = sortObjectKeys(obj[key]);
            });
            return result;
        }
        return obj;
    };

    const sendTokens = async (recipientAddress: string, amount: number) => {
        try {
            if (!privateKey || !publicKey) {
                throw new Error('Private or public key is not available');
            }

            const API_URL = 'https://pool-test.ikarusway.com/node/get_from_ledger';
            const tokenTransferTx = {
                tx: {
                    pubkey: publicKey,
                    company_id: 1,
                    reciever: recipientAddress,
                    amount: amount,
                    timestamp: Date.now() / 1000,
                },
                type: 'AA03',
            };

            const { signature, orderedData } = signData(tokenTransferTx.tx, privateKey);
            orderedData.signature = signature;
            tokenTransferTx.tx = orderedData;

            const tx = {
                pubkey: publicKey,
                ...orderedData,
                signature
            };

            const sendToPool = {
                tx,
                type: 'AA03'
            };

            const stringify = JSON.stringify(sendToPool);
            console.log('Stringified data:', stringify);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: stringify
            });

            console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Error sending tokens');
            }

            Alert.alert('Success', 'Tokens sent successfully');
        } catch (error) {
            console.error('Error sending tokens:', error);
        }
    };

    const sendTokensTest = async () => {
        try {
            const API_URL = 'https://pool-test.ikarusway.com/node/get_from_ledger';
            const tokenTransferTx = {
                tx: {
                    pubkey: "9fe78c523a22f83ae85d88174f93d763f302007a037293974c1f9a31806f0bb0",
                    amount: 33,
                    reciever: "34234234324234",
                    timestamp: 1718783564.917,
                    signature: "85f731fd003e9e75b3c1efed5dea3753ab39d8c9833001a0a4d50c2ae27aee14ed1a4705a820b9e773eff88d21db40e4fe7e1ce9955505c01892681dd05fdf0e"
                },
                type: "AA03"
            };

            const stringify = JSON.stringify(tokenTransferTx);
            console.log('Response Testing FIRST:', stringify);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: stringify
            });

            console.log('Response Testing:', response);

            if (!response.ok) {
                throw new Error('Error sending tokens TESTING');
            }

            console.log('Tokens sent successfully');
        } catch (error) {
            console.error('Error sending tokens:', error);
        }
    };

    const handleSendTokens = () => {
        const amount = parseFloat(amountToSend);
        if (recipientAddress && !isNaN(amount) && amount > 0) {
            sendTokens(recipientAddress, amount);
        } else {
            console.error('Invalid recipient address or amount');
        }
    };

    const handleSend = () => {
        // Здесь можно добавить логику для отправки
        // После успешной отправки откроем модальное окно
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <WalletList />
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Recipient's address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter address"
                    value={recipientAddress}
                    onChangeText={setRecipientAddress}
                />

                <Text style={styles.label}>Amount to send</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    value={amountToSend}
                    onChangeText={setAmountToSend}
                    keyboardType="numeric"
                />
            </View>
            <TouchableOpacity
                style={[styles.button, (!recipientAddress || !amountToSend) && styles.buttonDisabled]}
                onPress={handleSend}
                disabled={!recipientAddress || !amountToSend}
            >
                <Text style={styles.buttonText}>Send tokens</Text>
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalView}>
                        <View style={styles.modalContainerHead}>
                            <Text style={styles.modalText}>Success</Text>
                            <TouchableOpacity style={styles.modalText} onPress={() => setModalVisible(!modalVisible)}><Ionicons name={"close-outline"} size={24}/></TouchableOpacity>
                        </View>
                        <View>
                            <Ionicons name={"checkmark-circle-outline"} size={40} color="#4AAC30" style={styles.succesIcon}/>
                            <Text style={styles.succesText}>Tokens have been sent successfully</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        fontFamily:"Montserrat"
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
    },
    modalContainerHead:{
      display: 'flex',
      flexDirection: 'row',
      width:"100%",
      paddingHorizontal:16,
      justifyContent:"space-between",
      borderBottomColor:"#E8E6E6",
      borderBottomWidth:1,
      borderStyle:"solid"
    },
    inputContainer:{
        marginTop:40,
        flexGrow:2
    },
    succesIcon: {
        marginTop: 8,
        alignSelf: 'center',
    },
    succesText:{
        marginTop: 12,
        textAlign:'center',
    },
    walletCard: {
        backgroundColor: '#f5e8ff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    walletText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    walletAddress: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
    },
    walletBalance: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    input: {
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    button: {
        marginBottom:18,
        backgroundColor: '#6200ee',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#b3b3b3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(31, 30, 35, 0.3)',
    },
    modalView: {
        width: 335,
        height: 153,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',

    },
    buttonClose: {
        backgroundColor: '#6200ee',
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
});
