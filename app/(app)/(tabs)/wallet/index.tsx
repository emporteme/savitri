import { Image, StyleSheet, Platform, View, Text, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { WalletList, TabViews } from '@/components/pages/wallet';

export default function WalletScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <WalletList />
      <TabViews />
    </View>
  );
}
