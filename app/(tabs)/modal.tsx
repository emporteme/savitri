import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Modal() {
    const snapPoints = useMemo(() => ['5%', '25%', '50%', '70%', '95%'], []);

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <BottomSheet index={1} snapPoints={snapPoints}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.containerHeadline}>Awesome Bottom Sheet 🎉</Text>
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
        flex: 1,
        alignItems: 'center'
    },
    containerHeadline: {
        fontSize: 24,
        fontWeight: '600',
        padding: 20
    }
});