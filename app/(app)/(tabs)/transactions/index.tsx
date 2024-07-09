import { useState } from 'react';
import { StyleSheet, View} from 'react-native';
import AppSend from '@/components/pages/actions/Send';

export default function Modal() {
    const [activeComponent, setActiveComponent] = useState('Send');
    return (
        <View style={{ flex: 1 }}>
            {activeComponent === 'Send' && <AppSend />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#6B96FE',
        borderRadius: 16,
    },
    containerHeadline: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '600',
        color: '#fff',
    },
});
