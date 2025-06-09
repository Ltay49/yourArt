import { StyleSheet, Text, View, ScrollView, SafeAreaView, ImageBackground, Animated, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import type { ViewProps } from 'react-native';
const Chicago = require('../../assets/images/ChicagoArtMus.png')
const RKJ = require('../../assets/images/RJK.png')
const Met = require('../../assets/images/MetMus.png')
import { useWindowDimensions, Platform } from 'react-native';
import React, { useRef } from 'react';
import { AccessibilityInfo } from 'react-native';


export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const isWeb = width > 768;

  const scaleChicago = useRef(new Animated.Value(1)).current;
  const scaleMet = useRef(new Animated.Value(1)).current;

  const handlePressIn = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const chicagoHoverEvents = Platform.OS === 'web'
    ? {
      onMouseEnter: () => handlePressIn(scaleChicago),
      onMouseLeave: () => handlePressOut(scaleChicago),
    } as unknown as ViewProps
    : {};

  const metHoverEvents = Platform.OS === 'web'
    ? {
      onMouseEnter: () => handlePressIn(scaleMet),
      onMouseLeave: () => handlePressOut(scaleMet),
    } as unknown as ViewProps
    : {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* CHICAGO */}
        <View style={[styles.galleryName, isWeb && styles.galleryNameWeb]}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,1)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,1)'
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
          <Animated.View
            style={[
              styles.galleryPic,
              { transform: [{ scale: scaleChicago }] },
            ]}
            onTouchStart={() => handlePressIn(scaleChicago)}
            onTouchEnd={() => handlePressOut(scaleChicago)}
            {...chicagoHoverEvents}
          >
            <ImageBackground
              source={Chicago}
              style={[styles.galleryPic, isWeb && styles.galleryPicWeb]}
              accessibilityRole="image"
              accessibilityLabel="Image of The Art Institute of Chicago"
            >
              <Pressable
                onPress={() => router.push('/chicago')}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Go to The Art Institute of Chicago gallery"
                accessibilityHint="Navigates to The Art Institute of Chicago artworks"
                style={[styles.accessibleLink, isWeb && styles.accessibleLinkWeb]}
              >
                <Text style={styles.galLink}>
                  The Art Institute of Chicago
                </Text>
              </Pressable>
            </ImageBackground>
          </Animated.View>
        </View>

        {/* MET */}
        <View style={[styles.galleryName, isWeb && styles.galleryNameWeb]}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,1)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,1)'
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
          <Animated.View
            style={[
              styles.galleryPic,
              { transform: [{ scale: scaleMet }] },
            ]}
            onTouchStart={() => handlePressIn(scaleMet)}
            onTouchEnd={() => handlePressOut(scaleMet)}
            {...metHoverEvents}
          >
            <ImageBackground
              source={Met}
              style={[styles.galleryPic, isWeb && styles.galleryPicWeb]}
              accessibilityRole="image"
              accessibilityLabel="Image of The Metropolitan Museum of Art"
            >
              <Pressable
                onPress={() => router.push('./themet')}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Go to The Metropolitan Museum of Art gallery"
                accessibilityHint="Navigates to The Metropolitan Museum of Art artworks"
                style={[styles.accessibleLink, isWeb && styles.accessibleLinkWeb]}
              >
                <Text style={styles.galLink}>
                  The Metropolitan Museum of Art
                </Text>
              </Pressable>
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
  },
  scrollContent: {
    paddingBottom: "10%",
    alignItems: "center",
    justifyContent:'center'
  },
  galleryName: {
    borderColor: "black",
    width: "100%",
    height: 400,
    padding: 20,
    marginVertical: 0,
    // justifyContent: "flex-end",
    alignItems: "center",
    alignContent:'center',
    borderBottomWidth: 5,
    backgroundColor: 'brown'
  },
  galleryNameWeb: {
    alignItems: "center",
    width: '90%',
    height: 400,
    padding: 20,
    borderRadius: 2,
    borderBottomWidth: 5,
    backgroundColor: 'brown'
  },
  galLink: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Copperplate',
    color: '#ffffff',
    textDecorationLine: 'underline',
    zIndex: 2,
  },
  accessibleLink: {
    width: "99%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, .5)', // improves text visibility
  },
  accessibleLinkWeb: {
    width: "90%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, .5)', // improves text visibility
  },
  galleryPicWeb: {
    zIndex: 2,
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft:'3%',
    overflow: 'hidden',
    borderRadius: 2,
  },
  galleryPic: {
    zIndex: 2,
    // marginLeft:'.5%',
    width: '99%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 2,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

