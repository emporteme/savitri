import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 60 }
      }} >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="modal"
        options={{
          title: 'Modal',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: '#6B96FE', borderRadius: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36 }}>
              <TabBarIcon name={focused ? 'swap-vertical' : 'swap-vertical-outline'} color={'#fff'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'time' : 'time-outline'} color={color} />
          ),
        }}
      />
    </ Tabs>
  );
}
