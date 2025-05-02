import { Text, View, StyleSheet } from "react-native";
import Footer from "./Components/footer";
import MainScreen from "./Home";
import React from 'react';

export default function Index() {
  return (
    <View style={styles.mainContainer}>
      <MainScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  }
})