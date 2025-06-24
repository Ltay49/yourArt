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
import { Picker } from '@react-native-picker/picker';


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
        date_start: string
        artist_titles: string[];
    };


    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<string | null>(null);
    const [totalPages, setToatlPages] = useState<string | null>(null);
    const { width } = useWindowDimensions();

    const [selectedArtist, setSelectedArtist] = useState<string>('All');
    const [availableArtists, setAvailableArtists] = useState<string[]>([]);

    const filteredArtworks = (selectedArtist === 'All'
        ? artworks
        : artworks.filter((a) => a.artist_titles.includes(selectedArtist))
    ).sort((a, b) => {
        const aDate = parseInt(a.date_start);
        const bDate = parseInt(b.date_start);

        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    });



    const isWeb = width > 768;

    const fetchArtwork = async (url?: string) => {
        setLoading(true);

        try {
            if (!url) {
                const storedUrl = await AsyncStorage.getItem("lastArtworkUrl");
                url = storedUrl || "https://api.artic.edu/api/v1/artworks?page=1";
            } else {
                await AsyncStorage.setItem("lastArtworkUrl", url);
            }

            const response = await axios.get<{
                data: Artwork[];
                pagination: {
                    next_url: string | null;
                    prev_url: string | null;
                    current_page: string;
                    total_pages: string;
                };
            }>(url);
            const newArtworks = response.data.data;
            const pagination = response.data.pagination;

            setArtworks(newArtworks);

            const artists = Array.from(
                new Set(
                    newArtworks.flatMap((a) => a.artist_titles).filter((name): name is string => typeof name === 'string')
                )
            );
            setAvailableArtists(['All', ...artists]);
            setSelectedArtist('All')
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
            if (pathname === "/chicago") {
                AsyncStorage.getItem("lastVisitedId").then((id) => {
                    if (id) {
                        fetchArtwork();
                        AsyncStorage.removeItem("lastVisitedId");
                    } else {
                        AsyncStorage.getItem("lastArtworkUrl").then((storedUrl) => {
                            fetchArtwork(storedUrl || "https://api.artic.edu/api/v1/artworks?page=1");
                        });
                    }
                });
            }
            if (pathname === "/Home") {
                fetchArtwork("https://api.artic.edu/api/v1/artworks?page=1");
            }
        }, [pathname])
    );



    return (
        <View style={styles.mainContainer}>
            <SerachBar />
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, gap: 20, justifyContent:'center' }}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Filter by Artist:</Text>
                    <Picker
                        selectedValue={selectedArtist}
                        onValueChange={(itemValue) => setSelectedArtist(itemValue)}
                        style={{ height: 32, width: 180 }}
                    >
                        {availableArtists.map((artist, index) => (
                            <Picker.Item key={index} label={artist} value={artist} />
                        ))}
                    </Picker>
                </View>

                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 0 }}>Sort by Date:</Text>
                    <Button
                        title={sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                        onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    />
                </View>
            </View>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#333" />
                    <Text>Loading artworks...</Text>
                </View>
            ) : (
                <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.gridContainer, isWeb && styles.gridContainerWeb]}>
                        {filteredArtworks.map((artwork) => {
                            const imageUrl = artwork?.image_id
                                ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/!843,843/0/default.jpg `
                                : "";

                            const artTitle = artwork?.title || "Untitled";

                            const isAlreadyAdded = user?.collection?.some(
                                (item) => item.artTitle === artTitle && `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg` === item.imageUrl
                            );

                            return (
                                <View key={artwork.id} style={[styles.card, isWeb && styles.cardWeb]}>
                                    {artwork.image_id ? (
                                        <View style={{ position: 'relative', width: '100%', height: 300 }}>
                                            <ActivityIndicator
                                                style={StyleSheet.absoluteFill}
                                                size="large"
                                                color="#888"
                                            />

                                            <Image
                                                source={{ uri: imageUrl }}
                                                style={styles.image}
                                                onLoadStart={() => console.log("Image loading...")}
                                                onLoadEnd={() => console.log("Image loaded")}
                                            />
                                        </View>
                                    ) : (
                                        <View style={styles.noImageBox}>
                                            <Text style={styles.noImageText}>No image available</Text>
                                        </View>
                                    )}

                                    <Text style={styles.title}>{artwork.title}</Text>
                                    <Text style={styles.artist}>{artwork.artist_titles.join(', ')}</Text>
                                    <Text style={styles.date}>Date: {artwork.date_start}</Text>
                                    <View style={styles.row}>
                                        <View style={{ alignSelf: 'flex-start' }}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await AsyncStorage.setItem("lastVisitedId", artwork.id.toString());
                                                    router.push(`/chicago/(artwork)/${artwork.id}`);
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
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        width: "100%",
        backgroundColor: "#fff",
        borderColor: 'grey',
        shadowColor: 'black', 
        shadowOffset: { width: 0, height: 2 },  
        shadowOpacity: .3, 
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
        bottom: -2,
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
        fontSize: 40,
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
    },
    date: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
})