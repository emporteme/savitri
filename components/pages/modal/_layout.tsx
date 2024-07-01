import { Stack } from 'expo-router';

export default () => {
    return (
        <Stack
            screenOptions={
                {
                    headerShown: true,
                    headerShadowVisible: true,
                    title: 'Modal',
                    headerTitleAlign: 'center'
                }
            }
        >
        </Stack>
    )
}