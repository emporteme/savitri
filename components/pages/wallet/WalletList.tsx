import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Wallet from './Wallet'

const WalletList: React.FC = () => {
    return (
        <ScrollView style={{ height: '0%' }}>
            <Wallet />
        </ScrollView>
    )
}

export default WalletList