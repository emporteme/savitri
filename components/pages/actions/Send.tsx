import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import elliptic, { eddsa as EdDSA } from 'elliptic';
import { hexToUint8Array } from '@/components/utils';
import * as SecureStore from 'expo-secure-store';

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

                // Request location permissions and set location
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
            signDevkey(devPubKey, privateKey); // Fix: Pass both devPubKey and privateKey as arguments
            setIsDevKeyRegistered(true);
        } else if (privateKey && devPubKey) {
            const intervalId = setInterval(signLocation, 10 * 1000);

            // Clear interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [privateKey, isDevKeyRegistered, devPubKey]);

    const signDevkey = async (devpubkey: string, privateKey: string) => {
        const API_URL = 'http://pool.prometeochain.io/node/get_from_ledger';

        try {
            // Get current location
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
        const API_URL = 'http://pool.prometeochain.io/node/get_from_ledger';

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
        } else {
            return obj;
        }
    };

    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            {location && (
                <Text>
                    Location: {location.coords.latitude}, {location.coords.longitude}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
