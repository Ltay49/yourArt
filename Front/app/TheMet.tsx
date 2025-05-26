import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Button } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import React from 'react';
import SerachBar from "./Components/searchBarMet";
import { ActivityIndicator } from "react-native";
import AddToCollection from "./Functions/addToCollection";
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite'
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TheMetScreen() {

    const router = useRouter();
    const pathname = usePathname();

    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0)
    const [pageNumber, setPageNumber] = useState([0, 10])

    const [fontsLoaded] = useFonts({
        NunitoSans_900Black,
        NunitoSans_400Regular_Italic,
        NunitoSans_700Bold,
        SpecialElite_400Regular
    });

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
            const total = response.data.total

            setTotal(total)

            if (!artIdList || artIdList.length === 0) {
                console.log("No artwork IDs found.");
                return [];
            }

            const first12Ids = artIdList.slice(pageNumber[0], pageNumber[1]);

            // Fetch artwork details in parallel
            const artworkPromises = first12Ids.map((id: any) =>
                axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            );

            const artworkResponses = await Promise.all(artworkPromises);
            const artworks = artworkResponses.map((res) => res.data);

            return artworks ?? []
        } catch (error) {
            console.error("Error fetching artwork:", error);
            return []
        }
    };


    const nextPage = () => {
        setCurrentPage(currentPage + 1)
        setPageNumber([pageNumber[0] + 10, pageNumber[1] + 10])
    }
    const prevPage = () => {
        if (pageNumber[0] >= 10) {
            setCurrentPage(currentPage - 1)
            setPageNumber([pageNumber[0] - 10, pageNumber[1] - 10]);
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
    }, [pageNumber]);

    const totalPages = Math.ceil(total / 10);


    return (

        <View style={styles.mainContainer}>
            <SerachBar />
            {loading ? (
                <View style={styles.loaderContainer}>
                    <Text style={styles.loaderText}>Loading artwork...</Text>
                    <ActivityIndicator size='large' color="#333" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.gallery}>
                        {metArtwork.map((art) => (
                            <View style={styles.card} key={art.objectID}>
                                {art.primaryImageSmall ? (
                                    <Image
                                        style={styles.image}
                                        source={{ uri: art.primaryImageSmall }}
                                    />
                                ) : (
                                    <ImageBackground style={styles.noImageBox}>
                                        <Text style={styles.noImageText}>No image available</Text>
                                    </ImageBackground>
                                )}
                                <Text style={styles.title}>{art.title || "unknown"}</Text>
                                <Text style={styles.artist}>{art.artistDisplayName || "Unknown"}</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity
                                        onPress={async () => {
                                            await AsyncStorage.setItem("lastVisitedId", art.objectID.toString());

                                            router.push({
                                              pathname: "./TheMet/(artist)/[id]",
                                              params: {
                                                id: art.objectID,
                                              },
                                            });
                                        }}
                                    >
                                        <Text style={styles.view}>
                                            View Here
                                        </Text>
                                        <View style={styles.underline}>
                                        </View>
                                    </TouchableOpacity>
                                    <AddToCollection />
                                </View>
                            </View>
                        ))}
                    </View>
                    <View>
                        <View style={styles.row1}>
                            <Button onPress={prevPage}
                                title="Previous" />
                            <View style={styles.row}>
                                <Text style={styles.pageNumber}>
                                    Page <Text style={styles.bold}>{currentPage}</Text> of <Text style={styles.bold}>{totalPages}</Text>

                                </Text>
                            </View>
                            <Button onPress={nextPage}
                                title="Next" />

                        </View>
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
    scrollContent: {
        paddingBottom: 80,
    },
    card: {
        width: "95%",
        backgroundColor: "#f0f0f0",
        borderColor: 'grey',
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 250,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
    gallery: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center'
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
    },
    view: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    row1: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        flexShrink: 1,
    },
    artist: {
        fontSize: 14,
        color: "gray",
        flexShrink: 1,
    },
    underline: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        height: 2,
        backgroundColor: 'black',
        width: '100%'
    },
    noImageText: {
        top: '0%',
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
        borderWidth: 2,
        overflow: 'hidden',
        height: 300,
        borderRadius: 10,
        justifyContent: 'center',
        borderColor: 'grey'
    },
    pageNumber: {
        fontSize: 16,
        color: "#333",
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: "bold",
    },
})