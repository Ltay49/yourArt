import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Knewave_400Regular } from '@expo-google-fonts/knewave';
import { useFonts } from 'expo-font';
import Search from "./Components/search";
import React from 'react';
const KH = require('../assets/images/KH.png');
import { useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Lexend_400Regular } from '@expo-google-fonts/lexend';


export default function MainScreen() {

  

  const intro = `"Art is for everybody. I don't think art should be only for the select few, I think it should be for the masses of people." 
— Keith Haring`;

  const introWeb = `"Art is for everybody. I don't think art should be only for the select few, I think it should be for the masses of people."  — Keith Haring`;

  const { width } = useWindowDimensions();

  // Dynamically set font size
  const fullScreen = width > 1200 && width <= 1800
  const isWeb = width > 1100;
  const isMobile = width > 100 && width <= 390
  const isWebSmall = width > 300 && width <= 800
  const isWebMedium = width > 800 && width <= 1142;

  const [fontsLoaded] = useFonts({
    Knewave_400Regular,
    Lexend_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <SafeAreaView
        accessible={true}
        accessibilityRole="summary"
        accessibilityLabel="Welcome screen with art quote and app instructions"
        style={[
          styles.introContainer,
          isWebSmall && styles.introContainerWeb,
          fullScreen && styles.introContainerWebFS,
          isMobile && styles.introContainerWebMb,
          { backgroundColor: 'white' }
        ]}
      >
        <View
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Main tagline: It's Your Art"
          style={styles.headerRow}
        >
          <Text style={[styles.headertext, isWeb && styles.headertextWeb]}>IT'S.</Text>
          <Text style={[styles.headertext, isWeb && styles.headertextWeb]}>YOUR.</Text>
          <Text style={[styles.headertext, isWeb && styles.headertextWeb]}>ART.</Text>
        </View>
        <ImageBackground
          source={KH}
          style={styles.background}
          resizeMode="cover"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="Keith Haring artwork background"
        >
          <LinearGradient
            colors={[
              'rgba(255,255,255,1)',   // top: solid white
              'rgba(255,255,255,0.6)',   // middle: fully transparent
              'rgba(255,255,255,1)'    // bottom: solid white
            ]}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />

          <Text
            style={[styles.intro, isWeb && styles.introWeb, isWebMedium && styles.introMed ]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="Keith Haring quote"
          >
            {isWeb ? introWeb : intro}
          </Text>
        </ImageBackground>
      </SafeAreaView>

      <Search />
    </>
  );
}
const styles = StyleSheet.create({
  introContainer: {
    width: '100%',
    alignSelf: 'center',
    height: '35%',
    marginBottom: 0,
  },
  introContainerWeb: {
    width: '100%',
    alignSelf: 'center',
    height: '30%',
    marginBottom: 0,
  },
  introContainerWebFS: {
    width: '100%',
    alignSelf: 'center',
    height: '35%',
    marginBottom: 0,
  },
  introContainerWebMb:{
    height: '35%',
    marginBottom: 0,
  },

  intro: {
    top: '10%',
    height: '100%',
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Copperplate',
    textAlign: 'center',
    paddingHorizontal: 30,
    zIndex: 2,
  },
  headerRow: {
    // top: '5%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    zIndex: 2,
    marginLeft: '5%'
  },
  headertext: {
    fontSize: 25,
    color: 'darkred',
    fontFamily:' Lexend_400Regular',
    fontWeight: 'bold',
  },
  headertextWeb: {
    fontSize: 40,
    color: 'darkred',
    fontWeight: 'bold',
  },
  introWeb: {
    marginLeft: 30,
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Copperplate',
    textAlign: 'left',
    paddingHorizontal: 50,
    zIndex: 2,
  },
  introMed: {
    marginLeft: 30,
    fontSize: 28,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Copperplate',
    textAlign: 'left',
    paddingHorizontal: 50,
    zIndex: 2,
  },
  background: {
    width: '97%',
    height: '100%',
    justifyContent: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

