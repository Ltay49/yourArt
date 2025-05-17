import { Text, View, ScrollView, StyleSheet, Image, ImageBackground } from "react-native"
import { useRouter, usePathname } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import axios from 'axios';
import AddToCollection from "../Functions/addToCollection";


export default function TheMetArtwork() {

    const { id } = useLocalSearchParams()
    const [artwork, setArtwork] = useState<Artwork | null>(null);

    type Artwork = {
        objectID: Number
        primaryImage: string
        title: String
        culture: String
        artistDisplayName: String
        artistDisplayBio: String
        creditLine: String
    }

    useEffect(() => {
        const fetchArtwork = async () => {
            if (!id) return;

            try {
                const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                setArtwork(response.data);
            } catch (error) {
                console.error("Error fetching artwork:", error);
            }
        }
        fetchArtwork()
    }, [])

    console.log(artwork)

    return (
        <View style={styles.page}>
            <Text>{artwork?.artistDisplayName || "Artist: Unknown"}</Text>
            <Text>{artwork?.artistDisplayBio}</Text>
            {artwork?.primaryImage ? (
            <Image
                 style={styles.image}
                source={{ uri: artwork?.primaryImage || "https://example.com/no-image.png" }}
            /> ) : (
                <ImageBackground style={styles.noImageBox}>
                <Text style={styles.noImageText}>No image available</Text>
            </ImageBackground>
            )}
            <Text>{artwork?.creditLine}</Text>
            <View style={styles.collection}>
        <Text style={styles.collectionText}>Add to your collection</Text>
      <AddToCollection/>
      </View>
        </View>
    )

}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center'
    },
    noImageText: {
        top:'0%',
        height: '40%',
        width: '90%',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 50,
        fontFamily: 'SpecialElite_400Regular',
        color: "brown",
        transform: [{ rotate: '-45deg' }],
        // borderWidth: 2
    },
    noImageBox: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        overflow: 'hidden',
        height: 300,
        justifyContent: 'center',
        borderColor: 'grey'
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
  collection: {
    width: '100%',
    borderTopWidth: 2,
    borderBottomWidth:2,
    alignSelf: 'center',
    flexDirection: 'row',     // Lay out children horizontally
    justifyContent: 'space-evenly', // Push content to the right
    padding: 8,                 // Optional: spacing inside the container
  },
  collectionText:{
    fontFamily: 'NunitoSans_700Bold',
    fontSize:20,
    color:'brown',
    marginTop:10
  }
})