import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomTabBarLabel from '@/components/navigation/CustomTabBarLabel'; // Make sure the path is correct

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const tintColor = Colors[colorScheme ?? 'light'].tint;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: tintColor,
                headerShown: false,
                tabBarStyle: { height: 60 },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'wallet',
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabBarLabel name={focused ? 'wallet' : 'wallet-outline'} title="Wallet" color={color} focused={focused} />
                    ),
                }}
            />

            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'transactions',
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabBarLabel name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'} title="transaction" color={color} focused={focused} />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: 'history',
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabBarLabel name={focused ? 'time' : 'time-outline'} title="History" color={color} focused={focused} />
                    ),
                }}
            />

        </Tabs>
    );
}

const styles = StyleSheet.create({
    modalIcon: {
        backgroundColor: '#6B96FE',
        borderRadius: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
    },
});
