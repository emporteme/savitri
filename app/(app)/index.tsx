import { View, Text } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
  const navigate = useRouter();

  // Redirect to the wallet page
  React.useEffect(() => {
    navigate.push('/wallet');
  }, [navigate]);

  return (
    <View>
      <Text>Redirecting to wallet...</Text>
    </View>
  );
};

export default Index;
