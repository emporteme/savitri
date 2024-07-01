import { Image, StyleSheet, Platform, View, Text, SafeAreaView } from 'react-native';
import {Link, Stack} from 'expo-router';
import { WalletList, TabViews } from '@/components/pages/wallet';

export default function WalletScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
    <WalletList />
      <TabViews />
        <Link href={"wallet/seedPhrase"}><Text>1</Text></Link>
    </View>
  );
}
