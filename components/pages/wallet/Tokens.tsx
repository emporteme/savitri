import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const Tokens: React.FC = () => {
    return (
        <View style={{ flex: 1, paddingVertical: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 26, fontWeight: 400 }}>$0</Text>
                <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#6B96FE', borderRadius: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: '#6B96FE', fontWeight: 500 }}>Portfolio</Text>
                    <Ionicons name="open-outline" size={16} color="#6B96FE" />
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 16 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 20, backgroundColor: 'violet' }}></View>
                    <Text style={{ fontWeight: 400, fontSize: 18 }}>Savitri</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: 600 }}>$0.00</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <Text style={{ fontWeight: 700, fontSize: 14 }}>Add Crypto to get started</Text>
                <View style={{ backgroundColor: '#6B96FE', borderRadius: 24, padding: 12, flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>Buy Savitri</Text>
                </View>
                <Text style={{ textAlign: 'center', fontSize: 12 }}>Don't you see your token? <Text style={{ color: '#6B96FE' }}>Import tokens</Text></Text>
            </View>
        </View>
    )
}

export default Tokens
