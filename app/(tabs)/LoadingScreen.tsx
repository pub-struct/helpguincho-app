import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function LoadingScreen() {
  return (

    <View style={styles.container}>
        <Image
              source={require('@/assets/images/loadingicon.jpeg')} // Substitua pelo caminho da sua logo
              style={styles.loadingicon}
            />
      <Text style={styles.text}></Text>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fFcc04',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  loadingicon: {
    maxHeight: 600,
    maxWidth: 400,
  },
});