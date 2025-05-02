import { Stack } from "expo-router";
import React from 'react';
import { View, StyleSheet } from "react-native";
import Footer from './Components/footer'

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.stackContainer}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  stackContainer: {
    flex: 1, // Stack area takes up the screen space above footer
  },
});

