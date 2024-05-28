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
        </Stack>
    )
}