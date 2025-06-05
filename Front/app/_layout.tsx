import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router'; // or your navigation lib
import { UserProvider } from '../utils/UserContext'; // adjust path
import Footer from './Components/footer'; // assuming Footer is a component you import
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <View style={styles.container}>
          <View style={styles.stackContainer}>
            <Stack screenOptions={{ headerShown: false }} />
          </View>
          <Footer />
        </View>
      </UserProvider>
    </SafeAreaProvider>
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

