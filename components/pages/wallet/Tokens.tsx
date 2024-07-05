import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tokens: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 16 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>$46,456.23</Text>
                <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#6B96FE', borderRadius: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: '#6B96FE', fontWeight: 'bold' }}>Portfolio</Text>
                    <Ionicons name="open-outline" size={16} color="#6B96FE" />
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                    { name: 'Ikarus Token (IKT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Bitcoin (BTC)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Tether (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Ikarus Token (IKT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Bitcoin (BTC)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Tether (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                    { name: 'Token name (USDT)', price: '$0.2', amount: 1000, value: '$200' },
                ].map((token, index) => (
                    <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <Image source={require('./img/savitri.png')} style={{ width: 36, height: 36, borderRadius: 18}}/>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{token.name}</Text>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{token.amount}</Text>
                            <Text style={{ fontSize: 14, color: '#888' }}>{token.value}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default Tokens;

