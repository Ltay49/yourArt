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


export default function MainScreen() {

  const intro = `"Art is for everybody. I don't think art should be only for the select few, I think it should be for the masses of people." 
— Keith Haring`;

  const introWeb = `"Art is for everybody. I don't think art should be only for the select few, I think it should be for the masses of people."  — Keith Haring`;

  const { width } = useWindowDimensions();

  // Dynamically set font size
  const isWeb = width > 777;
  const isWebSmall = width > 100;
  const [fontsLoaded] = useFonts({
    Knewave_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
    <StatusBar style="dark" translucent backgroundColor="transparent" />
      <SafeAreaView
        style={[
          styles.introContainer,
          isWebSmall && styles.introContainerWeb,
          { backgroundColor: 'white' }
        ]}
      >
        <ImageBackground source={KH} style={styles.background} resizeMode="cover">
          <LinearGradient
            colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,1)']}
            style={styles.gradient}
          />
          <View style={styles.headerRow}>
            <Text style={[styles.headertext, isWeb && styles.headertextWeb]}>IT'S.</Text>
            <Text style={[styles.headertext, isWeb && styles.headertextWeb]}>YOUR.</Text>
            <Text style={[styles.headertext, isWeb && styles.headertextWeb]}>ART.</Text>
          </View>
          <Text style={[styles.intro, isWeb && styles.introWeb]}>
            {isWeb ? introWeb : intro}
          </Text>
          <Text style={styles.howTo}>Welcome to ITSYOURSART your go to curator platform, search from the Exhibition below and build up your own collections!
          feel free to have a look around, if you see anything you like make sure to quicly sign up and begin curating!</Text>
          <Text style={styles.howTo}>Simply press the + to add and a later date the x that piece no longer suites your taste, enjoy!</Text>
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
    marginBottom:10
  },
  introContainerWeb: {
    width: '100%',
    alignSelf: 'center',
    height: '35%',
  },
  intro: {
    top: '10%',
    height: '100%',
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Copperplate',
    textAlign: 'center',
    paddingHorizontal: 10,
    zIndex: 2,
  },
  howTo: {
    top: '10%',
    height: '100%',
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    paddingHorizontal: 39,
    zIndex: 2,
  },
  headerRow: {
    top: '5%',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 2,
  },
  headertext: {
    fontSize: 25,
    color: 'darkred',
    fontWeight: 'bold'
  },
  headertextWeb: {
    fontSize: 40,
    color: 'darkred',
    fontWeight: 'bold'
  },
  introWeb: {
    marginLeft: 30,
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Copperplate',
    textAlign: 'left',
    paddingHorizontal: 10,
    zIndex: 2,
  },
  background: {
    top: '0%',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
