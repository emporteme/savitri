import { Stack } from 'expo-router';

export default () => {
    return (
        <Stack
            screenOptions={
                {
                    headerShown: true,
                    headerShadowVisible: false,
                    title: 'СreateWallet',
                    headerTitleAlign: 'center'
                }
            }
        >
        </Stack>
    )
}
