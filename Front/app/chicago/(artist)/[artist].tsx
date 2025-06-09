import { Text, View, StyleSheet, ScrollView, Image, Button, TouchableOpacity, useWindowDimensions, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, usePathname } from "expo-router";
import SearchBar from "../../Components/searchBarChicago";
import { useState, useEffect, useRef} from "react";
import axios from "axios";
import SortBy from "../../Components/sortBy";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToCollection from "@/app/Functions/addToCollection";
import { useContext } from "react";
import { UserContext } from "@/utils/UserContext";


export default function ArtistSearch() {
    const { artist, artworks, total, limit, offset, total_pages, current_page } = useLocalSearchParams();
    const [sortOption, setSortOption] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const scrollRef = useRef<ScrollView>(null);

    const { user } = useContext(UserContext);

    const router = useRouter();
    const pathname = usePathname();

    const parsedArtworks = artworks ? JSON.parse(artworks as string) : [];
    const [artistWorks, setArtistWorks] = useState<Artwork[]>(parsedArtworks || []);
    const [searchPage, setSearchPage] = useState(Number(current_page) || 1);
    const [currentPage, setCurrentPage] = useState(1)
    const { width } = useWindowDimensions();
    const [totalPages, setTotalPages] =  useState(Number(total_pages))
    const isWeb = width > 768;

    type Artwork = {
        id: number;
        image_url: string;
        title: string;
        date_start: number
    }

    const fetchArtwork = async (page: number) => {
        try {
            setLoading(true)
            const response = await axios.get(
                `https://api.artic.edu/api/v1/artworks/search`,
                {
                    params: {
                        q: artist,
                        page,
                        limit: Number(limit) || 25,
                    }
                }
            );

            const pagination = response.data.pagination


            const newArtworks = await Promise.all(
                response.data.data.map(async (art: any) => {
                    const detail = await axios.get(`https://api.artic.edu/api/v1/artworks/${art.id}`);
                    return detail.data.data;
                })
            );
            setCurrentPage(pagination.current_page)
            sortAndSetArtistWorks(newArtworks, sortOption);
            setSearchPage(page);
        } catch (error) {
            console.error("Error fetching artwork:", error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: 0, animated: false });
            }, 100);
        }
    }        


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return; 
        const artistStr = Array.isArray(artist) ? artist[0] : artist;

        if (artistStr && /^\d+$/.test(artistStr)) {
            router.replace(`/chicago/(artwork)/${artistStr}`);
        }
    }, [artist, mounted]);

    useEffect(() => {
        const saveArtistWorks = async () => {
            try {
                await AsyncStorage.setItem('savedPage', JSON.stringify(currentPage))
                await AsyncStorage.setItem('total_pages', JSON.stringify(totalPages))
                await AsyncStorage.setItem('artistWorks', JSON.stringify(artistWorks));
                await AsyncStorage.setItem('savedSearch', JSON.stringify(searchPage));
                if (artist) {
                    const artistStr = Array.isArray(artist) ? artist[0] : artist;
                    await AsyncStorage.setItem('lastArtist', artistStr);
                }
            } catch (e) {
                console.error("Failed to save artist works:", e);
            }
        };

        if (artistWorks.length > 0) {
            saveArtistWorks();
        }
    }, [artistWorks, artist]);

    useEffect(() => {
        const loadSavedArtistWorks = async () => {
            try {
                if (!artworks) {
                    const savedWorks = await AsyncStorage.getItem('artistWorks');
                    const savedArtist = await AsyncStorage.getItem('lastArtist');
                    const savedTotal = await AsyncStorage.getItem('total_pages');
                    const savedSearch = await AsyncStorage.getItem('savedSearch')
                    const savedPage = await AsyncStorage.getItem('savedPage')
                    if (savedWorks) {
                        setArtistWorks(JSON.parse(savedWorks));
                        setTotalPages(savedTotal ? JSON.parse(savedTotal) : 1);
                        setSearchPage(savedSearch ? JSON.parse(savedSearch) : 1)
                        setCurrentPage(savedPage ? JSON.parse(savedPage) : 1)
                    }

                    if (savedArtist) {
                        console.log("Loaded saved artist:", savedArtist);
                    }
                }
            } catch (e) {
                console.error("Failed to load saved artist works:", e);
            }
        };

        loadSavedArtistWorks();
    }, []);

    const sortAndSetArtistWorks = (artworks: Artwork[], sortKey: string | null) => {
        if (!sortKey) {
            setArtistWorks(artworks);
            return;
        }

        const sorted = [...artworks];

        switch (sortKey) {
            case 'year_asc':
                sorted.sort((a, b) => (a.date_start ?? 0) - (b.date_start ?? 0));
                break;
            case 'year_desc':
                sorted.sort((a, b) => (b.date_start ?? 0) - (a.date_start ?? 0));
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
        <>
            <SearchBar />
            <SortBy
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
           <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.gridContainer, isWeb && styles.gridContainerWeb]}>
                    {artistWorks.length > 0 ? (
                        artistWorks.map((artwork: any, index: number) => {
                            const isAlreadyAdded = user?.collection?.some(
                                (item) => item.artTitle === artwork.title && `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg` === item.imageUrl
                            );
                            return (
                                <View key={index} style={[styles.card, isWeb && styles.cardWeb]}>
                                    {artwork.image_id ? (
                                        <Image
                                            source={{
                                                uri: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
                                            }}
                                            style={styles.image}
                                        />
                                    ) : (
                                        <View style={styles.noImageBox}>
                                            <Text style={styles.noImageText}>No image available</Text>
                                        </View>
                                    )}
                                    <Text style={styles.title}>{artwork.artist_titles}</Text>
                                    <Text style={styles.artist}>{artwork.title}</Text>
                                    <Text>{artwork.date_start}</Text>
                                    <View style={styles.row}>
                                        <View style={{ alignSelf: 'flex-start' }}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    await AsyncStorage.setItem("lastVisitedId", artwork.id.toString());
                                                    router.push(`/chicago/(artwork)/${artwork.id}`);
                                                }}
                                            >
                                                <Text style={styles.view}>
                                                    View Here
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={styles.underline} />
                                        </View>
                                        <AddToCollection
                                            collectionItem={{
                                                collection: "The Art Institute of Chicago",
                                                artTitle: artwork?.title || "Untitled",
                                                artist: artwork?.artist_titles[0] || "Unknown Artist",
                                                imageUrl: artwork?.image_id
                                                    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
                                                    : ""
                                            }}
                                            defaultRotated={isAlreadyAdded}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <Text>No artworks found.</Text>
                    )}


                </View>
                <View style={styles.row1}>
                    <Button
                        title="Previous"
                        disabled={searchPage <= 1}
                        onPress={() => fetchArtwork(searchPage - 1)}
                    />
                    <View style={styles.row}>
                        <Text style={styles.pageNumber}>
                            Page <Text style={styles.bold}>{currentPage}</Text> of <Text style={styles.bold}>{totalPages}</Text>
                        </Text>
                    </View>
                    <Button
                        title="Next"
                        disabled={searchPage >= Number(totalPages)}
                        onPress={() => fetchArtwork(searchPage + 1)}
                    />
                </View>
            </ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 80,
        padding: 0,
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
    artist: {
        fontSize: 14,
        color: "gray",
        flexShrink: 1,
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
});
