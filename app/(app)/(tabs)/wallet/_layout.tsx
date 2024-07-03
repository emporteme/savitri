import { Stack } from 'expo-router';

export default () => {
    return (
        <Stack
            screenOptions={
                {
                    headerShown: false,
                    headerShadowVisible: true,
                    title: 'Wallet',
                    headerTitleAlign: 'center'
                }
            }
        >
            <Stack.Screen name={"seedPhrase"}></Stack.Screen>
        </Stack>
    )
}
