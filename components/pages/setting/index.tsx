import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Setting = () => {
    const settings = [
        { title: 'General', subtitle: 'Currency conversion, primary currency, language and search engine' },
        { title: 'Security & Privacy', subtitle: 'Privacy settings, MetaMetrics, private key and wallet Secret Recovery Phrase', alert: 'Wallet unprotected *' },
        { title: 'Advanced', subtitle: 'Access developer features, reset account, setup testnets, state logs, IPFS gateway and custom RPC' },
        { title: 'Contacts', subtitle: 'Add, edit, remove, and manage your accounts' },
        { title: 'Networks', subtitle: 'Add and edit custom RPC networks' },
        { title: 'Buy & Sell Crypto', subtitle: 'Region & more...' },
        { title: 'Experimental', subtitle: 'WalletConnect & more...' },
        { title: 'About Savitri', subtitle: 'Good blockchain solution for your business' },
    ];

    return (
        <ScrollView style={styles.container}>
            {settings.map((item, index) => (
                <TouchableOpacity key={index} style={styles.itemContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                    {item.alert && <Text style={styles.alert}>{item.alert}</Text>}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 600,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    alert: {
        marginTop: 4,
        color: 'red',
        fontWeight: 600,
    },
});

export default Setting;
