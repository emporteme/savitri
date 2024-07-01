import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

const Explore = () => {
  const handlePress = () => {
    Linking.openURL('https://explorer.ikarusway.com/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore More</Text>
      <Text style={styles.description}>
        Discover detailed information and explore further by visiting our dedicated resource. Tap the link below to learn more about our services and offerings.
      </Text>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>Go to IkarusWay Explorer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6B96FE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 500
  }
});

export default Explore;
