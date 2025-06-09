import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Button } from "react-native";
import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import React from 'react';
import SerachBar from "./Components/searchBarMet";
import { ActivityIndicator } from "react-native";
import AddToCollection from "./Functions/addToCollection";
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite'
import { useRouter, usePathname } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@/utils/UserContext";
import { Picker } from '@react-native-picker/picker';


export default function TheMetScreen() {

    const router = useRouter();
    const pathname = usePathname();


    const [selectedArtist, setSelectedArtist] = useState('All');
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");


    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0)
    const [pageNumber, setPageNumber] = useState([0, 20])
    const { user } = useContext(UserContext)

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
        primaryImage: string
        classification: string
        artistBeginDate: string
    }
    const { width } = useWindowDimensions();
    const isWeb = width > 768;

    const [metArtwork, setMetArtwork] = useState<Artwork[]>([]);
    const artIdListRef = useRef<number[]>([]);

    const shuffleArray = (array: number[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const fetchInitialIDs = async () => {
        try {
            const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects');
            let ids = response.data.objectIDs?.slice(0, 1000); // Limit to 500
            if (!ids || ids.length === 0) {
                console.log("No artwork IDs found.");
                return;
            }

            ids = shuffleArray(ids); // Randomize the order
            artIdListRef.current = ids;
            setTotal(ids.length);
        } catch (error) {
            console.error("Error fetching object IDs:", error);
        }
    };



    const fetchArtworkDetails = async () => {
        try {
            const slice = artIdListRef.current.slice(pageNumber[0], pageNumber[1]);
            const artworkPromises = slice.map((id) =>
                axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            );
            const artworkResponses = await Promise.all(artworkPromises);
            return artworkResponses.map((res) => res.data);
        } catch (error) {
            console.error("Error fetching artwork details:", error);
            return [];
        }
    };



    const nextPage = () => {
        setSelectedArtist('All');
        setCurrentPage(currentPage + 1);
        setPageNumber([pageNumber[0] + 20, pageNumber[1] + 20]);
    };

    const prevPage = () => {
        if (pageNumber[0] >= 20) {
            setSelectedArtist('All');
            setCurrentPage(currentPage - 1);
            setPageNumber([pageNumber[0] - 20, pageNumber[1] - 20]);
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await fetchInitialIDs();
            const artworks = await fetchArtworkDetails();
            setMetArtwork(artworks);
            setLoading(false);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        console.log(metArtwork)
        const loadPage = async () => {
            if (artIdListRef.current.length === 0) return;
            setLoading(true);
            const artworks = await fetchArtworkDetails();
            setMetArtwork(artworks);
            setLoading(false);
        };
        loadPage();
    }, [pageNumber]);

    const totalPages = Math.ceil(total / 20);

    const uniqueArtists = ["All", ...Array.from(new Set(metArtwork.map(art => art.artistDisplayName || "Unknown"))).sort()];

    return (

        <View style={styles.mainContainer}>
            <SerachBar />
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Filter by Artist:</Text>
                    <Picker
                        selectedValue={selectedArtist}
                        onValueChange={(itemValue) => setSelectedArtist(itemValue)}
                        style={{ height: 50, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                    >
                        {uniqueArtists.map((artist, index) => (
                            <Picker.Item label={artist} value={artist} key={index} />
                        ))}
                    </Picker>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Sort by Start Date:</Text>
                    <Picker
                        selectedValue={sortOrder}
                        onValueChange={(value) => setSortOrder(value)}
                        style={{ height: 50, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                    >
                        <Picker.Item label="None" value="none" />
                        <Picker.Item label="Oldest to Newest" value="asc" />
                        <Picker.Item label="Newest to Oldest" value="desc" />
                    </Picker>
                </View>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <Text style={styles.loaderText}>Loading artwork...</Text>
                    <ActivityIndicator size='large' color="#333" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.gridContainer, isWeb && styles.gridContainerWeb]}>
                        {metArtwork
                            .filter(art => selectedArtist === "All" || art.artistDisplayName === selectedArtist)
                            .sort((a, b) => {
                                const dateA = parseInt(a.artistBeginDate) || 0;
                                const dateB = parseInt(b.artistBeginDate) || 0;

                                if (sortOrder === "asc") return dateA - dateB;
                                if (sortOrder === "desc") return dateB - dateA;
                                return 0; // no sort
                            })
                            .map((art) => {

                                const uniqueArtists = ["All", ...new Set(metArtwork.map(art => art.artistDisplayName || "Unknown"))];
                                const isAlreadyAdded = user?.collection?.some(
                                    (item) => item.artTitle === (art.title || "Untitled") && item.imageUrl === art.primaryImageSmall
                                );

                                return (
                                    <View key={art.objectID} style={[styles.card, isWeb && styles.cardWeb]}>

                                        {art.primaryImageSmall ? (
                                            <Image style={styles.image} source={{ uri: art.primaryImageSmall }} />
                                        ) : art.primaryImage ? (
                                            <Image style={styles.image} source={{ uri: art.primaryImage }} />
                                        ) : (
                                            <ImageBackground style={styles.noImageBox}>
                                                <Text style={styles.noImageText}>No image available</Text>
                                            </ImageBackground>
                                        )}

                                        <Text style={styles.title}>{art.title || "unknown"}</Text>
                                        <Text style={styles.artist}>{art.artistDisplayName || "Unknown"}</Text>
                                        <Text style={styles.artist}>Date: {art.artistBeginDate || "Unknown"}</Text>
                                        <View style={styles.row}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await AsyncStorage.setItem("lastVisitedId", art.objectID.toString());

                                                    router.push({
                                                        pathname: "/themet/(artwork)/[id]",
                                                        params: { id: art.objectID },
                                                    });
                                                }}
                                            >
                                                <Text style={styles.view}>View Here</Text>
                                                <View style={styles.underline} />
                                            </TouchableOpacity>

                                            <AddToCollection
                                                collectionItem={{
                                                    collection: "The Metropolitan Museum of Art",
                                                    artTitle: art.title || "Untitled",
                                                    artist: art.artistDisplayName || "Unknown Artist",
                                                    imageUrl: art.primaryImageSmall || art.primaryImage || "https://example.com/no-image.png",
                                                }}
                                                defaultRotated={isAlreadyAdded}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
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
    cardWeb: {
        width: '31%',
        margin: '1%',
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
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
        top: '10%',
        height: '40%',
        width: '80%',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 35,
        fontFamily: 'SpecialElite_400Regular',
        color: "brown",
        // transform: [{ rotate: '-45deg' }],
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