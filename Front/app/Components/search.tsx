import { StyleSheet, Text, View, ScrollView, SafeAreaView, ImageBackground, Animated, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import type { ViewProps } from 'react-native';
const Chicago = require('../../assets/images/ChicagoArtMus.png')
const RKJ = require('../../assets/images/RJK.png')
const Met = require('../../assets/images/MetMus.png')
import { useWindowDimensions, Platform } from 'react-native';
import React, { useRef } from 'react';


export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const isWeb = width > 768;

  const scaleChicago = useRef(new Animated.Value(1)).current;
  const scaleMet = useRef(new Animated.Value(1)).current;

  const handlePressIn = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1.15,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Web hover events for Chicago image
  const chicagoHoverEvents = Platform.OS === 'web'
    ? {
        onMouseEnter: () => handlePressIn(scaleChicago),
        onMouseLeave: () => handlePressOut(scaleChicago),
      } as unknown as ViewProps
    : {};

  // Web hover events for Met image
  const metHoverEvents = Platform.OS === 'web'
    ? {
        onMouseEnter: () => handlePressIn(scaleMet),
        onMouseLeave: () => handlePressOut(scaleMet),
      } as unknown as ViewProps
    : {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Chicago */}
        <View style={[styles.galleryName, isWeb && styles.galleryNameWeb]}>
          <Animated.View
            style={[
              styles.galleryPic,
              { transform: [{ scale: scaleChicago }] }
            ]}
            onTouchStart={() => handlePressIn(scaleChicago)}
            onTouchEnd={() => handlePressOut(scaleChicago)}
            {...chicagoHoverEvents}
          >
            <ImageBackground source={Chicago} style={styles.galleryPic}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
                style={styles.gradient}
              />
              <Text
                style={styles.galLink}
                onPress={() => router.push('/chicago')}
              >
                The Art Institute of Chicago
              </Text>
            </ImageBackground>
          </Animated.View>
        </View>

        {/* Met */}
        <View style={[styles.galleryName, isWeb && styles.galleryNameWeb]}>
          <Animated.View
            style={[
              styles.galleryPic,
              { transform: [{ scale: scaleMet }] }
            ]}
            onTouchStart={() => handlePressIn(scaleMet)}
            onTouchEnd={() => handlePressOut(scaleMet)}
            {...metHoverEvents}
          >
            <ImageBackground source={Met} style={styles.galleryPic}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
                style={styles.gradient}
              />
              <Text
                style={styles.galLink}
                onPress={() => router.push(`./themet`)}
              >
                The Metropolitan Museum of Art
              </Text>
            </ImageBackground>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    height: '60%',
    top: '33%',
  },
  scrollContent: {
    paddingBottom: 15,
    alignItems: "center",
  },
  galleryName: {
    // borderWidth: 2,
    borderRadius: 40,
    borderColor: "black",
    width: "100%",
    height: 400,
    marginVertical: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  galleryNameWeb: {
    width: '95%',
    height: 400,
    borderColor: 'black',
    // borderBottomWidth:2,
    // borderTopWidth:2,
    borderRadius: 1 // bigger on web
  },
  galLink: {
    textAlign: 'center',
    justifyContent: "flex-end",
    top: '35%',
    zIndex: 2,
    fontSize: 25,
    fontFamily: 'Copperplate',
    // fontWeight:'bold',
    color: 'brown',
    textDecorationLine: 'underline'

  },
  galleryPic: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 2,

  },
  gradient: {
    ...StyleSheet.absoluteFillObject, // full cover
    zIndex: 1, // gradient is between background and text
  },
});
