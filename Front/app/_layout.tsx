import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router'; // or your navigation lib
import { UserProvider } from '../utils/UserContext'; // adjust path
import Footer from './Components/footer'; // assuming Footer is a component you import

export default function RootLayout() {
  return (
    <UserProvider>
      <View style={styles.container}>
        <View style={styles.stackContainer}>
          <Stack screenOptions={{ headerShown: false}} />
        </View>
        <Footer />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
  },
});

