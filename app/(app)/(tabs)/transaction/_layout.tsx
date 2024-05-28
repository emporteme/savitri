import { Stack } from 'expo-router';

export default () => {
    return (
        <Stack
            screenOptions={
                {
                    headerShown: true,
                    headerShadowVisible: true,
                    title: 'Transaction',
                    headerTitleAlign: 'center'
                }
            }
        >
        </Stack>
    )
}