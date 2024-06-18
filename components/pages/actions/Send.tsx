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
    const charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// const myKey = SecureStore.getItemAsync('privateKey');

export default function App() {
    // console.log("MY KEY: ", myKey)

    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [devPubKey, setDevPubKey] = useState<string | null>(null);
    const [isDevKeyRegistered, setIsDevKeyRegistered] = useState(false);
    const [location, setLocation] = useState<any>(null);

    const [loadedPrivateKey, setLoadedPrivateKey] = useState('');

    useEffect(() => {
        const loadPrivateKey = async () => {
            const privateKey = await SecureStore.getItemAsync('privateKey');
            setLoadedPrivateKey(privateKey);
        };

        loadPrivateKey();
    }, []);

    console.log('LOADED PRIVATE KEY: ', loadedPrivateKey);
    useEffect(() => {
        const initializeApp = async () => {
            try {
                const storedPrivateKey = await SecureStore.getItemAsync('privateKey');
                let loadedPrivateKey;

                if (!storedPrivateKey) {
                    const keyPair = ec.genKeyPair();
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
                console.log('LOADED PRIVATE KEY: ', loadedPrivateKey);

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
        // Load private key from secure storage when the component mounts
        loadPrivateKey();
    }, []);

    useEffect(() => {
        // Start sending location data every 10 seconds once privateKey is available
        if (privateKey && !isDevKeyRegistered) {
            signDevkey(devPubKey, privateKey); // Fix: Pass both devPubKey and privateKey as arguments
            setIsDevKeyRegistered(true);
        } else if (privateKey) {
            const intervalId = setInterval(signLocation, 10 * 1000);

            // Clear interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [privateKey, isDevKeyRegistered, devPubKey]);

    const loadPrivateKey = async () => {
        // Load private key from secure storage
        const storedPrivateKey = loadedPrivateKey; // Replace with your method for loading private key
        const storedPublicKey = null; // Replace with your method for loading public key

        // If private and public keys are not stored, generate a new key pair
        if (!storedPrivateKey || !storedPublicKey) {
            generateKeyPair();
        } else {
            setPrivateKey(storedPrivateKey);
            setPublicKey(storedPublicKey);
        }
    };

    const generateKeyPair = () => {
        let secret = new Uint8Array(32);

        secret = hexToUint8Array(loadedPrivateKey)

        let devSecret;
        function getRandomString(n: number): string {
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < n; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        devSecret = getRandomString(64);
        // Example usage:
        console.log(getRandomString(64));
        console.log('DEV PUB KEYYY: ', devSecret);

        const key = ec.keyFromSecret(secret);
        const privateKeyHex = toHex(key.getSecret());
        const publicKeyHex = toHex(key.getPublic());
        const devKeyHex = devSecret;

        // Save keys to secure storage
        // Replace with your method for saving private and public keys
        setPrivateKey(privateKeyHex);
        setPublicKey(publicKeyHex);
        setDevPubKey(devKeyHex);
    };

    const signDevkey = async (devpubkey, privateKey) => {
        const API_URL = 'http://pool.prometeochain.io/node/get_from_ledger';

        // Get current location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const DEVREG_SC = {
            data: {
                name: "Если ты это читаешь... ты гей",
                devpubkey: devpubkey,
                pubkey: publicKey,
                sw: 'true',
                timestamp: location.timestamp / 1000,
            },
            tx_type: "BB00"
        }

        console.log('ONE TIME DATA: ', DEVREG_SC);

        try {
            // Sign the 'data' object
            const { signature, orderedData } = signData(DEVREG_SC.data, privateKey);

            // Add the signature to the 'data' object
            orderedData.signature = signature;

            // Update the 'tx' object with the signature and public key
            orderedData.signature = signature;
            DEVREG_SC.data = orderedData;

            console.log('------------------ ORDEREDDATA: ', orderedData);
            const data = {
                pubkey: publicKey,
                ...orderedData,
                signature: signature
            }

            console.log('------------------ data: ', data);

            const sendToPool = {
                'tx': data,
                'type': 'BB00'
            }

            const strigify = JSON.stringify(sendToPool)
            console.log('------------------ STRINGIFY: ', strigify);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: strigify
            });

            console.log('RESPONSE: ', response);

            if (!response.ok) {
                throw new Error('Some error occurred');
            }

            console.log('Device key registered successfully');
        } catch (error) {
            console.error('Error registering device key:', error);
        }
    }

    const signLocation = async () => {
        try {
            // Get current location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Constructing the data object
            const dataToSend = {
                tx: {
                    pubkey: publicKey,
                    company_id: 1,
                    coords: {
                        accuracy: location.coords.accuracy,
                        altitude: location.coords.altitude,
                        altitudeAccuracy: location.coords.altitudeAccuracy,
                        heading: location.coords.heading,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        speed: location.coords.speed,
                    },
                    devpubkey: devPubKey,
                    mocked: location.mocked,
                    timestamp: location.timestamp / 1000,
                },
                type: 'AA05',
            };

            console.log('------------------ DATA BEFORE: ', dataToSend);

            // Sign the 'tx' object without pubkey and signature
            const { signature, orderedData } = signData(dataToSend.tx, privateKey);

            // Update the 'tx' object with the signature and public key
            orderedData.signature = signature;
            dataToSend.tx = orderedData;

            console.log('------------------ ORDEREDDATA: ', orderedData);
            const tx = {
                pubkey: publicKey,
                ...orderedData,
                signature: signature
            }

            console.log('------------------ TX: ', tx);

            const sendToPool = {
                'tx': tx,
                'type': 'AA05'
            }

            const strigify = JSON.stringify(sendToPool)
            console.log('------------------ STRINGIFY: ', strigify);
            // Send data to API
            await sendToAPI(strigify);
        } catch (error) {
            console.error('Error signing location:', error);
        }
    };

    const sendToAPI = async (dataToSend: any) => {
        // Send data to API
        // Replace API_URL with your actual API endpoint
        const API_URL = 'http://pool.prometeochain.io/node/get_from_ledger';

        console.log('------------------ DATA TO SEND: ', dataToSend);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: dataToSend
            });

            console.log('RESPONSE: ', response);

            if (!response.ok) {
                throw new Error('Some shit gone wrong');
            }

            console.log('Location sent successfully');
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    };

    function jsonToUnicodeHex(json: object): string {
        let jsonString = JSON.stringify(json);

        let unicodeString = '';
        for (let i = 0; i < jsonString.length; i++) {
            let charCode = jsonString.charCodeAt(i);
            if (charCode > 127) {  // Non-Latin characters
                unicodeString += '\\u' + ('0000' + charCode.toString(16)).slice(-4);
            } else {
                unicodeString += jsonString[i];
            }
        }

        // Now convert to hex
        let hexString = '';
        for (let i = 0; i < unicodeString.length; i++) {
            hexString += unicodeString.charCodeAt(i).toString(16);
        }

        return hexString;
    }

    const signData = (data: any, privateKey: string) => {
        try {
            // Sort the keys in the data object
            const orderedData = sortObjectKeys(data);

            // Convert the ordered data object to a string
            const dataString = JSON.stringify(orderedData);

            // Convert the data string to an array of character codes
            //const messageArray = codifyMessage(dataString);
            const hexMessage = jsonToUnicodeHex(JSON.parse(dataString))
            // Import private key
            const key = ec.keyFromSecret(fromHex(privateKey));
            // Sign the message array with the private key
            const signature = toHex(key.sign(hexMessage).toBytes());

            return { signature, orderedData };
        } catch (error) {
            console.error('Error signing data:', error);
            throw error;
        }
    };

    return (
        <></>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50,
        padding: 20,
    },
});

const sortObjectKeys = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys) as any;
    }

    const sortedObj = {} as { [key: string]: any };
    Object.keys(obj)
        .sort()
        .forEach((key) => {
            sortedObj[key] = sortObjectKeys(obj[key]);
        });

    return sortedObj as any;
};