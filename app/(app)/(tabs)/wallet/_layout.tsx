import { Stack } from 'expo-router';

export default () => {
    return (
        <Stack
            screenOptions={
                {
                    headerShown: true,
                    headerShadowVisible: true,
                    title: 'Wallet',
                    headerTitleAlign: 'center'
                }
            }
        >
            <Stack.Screen name="seedPhrase" options={{ headerShown: false }} />
            <Stack.Screen name="createWallet" options={{ headerShown: false }} />
        </Stack>
    )
}
