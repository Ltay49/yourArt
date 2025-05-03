import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Knewave_400Regular } from '@expo-google-fonts/knewave';
import { useFonts } from 'expo-font';
import Search from "./Components/search";
import React from 'react';
const KH = require('../assets/images/KH.png');

export default function MainScreen() {
  const intro = `"Art is for everybody. I don’t think art should be only for the select few, I think it should be for the masses of people." 
— Keith Haring`;

  const [fontsLoaded] = useFonts({
    Knewave_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.introContainer}>
        <ImageBackground source={KH} style={styles.background}>
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,1)']} // transparent top → white bottom
            style={styles.gradient}
          />
          <Text style={styles.intro}>{intro}</Text>
        </ImageBackground>
      </View>

      <Search />
    </>
  );
}

const styles = StyleSheet.create({
  introContainer: {
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    top: '-1%',
    // borderWidth: 1,
    height: '34%',
  },
  intro: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Copperplate',
    textAlign: 'center',
    paddingHorizontal: 10,
    zIndex: 2, // make sure text is above gradient
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject, // full cover
    zIndex: 1, // gradient is between background and text
  },
});
