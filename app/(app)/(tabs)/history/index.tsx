import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Services } from "@/services/services";
import * as SecureStore from "expo-secure-store";

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
            for (const wallet of JSON.parse(keys)) {
                const data = await services.TestGetResource(`data/tx/pk/${wallet.publicKey}`);
                if (data.total > 0) {
                    for (const j in data.items) {
                        key.push(data.items[j]);
                    }
                }
            }
            setLoading(true);
            setTransactions(key);
        }
    };

    useEffect(() => {
        loadKeys();
        historyGet();
    }, []);

    const renderItem = ({ item }: { item: TransactionItem }) => (
        <View style={styles.transactionContainer}>
            <View style={styles.transactionDetail}>
                <Text style={styles.transactionTextBold}>{item.id}</Text>
                <Text style={styles.transactionText}>{item.timestamp}</Text>
            </View>
            <View style={styles.transactionDetail}>
                <Text style={styles.transactionText}>From: {item.sender}</Text>
                <Text style={styles.transactionText}>Type: {item.type}</Text>
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
        color: '#333',
        fontWeight: 'bold',
    },
});

export default History;
