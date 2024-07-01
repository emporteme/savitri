import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)/wallet',
};


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    mBlack: require("../../assets/fonts/Poppins-Black.ttf"),
    mXBold: require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    mBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    mSBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    mMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
    mRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    mLight: require("../../assets/fonts/Poppins-Light.ttf"),
    mELight: require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    mThin: require("../../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />


      </Stack>
    </ThemeProvider>
  );
}
