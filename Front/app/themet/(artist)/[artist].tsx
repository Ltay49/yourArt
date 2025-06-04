import SearchBar from "@/app/Components/searchBarMet"
import SortBy from "@/app/Components/sortBy"
import { useRouter, useLocalSearchParams, usePathname, router } from "expo-router";
import { useState, useEffect, useContext, useRef } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, Button } from "react-native";
import axios from "axios";
import { useWindowDimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToCollection from "@/app/Functions/addToCollection";
import { UserContext } from "@/utils/UserContext";

export default function artistWork() {

    const scrollRef = useRef<ScrollView>(null);

    const {
        artist,
        artworks,
        total,
        limit,
        offset,
        total_pages,
        current_page,
        items,
        objectIDs } = useLocalSearchParams();

    const parsedArtworks = artworks ? JSON.parse(artworks as string) : [];

    const [loading, setLoading] = useState(false);


    const [artistWorks, setArtistWorks] = useState<Artwork[]>(parsedArtworks || [])
    const [totalItems, setTotalItems] = useState<number | null>(items ? parseInt(items as string) : null);
    const [currentPage, setCurrentPage] = useState(1)
    const [pageNumber, setPageNumber] = useState([0, 10])
    const parsedObjectIDs = objectIDs ? JSON.parse(objectIDs as string) : [];
    const [allObjectIDs, setAllObjectIDs] = useState<number[]>(parsedObjectIDs);

    const [currentIndex, setCurrentIndex] = useState(0);

    const totalPages = Math.ceil(Number(items || 0) / 25);

    const { width } = useWindowDimensions();
    const isWeb = width > 768;
    const { user } = useContext(UserContext);

    type Artwork = {
        id: number
        title: string
        artistDisplayName: string
        primaryImage: string
        url: string
    }

    console.log(items)
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

    const fetchArtworksByIDs = async (ids: number[], startIndex = 0, limit = 25) => {
        const artworks: Artwork[] = [];
        let i = startIndex;

        while (artworks.length < limit && i < ids.length) {
            const id = ids[i];
            try {
                const res = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                const data = res.data;

                if (data) {
                    artworks.push({
                        id: data.objectID,
                        title: data.title,
                        artistDisplayName: data.artistDisplayName,
                        primaryImage: data.primaryImage,
                        url: data.objectURL,
                    });
                }
            } catch (error) {
                console.warn(`Failed to fetch object ${id}`, error);
            }
            i++;
        }

        return artworks;
    };

    const handleNext = () => {
        if (currentIndex + 25 >= allObjectIDs.length || loading) return;
        scrollRef.current?.scrollTo({ y: 0, animated: false }); // Jump to top instantly
        setCurrentIndex(prev => prev + 25);
        setCurrentPage(prev => prev + 1);
      };
      
      const handlePrevious = () => {
        if (currentIndex === 0 || loading) return;
        scrollRef.current?.scrollTo({ y: 0, animated: false }); // Jump to top instantly
        setCurrentIndex(prev => prev - 25);
        setCurrentPage(prev => prev - 1);
      };
      
      useEffect(() => {
        if (currentIndex === 0 && parsedArtworks?.length > 0) return;
      
        const fetch = async () => {
          setLoading(true);
          const newArtworks = await fetchArtworksByIDs(allObjectIDs, currentIndex);
          setArtistWorks(newArtworks);
          setLoading(false);
        };
      
        fetch();
      }, [currentIndex]);
      

    return (
        <View style={styles.mainContainer}>
            <SearchBar />
            {loading && (
  <View style={styles.loadingOverlay}>
    <Text style={styles.loadingText}>
      Not long now, just fetching more results for '{artist}'
    </Text>
    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
  </View>
)}
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.gridContainer, isWeb && styles.gridContainerWeb]}>
                    {artistWorks.map((artwork: any, index: number) => (
                        <View style={[styles.card, isWeb && styles.cardWeb]} key={artwork.id}>
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
                                        await AsyncStorage.setItem("lastVisitedId", artwork.id.toString());
                                        router.push(`./themet/(artwork)/${artwork.id}`);
                                    }
                                    }>
                                    <Text style={styles.view}>
                                        View Here
                                    </Text>
                                    <View style={styles.underline}>
                                    </View>
                                </TouchableOpacity>
                                {(() => {
                                    const isAlreadyAdded = user?.collection?.some(
                                        (item) => item.artTitle === artwork.title
                                    );

                                    return (
                                        <AddToCollection
                                            collectionItem={{
                                                collection: "The Metropolitan Museum of Art",
                                                artTitle: artwork.title,
                                                artist: artwork.artist,
                                                imageUrl: artwork.image
                                            }}
                                            defaultRotated={isAlreadyAdded}
                                        />
                                    );
                                })()}
                            </View>
                        </View>
                    ))}
                    <View>
                    </View>
                </View>
                <View style={styles.row1}>
                    <Button
                        title="Previous"
                        onPress={handlePrevious}
                        disabled={currentIndex === 0 || loading}
                    />
                    <View style={styles.row}>
                        <Text style={styles.pageNumber}>
                            Page <Text style={styles.bold}>{currentPage}</Text> of <Text style={styles.bold}>{totalPages}</Text>
                        </Text>
                    </View>
                    <Button
                        title="Next"
                        onPress={handleNext}
                        disabled={currentIndex + 25 >= allObjectIDs.length || loading}
                    />
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
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: 'white'
    },
    gridContainerWeb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
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
    cardWeb: {
        width: '47%',
        margin: '1%',
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
    row1: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    pageNumber: {
        fontSize: 16,
        color: "#333",
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: "bold",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        padding: 20,
      },
      
      loadingText: {
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        fontStyle: "italic",
      }
})