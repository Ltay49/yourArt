import SearchBar from "@/app/Components/searchBarMet"
import SortBy from "@/app/Components/sortBy"
import { useRouter, useLocalSearchParams, usePathname, router } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToCollection from "@/app/Functions/addToCollection";


export default function artistWork() {


    const { artist
        , artworks, total, limit, offset, total_pages, current_page, items } = useLocalSearchParams();

    const parsedArtworks = artworks ? JSON.parse(artworks as string) : [];

    const [artistWorks, setArtistWorks] = useState<Artwork[]>(parsedArtworks || [])
    const [totalItems, setTotalItems] = useState<number | null>(items ? parseInt(items as string) : null);


    type Artwork = {
        id: number
        title: string
        artistDisplayName: string
        primaryImage: string
        url: string
    }

    useEffect(() => {
        if (!artistWorks.length) {
            (async () => {
                const saved = await AsyncStorage.getItem("lastArtistResults");
                const savedArtist = await AsyncStorage.getItem("lastArtist");
                const savedTotalItems = await AsyncStorage.getItem("totalLastItems");
                if (saved && savedArtist && savedTotalItems) {
                    setArtistWorks(JSON.parse(saved));
                    setTotalItems(JSON.parse(savedTotalItems));
                }
            })();
        }
    }, []);

    useEffect(() => {
        // Normalize artist param to string
        const artistStr = Array.isArray(artist) ? artist[0] : artist;

        if (artistStr && /^\d+$/.test(artistStr)) {
            router.replace(`/TheMet/(artwork)/${artistStr}`);
        }
    }, [artist]);

    console.log(parsedArtworks)

    console.log(artist)

    return (
        <View style={styles.mainContainer}>
            <SearchBar />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.gallery}>
                <Text>{totalItems ?? items}</Text>
                    <Text>results found for:</Text>
                    <Text>{artist}</Text>
                    {artistWorks.map((artwork: any, index: number) => (
                        <View style={styles.card} key={artwork.id}>
                            <Image
                                style={styles.image}
                                source={{ uri: artwork?.image || "https://example.com/no-image.png" }}
                            />
                            <Text style={styles.title}>{artwork.title}</Text>
                            <Text style={styles.date}>{artwork.date}</Text>
                            <Text style={styles.artist}>{artwork.artist}</Text>
                            <View style={styles.row}>
                            <TouchableOpacity
                                onPress={async () => {
                                    console.log(artwork.objectID)
                                    await AsyncStorage.setItem("lastVisitedId", artwork.id);

                                    router.push(`/TheMet/(artwork)/${artwork.id}`);
                                }
                                }>
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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    gallery: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    scrollContent: {
        paddingBottom: 80,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
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
    date: {
        fontSize: 14,
        color: "black",
        flexShrink: 1,
    },
    view: {
        fontSize: 16,
        fontWeight: 'bold',
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
})