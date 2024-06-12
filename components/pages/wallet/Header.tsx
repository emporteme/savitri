import { View, Text } from 'react-native'
import React from 'react'

const Header: React.FC = () => {
    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 16, borderBottomWidth: 1, borderColor: 'black' }}>
            <Text style={{ fontSize: 16 }}>Header</Text>
        </View>
    )
}

export default Header