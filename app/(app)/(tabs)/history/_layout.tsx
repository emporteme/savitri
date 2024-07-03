import { Stack } from 'expo-router';

export default () => {
    return (
        <Stack
            screenOptions={
                {
                    headerShown: true,
                    headerShadowVisible: true,
                    title: 'History',
                    headerTitleAlign: 'center'
                }
            }
        >
        </Stack>
    )
}
