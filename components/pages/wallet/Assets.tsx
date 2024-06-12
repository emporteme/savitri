import { View, Text } from 'react-native'
import React from 'react'

const Assets: React.FC = () => {
    return (
        <View style={{ flex: 1, paddingVertical: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Text style={{ textAlign: 'center' }}>No Assets & NFTs yet</Text>
        </View>
    )
}

export default Assets