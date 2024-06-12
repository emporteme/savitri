import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Modal() {
    const snapPoints = useMemo(() => ['12.5%', '25%', '50%', '70%'], []);

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <BottomSheet index={1} snapPoints={snapPoints}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Send</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Receive</Text>
                    </View>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        // flex: 1,
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
    }
});