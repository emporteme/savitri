import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const Wallet: React.FC = () => {
    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'column', padding: 16, borderWidth: 1, borderColor: 'gray', borderRadius: 8 }}>
                <View style={{ paddingBottom: 16, borderBottomWidth: 1, borderColor: 'gray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 16 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'violet' }}></View>
                        <Text style={{ fontWeight: 500, fontSize: 18 }}>Account 1</Text>
                    </View>
                    <View>
                        <Ionicons />
                        <Ionicons name="chevron-down-outline" size={24} color="black" />
                    </View>
                </View>
                <View style={{ paddingTop: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 16 }}>
                        <Text style={{ fontWeight: 600 }}>Address:</Text>
                        <Pressable style={{ borderRadius: 20, backgroundColor: '#6B96FE20', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}>
                            <Text style={{ color: '#6B96FE' }}>0x2214...3120</Text>
                            <Ionicons name="copy" size={16} color="#6B96FE" />
                        </Pressable>
                    </View>
                    <View>
                        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                    </View>
                </View>
            </View>
        </>
    )
}

export default Wallet