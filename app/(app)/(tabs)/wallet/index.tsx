import { Image, StyleSheet, Platform, View, Text, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { TabViews } from '@/components/pages/wallet';

export default function WalletScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text>The home page</Text>
        <Text>The home page</Text>
        <Text>The home page</Text>
        <Text>The home page</Text>
        <Text>The home page</Text>
      </View>
      <TabViews />
    </View>
  );
}
