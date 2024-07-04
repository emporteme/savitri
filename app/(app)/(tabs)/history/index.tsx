import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Services } from "@/services/services";
import * as SecureStore from "expo-secure-store";
import moment from 'moment';
import 'moment-duration-format';
import Ionicons from "@expo/vector-icons/Ionicons";

interface Wallet {
    type: string;
    publicKey: string;
    privateKey: string;
}

interface TransactionItem {
    id: string;
    timestamp: string;
    sender: string;
    type: string;
    tsx: any,
    pubkey: string;
}

const History: React.FC = () => {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(false);

    const loadKeys = async () => {
        // Реализация загрузки ключей (если необходима)
    };

    const historyGet = async () => {
        const services = new Services();
        const keys = await SecureStore.getItemAsync('wallets');

        if (keys) {
            const key: TransactionItem[] = [];
            for (const wallet of [1]) {
                const data = await services.TestGetResource(`data/tx/pk/36e176ad58fad39b0b0deec73f80337945b1ec94482321c4c7fa914e69e670f8`);
                if (data.total > 0) {
                    for (const j in data.items) {
                        key.push(data.items[j]);
                    }
                }
            }
            setLoading(true);
            console.log(key)
            setTransactions(key);
        }
    };

    useEffect(() => {
        loadKeys();
        historyGet();
    }, []);

    const formatTimestamp = (timestamp: any) => {
        const now = moment();
        const ts = moment(timestamp * 1000);
        const diffSeconds = now.diff(ts, 'seconds');
        const diffMinutes = now.diff(ts, 'minutes');
        const diffHours = now.diff(ts, 'hours');
        const diffDays = now.diff(ts, 'days');

        if (diffSeconds < 60) {
            return `${diffSeconds} seconds ago`;
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else {
            return `${diffDays} days ago`;
        }
    };

    const renderItem = ({ item }: { item: TransactionItem }) => (
        <View style={styles.transactionContainer}>
            <View style={styles.transactionDetail}>
                <Text style={styles.transactionTextBold}>{item.pubkey.substring(0, 10)}... <Text style={styles.timeText}>{formatTimestamp(item.timestamp)}</Text></Text>
                <Text style={styles.transactionText}>Token Transfer</Text>
            </View>
            <View style={styles.transactionDetail}>
                <Text style={styles.transactionText}><Ionicons name={"checkmark-circle-outline"} color={"#4AAC30"} size={20}/></Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                transactions.length > 0 ? (
                    <FlatList
                        data={transactions}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <Text>История пуста</Text>
                )
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    transactionContainer: {
        backgroundColor: '#f7f7f7',
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 5,
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        color: 'gray',
        fontSize: 12,
    },
    transactionDetail: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    transactionText: {
        fontSize: 16,
        color: '#333',
    },
    transactionTextBold: {
        fontSize: 16,
        color: '#9E3FFE',
        fontWeight: 'bold',
    },
});

export default History;
