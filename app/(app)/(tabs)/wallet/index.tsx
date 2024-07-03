import { Image, StyleSheet, Platform, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { WalletList, TabViews, Header } from '@/components/pages/wallet';

export default function WalletScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Header />
      <WalletList />
      <TabViews />
    </View>
  );
}
