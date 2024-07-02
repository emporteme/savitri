import {View, Text, TouchableOpacity, Pressable} from 'react-native';
import React, { useEffect } from 'react';
import {Link, useRouter} from 'expo-router';
import { Slot } from "expo-router";


const Index = () => {
    const navigate = useRouter();

    React.useEffect(() => {
        navigate.push({pathname: "/wallet"});
    }, [navigate]);

    return (
        <View>
            <Slot />
            <Text>Redirecting to wallet...</Text>
        </View>
    );
};

export default Index;
