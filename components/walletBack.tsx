import {StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Link} from "expo-router";
import React from "react";

export default function WalletBack(){
    return(
        <Link href="/wallet">
            <View style={styles.headerContent}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.headerText}>Wallet creation</Text>
            </View>
        </Link>
    )
}
const styles = StyleSheet.create({
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
})
