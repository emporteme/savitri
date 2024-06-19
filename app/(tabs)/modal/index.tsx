import { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppSend from '@/components/pages/actions/Send';

export default function Modal() {
    const [activeComponent, setActiveComponent] = useState('Send');
    const snapPoints = useMemo(() => ['30%', '60%', '100%'], []);

    const handleSendPress = () => setActiveComponent('Send');
    const handleReceivePress = () => setActiveComponent('Receive');

    return (
        <View style={{ flex: 1 }}>
            {activeComponent === 'Send' && <AppSend />}
            <GestureHandlerRootView>
                <View style={styles.container}>
                    <BottomSheet index={1} snapPoints={snapPoints}>
                        <View style={styles.contentContainer}>
                            <TouchableOpacity onPress={handleSendPress}>
                                <Text style={styles.containerHeadline}>Send</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contentContainer}>
                            <TouchableOpacity onPress={handleReceivePress}>
                                <Text style={styles.containerHeadline}>Receive</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheet>
                </View>
            </GestureHandlerRootView>
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
