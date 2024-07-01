import {Image, StyleSheet, Platform, View, Text, SafeAreaView, Pressable} from 'react-native';
import {Link, router, Stack} from 'expo-router';
import { WalletList, TabViews } from '@/components/pages/wallet';

export default function WalletScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
    <WalletList />
      <TabViews />
        <Pressable onPress={()=>router.push("wallet/seedPhrase")}><Text>1</Text></Pressable>
    </View>
  );
}
