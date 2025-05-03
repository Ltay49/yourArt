import { View, Text, TextInput, StyleSheet, ScrollView, Image } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import React from 'react';
import SerachBar from "./Components/searchBar";
import { ActivityIndicator } from "react-native";


export default function TheMetScreen() {

    const [loading, setLoading] = useState(true);


    type Artwork = {
        objectID: number
        title: string
        artistDisplayName: string
        primaryImageSmall: string
    }

    const [metArtwork, setMetArtwork] = useState<Artwork[]>([]);

    const fetchArtwork = async () => {
        try {
            const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects');
            const artIdList = response.data.objectIDs;

            if (!artIdList || artIdList.length === 0) {
                console.log("No artwork IDs found.");
                return [];
            }

            const first12Ids = artIdList.slice(40, 50);

            // Fetch artwork details in parallel
            const artworkPromises = first12Ids.map((id: any) =>
                axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            );

            const artworkResponses = await Promise.all(artworkPromises);
            const artworks = artworkResponses.map((res) => res.data);

            console.log(artworks); // Full objects for first 12 artworks

            return artworks ?? []
        } catch (error) {
            console.error("Error fetching artwork:", error);
            return []
        }
    };

    useEffect(() => {
        const loadArt = async () => {
          setLoading(true); // start loading
          const artworks = await fetchArtwork();
          setMetArtwork(artworks);
          setLoading(false); // stop loading
        };
        loadArt();
      }, []);


    return (

        <View style={styles.mainContainer}>
           <SerachBar/>
           {loading ? (
  <View style={styles.loaderContainer}>
    <Text style={styles.loaderText}>Loading artwork...</Text>
    <ActivityIndicator size='large' color="#333" />
  </View>
) : (
  <ScrollView>
    <View style={styles.gallery}>
      {metArtwork.map((art) => (
        <View key={art.objectID}>
          <Text>{art.title}</Text>
          <Text>{art.artistDisplayName}</Text>
          <Image style={styles.image} source={{ uri: art.primaryImageSmall }} />
        </View>
      ))}
    </View>
  </ScrollView>
)}

        </View>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    searchContainer: {
        marginTop: 0,
        marginBottom: 5,
        height: 120,
        // backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        width: "100%",
        backgroundColor: "#fff",
        borderColor: 'grey',
        shadowColor: 'black',  // Shadow color (black here)
        shadowOffset: { width: 0, height: 2 },  // x: 0 (no horizontal offset), y: 10 (vertical offset)
        shadowOpacity: .3,  // Set shadow opacity (0-1 range)
        shadowRadius: 2,
    },
    searchBox: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 30,
        height: '40%',
        top: '13%',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: "#fff",
        shadowColor: "grey",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    image: {
        height: 100,
        width: 100
    },
    gallery:{
        // flex:1,
        // flexWrap:'wrap',
        // flexDirection:'row'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: 100,
      },
      loaderText: {
        fontSize: 18,
        color: '#444',
        marginBottom: 15,
      }
})