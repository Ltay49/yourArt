import { StyleSheet, Text, View, ScrollView, SafeAreaView, ImageBackground} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
const Chicago = require('../../assets/images/ChicagoArtMus.png')
const RKJ = require ('../../assets/images/RJK.png')
const Met = require ('../../assets/images/MetMus.png')


export default function Search() {

    const router = useRouter();
    const pathname = usePathname(); 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.galleryName}>
     <ImageBackground source={Chicago} style={styles.galleryPic}>
     <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
            style={styles.gradient}
          />
          <Text style={styles.galLink}
            onPress={() => router.push('/Chicago')}>
            The Art Institute of Chicago</Text>
        </ImageBackground>
        </View>
        <View style={styles.galleryName}>
        <ImageBackground source={Met} style={styles.galleryPic}>
     <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
            style={styles.gradient}
          />
          <Text style={styles.galLink}
            onPress={() => router.push('/TheMet')}
            >
            The Metropolitan Museum of Art</Text>
        </ImageBackground>
        </View>
        <View style={styles.galleryName}>
        <ImageBackground source={RKJ} style={styles.galleryPic}>
     <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']}
            style={styles.gradient}
          />
          <Text style={styles.galLink}
            onPress={() => router.push('/Chicago')}
            >
           Rajkmuseam</Text>
        </ImageBackground>
        </View>
        <View style={styles.galleryName}>
        <Text>Rajkmuseam</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '60%',
    top:'33%',
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: "center",
  },
  galleryName: {
    // borderWidth: 2,
    borderRadius: 40,
    borderColor: "black",
    width: "100%",
    height: 300,
    marginVertical: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  galLink:{
    textAlign:'center',
    justifyContent: "flex-end",
    top:'35%',
    zIndex:2,
    fontSize:25,
    fontFamily: 'Copperplate',
    // fontWeight:'bold',
    color:'brown',
    textDecorationLine:'underline'

  },
  galleryPic:{
width:'100%',
height:'100%',
justifyContent:'center',
alignSelf:'center',
overflow:'hidden',
borderRadius: 0,
},
gradient: {
    ...StyleSheet.absoluteFillObject, // full cover
    zIndex: 1, // gradient is between background and text
  },
});
