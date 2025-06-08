import SearchBar from "@/app/Components/searchBarMet"
import SortByMet from "@/app/Components/sortByMet"
import { useRouter, useLocalSearchParams, usePathname, router } from "expo-router";
import { useState, useEffect, useContext, useRef } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, Button } from "react-native";
import axios from "axios";
import { useWindowDimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToCollection from "@/app/Functions/addToCollection";
import { UserContext } from "@/utils/UserContext";
import { SpecialElite_400Regular,useFonts } from '@expo-google-fonts/special-elite'


export default function artistWork() {

    const scrollRef = useRef<ScrollView>(null);

    const [fontsLoaded] = useFonts({
        SpecialElite_400Regular
    });


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
    const [sortOption, setSortOption] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const [artistWorks, setArtistWorks] = useState<Artwork[]>(parsedArtworks || [])
    console.log(artistWorks)
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
        artist: string
        image: string
        date: number
        url: string
    }

    useEffect(() => {
        if (allObjectIDs.length > 0) {
            AsyncStorage.setItem("lastArtistObjectIDs", JSON.stringify(allObjectIDs));
        }
    }, [allObjectIDs]);


    useEffect(() => {
        (async () => {
            if (!artistWorks.length) {
                const saved = await AsyncStorage.getItem("lastArtistResults");
                const savedArtist = await AsyncStorage.getItem("lastArtist");
                const savedTotalItems = await AsyncStorage.getItem("totalLastItems");
                const savedIndex = await AsyncStorage.getItem("lastArtistIndex");
                const savedPage = await AsyncStorage.getItem("lastArtistPage");
                const savedObjectIDs = await AsyncStorage.getItem("lastArtistObjectIDs"); // NEW

                if (saved && savedArtist && savedTotalItems) {
                    setArtistWorks(JSON.parse(saved));
                    setTotalItems(JSON.parse(savedTotalItems));

                    if (savedIndex) setCurrentIndex(parseInt(savedIndex));
                    if (savedPage) setCurrentPage(parseInt(savedPage));
                    if (savedObjectIDs) setAllObjectIDs(JSON.parse(savedObjectIDs)); // NEW
                }
            }
        })();
    }, []);

    useEffect(() => {
        const artistStr = Array.isArray(artist) ? artist[0] : artist;

        if (artistStr && /^\d+$/.test(artistStr)) {
            // Delay navigation until after mount
            const timeout = setTimeout(() => {
                router.replace(`/themet/(artwork)/${artistStr}`);
            }, 0); // Can also use 100ms if needed

            return () => clearTimeout(timeout);
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
                console.log(data)

                if (data) {
                    artworks.push({
                        id: data.objectID,
                        title: data.title,
                        date: data.objectDate,
                        artist: data.artistDisplayName,
                        image: data.primaryImage,
                        url: data.objectURL,
                    });
                    console.log(`Artwork ${data.objectID}:`, data.primaryImage);

                }
            } catch (error) {
                console.warn(`Failed to fetch object ${id}`, error);
            }
            i++;
        }

        return artworks;
    };

    const handleNext = async () => {
        if (totalItems === null || currentIndex + 25 >= totalItems || loading) return;

        scrollRef.current?.scrollTo({ y: 0, animated: false });

        const newIndex = currentIndex + 25;
        const newPage = currentPage + 1;
        setCurrentIndex(newIndex);
        setCurrentPage(newPage);

        await AsyncStorage.setItem("lastArtistIndex", newIndex.toString());
        await AsyncStorage.setItem("lastArtistPage", newPage.toString());
    };

    const handlePrevious = async () => {
        if (currentIndex === 0 || loading) return;
        scrollRef.current?.scrollTo({ y: 0, animated: false });

        const newIndex = currentIndex - 25;
        const newPage = currentPage - 1;
        setCurrentIndex(newIndex);
        setCurrentPage(newPage);

        await AsyncStorage.setItem("lastArtistIndex", newIndex.toString());
        await AsyncStorage.setItem("lastArtistPage", newPage.toString());
    };


    useEffect(() => {
        const fetch = async () => {
          setLoading(true);
          const newArtworks = await fetchArtworksByIDs(allObjectIDs, currentIndex);
          setArtistWorks(newArtworks);
          setLoading(false);
        };
      
        fetch();
      }, [currentIndex]);
      
    const sortAndSetArtistWorks = (artworks: Artwork[], sortKey: string | null) => {
        if (!sortKey) {
            setArtistWorks(artworks);
            return;
        }

        const sorted = [...artworks];

        switch (sortKey) {
            case 'year_asc':
                sorted.sort((a, b) => (a.date ?? 0) - (b.date ?? 0));
                break;
            case 'year_desc':
                sorted.sort((a, b) => (b.date ?? 0) - (a.date ?? 0));
                break;
            case 'alpha_asc':
                sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'alpha_desc':
                sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                break;
            default:
                break;
        }

        setArtistWorks(sorted);

    };

    return (
        <View style={styles.mainContainer}>
            <SearchBar />
            <SortByMet
                onSort={(sortKey) => {
                    setSortOption(sortKey);
                    sortAndSetArtistWorks(artistWorks, sortKey);
                }}
                activeSort={sortOption}
            />
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
                            {artwork.image ? (
                                <Image style={styles.image} source={{ uri: artwork.image }} />
                            ) : (
                                <View style={styles.noImageBox}>
                                    <Text style={styles.noImageText}>No image available</Text>
                                </View>
                            )}
                            <Text style={styles.title}>{artwork.title}</Text>
                            <Text style={styles.date}>{artwork.date}</Text>
                            <Text style={styles.artist}>{artwork.artist}</Text>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        console.log(artwork.objectID);
                                        await AsyncStorage.setItem("lastVisitedId", artwork.id.toString());
                                        router.push(`/themet/(artwork)/${artwork.id}`);
                                    }}
                                >
                                    <Text style={styles.view}>View Here</Text>
                                    <View style={styles.underline}></View>
                                </TouchableOpacity>

                                {(() => {
                                    const isAlreadyAdded = user?.collection?.some(
                                        (item) => item.artTitle === artwork.title && item.imageUrl === artwork.image
                                    );

                                    return (
                                        <AddToCollection
                                            collectionItem={{
                                                collection: "The Metropolitan Museum of Art",
                                                artTitle: artwork.title,
                                                artist: artwork.artist,
                                                imageUrl: artwork.image || "https://example.com/no-image.png",
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
                            Page <Text style={styles.bold}>{currentPage}</Text> of{" "}
                            <Text style={styles.bold}>
                                {totalPages || (totalItems ? Math.ceil(totalItems / 25) : "?")}
                            </Text>
                        </Text>

                    </View>
                    <Button
                        title="Next"
                        onPress={handleNext}
                        disabled={totalItems === null || currentIndex + 25 >= totalItems || loading}
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
        width: '31%',
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
})