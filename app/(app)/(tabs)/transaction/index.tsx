import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

const transactions = [
    { id: 'CC00c479', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '5 seconds ago' },
    { id: 'CC00a117', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '1 minute ago' },
    { id: 'CC00e123', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '3 minutes ago' },
    { id: 'CC00e9f1', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '10 minutes ago' },
    { id: 'CC00e434', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '15 minutes ago' },
    { id: 'CC00190', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '20 minutes ago' },
    { id: 'CC00b32', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '30 minutes ago' },
    { id: 'CC005a53', sender: '41abb4...2b0e2c', type: 'sc for buying tokens', timestamp: '1 hour ago' },
    // Add more transactions as needed
];

const Transaction: React.FC = () => {
    return (
        <ScrollView style={styles.container}>
            {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionContainer}>
                    <View style={styles.transactionDetail}>
                        <Text style={styles.transactionTextBold}>{transaction.id}</Text>
                        <Text style={styles.transactionText}>{transaction.timestamp}</Text>
                    </View>
                    <View style={styles.transactionDetail}>
                        <Text style={styles.transactionText}>From: {transaction.sender}</Text>
                        <Text style={styles.transactionText}>Type: {transaction.type}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
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

export default Transaction;
