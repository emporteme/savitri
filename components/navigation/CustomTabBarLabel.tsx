import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomTabBarLabelProps {
    name: React.ComponentProps<typeof Ionicons>['name'];
    title: string;
    color: string;
    focused: boolean;
}

const CustomTabBarLabel: React.FC<CustomTabBarLabelProps> = ({ name, title, color, focused }) => {
    return (
        <View style={styles.tabContainer}>
            <Ionicons name={name} size={24} color={color} />
            <Text style={[styles.tabLabel, { color }]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        alignItems: 'center',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default CustomTabBarLabel;
