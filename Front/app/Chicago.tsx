import { Text, StyleSheet, View, ScrollView, Image, TextInput, Button, TouchableOpacity } from "react-native"
import axios from "axios"
import React, { useEffect, useState, useRef, useContext } from "react";
import { ActivityIndicator } from "react-native";
import { useRouter, usePathname } from 'expo-router';
import AddToCollection from "./Functions/addToCollection";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import SerachBar from "./Components/searchBarChicago";
import { SpecialElite_400Regular, useFonts } from '@expo-google-fonts/special-elite'
import { useWindowDimensions } from 'react-native';
import { UserContext } from '../utils/UserContext'

// Add to collection - POST request 


export default function Chicago() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<ScrollView>(null);

    const [fontsLoaded] = useFonts({
        SpecialElite_400Regular
    });

    const { user } = useContext(UserContext);

    type Artwork = {
        id: number;
        title: string;
        image_id: string;
        artist_titles: string
    };


    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [totalPages, setToatlPages] = useState<string | null>(null);
    const { width } = useWindowDimensions();

    const isWeb = width > 768;

    const fetchArtwork = async (url?: string) => {
        setLoading(true);

        try {
            // If no URL is passed, try loading the last saved URL
            if (!url) {
                const storedUrl = await AsyncStorage.getItem("lastArtworkUrl");
                url = storedUrl || "https://api.artic.edu/api/v1/artworks?page=1";
            } else {
                // Save current URL to storage
                await AsyncStorage.setItem("lastArtworkUrl", url);
            }

            const response = await axios.get(url);
            const newArtworks = response.data.data;
            const pagination = response.data.pagination;

            setArtworks(newArtworks);
            setNextUrl(pagination.next_url || null);
            setPrevUrl(pagination.prev_url || null);
            setCurrentPage(pagination.current_page || null);
            setToatlPages(pagination.total_pages || null);
        } catch (error) {
            console.error("Error fetching artwork:", error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }, 100);
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            // Detect if the user came from a different route
            if (pathname === "/chicago") {
                AsyncStorage.getItem("lastVisitedId").then((id) => {
                    if (!id) {
                        // If not returning from a detail page, reset to page 1
                        fetchArtwork("https://api.artic.edu/api/v1/artworks?page=1");
                    } else {
                        // Returning from detail page — use saved page
                        fetchArtwork();
                        AsyncStorage.removeItem("lastVisitedId"); // clear after use
                    }
                });
            }
        }, [pathname])
    );


    return (
        <View style={styles.mainContainer}>
            <SerachBar />
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#333" />
                    <Text>Loading artworks...</Text>
                </View>
            ) : (
                <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.gridContainer, isWeb && styles.gridContainerWeb]}>
                        {artworks.map((artwork) => {
                            const imageUrl = artwork?.image_id
                                ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
                                : "";

                            const artTitle = artwork?.title || "Untitled";

                            const isAlreadyAdded = user?.collection?.some(
                                (item) => item.artTitle === artTitle
                            );

                            return (
                                <View key={artwork.id} style={[styles.card, isWeb && styles.cardWeb]}>
                                    {artwork.image_id ? (
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={styles.image}
                                        />
                                    ) : (
                                        <View style={styles.noImageBox}>
                                            <Text style={styles.noImageText}>No image available</Text>
                                        </View>
                                    )}
                                    <Text style={styles.title}>{artwork.title}</Text>
                                    <Text style={styles.artist}>{artwork.artist_titles}</Text>
                                    <View style={styles.row}>
                                        <View style={{ alignSelf: 'flex-start' }}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await AsyncStorage.setItem("lastVisitedId", artwork.id.toString());
                                                    router.push(`/Chicago/(artwork)/${artwork.id}`);
                                                }}
                                            >
                                                <Text style={styles.view}>View Here</Text>
                                            </TouchableOpacity>
                                            <View style={styles.underline} />
                                        </View>
                                        <AddToCollection
                                            collectionItem={{
                                                collection: "The Art Institute of Chicago",
                                                artTitle,
                                                artist: artwork?.artist_titles[0] || "Unknown Artist",
                                                imageUrl,
                                            }}
                                            defaultRotated={isAlreadyAdded}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.row1}>
                        {prevUrl && (
                            <Button
                                title="Previous"
                                onPress={() => fetchArtwork(prevUrl)}
                            />)}
                        <View style={styles.row}>
                            <Text style={styles.pageNumber}>
                                Page <Text style={styles.bold}>{currentPage}</Text> of <Text style={styles.bold}>{totalPages}</Text>
                            </Text>
                        </View>

                        <Button title="Next" onPress={() => {
                            if (nextUrl) fetchArtwork(nextUrl);
                        }} disabled={!nextUrl} />
                    </View>
                </ScrollView>
            )}
        </View>
    );
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
    searchText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    scrollContent: {
        paddingBottom: 80,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    gridContainerWeb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    card: {
        width: "95%",
        // borderRightWidth:2,
        // borderBottomWidth:2,
        backgroundColor: "#f0f0f0",
        borderColor: 'grey',
        borderRadius: 20,
        padding: 10,
        // marginLeft: 10,
        // marginRight:10,
        marginBottom: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 250, // ensure there's enough space
    },
    cardWeb: {
        width: '31%',
        margin: '1%',
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
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
    collect: {
        color: 'brown',
        fontWeight: 'bold',
        fontSize: 16,
    },
    view: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    underline: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -2, // adjust this to offset the line
        height: 2,
        backgroundColor: 'black',
        width: '100%'
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    pageNumber: {
        fontSize: 16,
        color: "#333",
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: "bold",
    },
    noImageText: {
        textAlign: 'center',
        fontSize: 50,
        fontFamily: 'SpecialElite_400Regular',
        color: "brown",
        transform: [{ rotate: '-45deg' }]
    },
    noImageBox: {
        height: 300,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        borderColor: 'grey'
    }
})