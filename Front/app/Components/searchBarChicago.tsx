import axios from "axios";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'expo-router';
import { ActivityIndicator } from "react-native";



export default function SearchBar() {

    const [searchPage, setSearchPage] = useState(1)
    const [pagination, setPagination] = useState<Page>({
        total: 0,
        limit: 0,
        offset: 0,
        total_pages: 0,
        current_page: 0,
    });
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [artistLinks, setArtistLinks] = useState<string[]>([]);
    const [artistName, setArtistName] = useState<string>("");
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    type Page = {
        total: number,
        limit: number,
        offset: number
        total_pages: number,
        current_page: number
    }

    type Artwork = {
        id: number;
        title: string;
        image_id: string;
        artist_titles: string;
        date_start: number
    };

    useEffect(() => {
        if (!searchTriggered) return;

        const workByArtist = async (artistName: string) => {
            try {

                setLoading(true);
                const response = await axios.get(
                    `https://api.artic.edu/api/v1/artworks/search`,
                    {
                        params: {
                            q: artistName,
                            page: searchPage,
                            limit: 25
                        }
                    }
                );
                const artwork = response.data.data;
                const paginationData = response.data.pagination
                setPagination(paginationData)

                if (!artwork || artwork.length === 0) {
                    console.warn("No artworks found for this artist.");
                    router.push({
                        pathname: "/chicago/not-found",
                        params: { artist: artistName },
                    });
                    return;
                }

                // Extract artwork IDs for detailed data fetching
                const artworkIds = artwork.map((art: any) => art.id);

                const artworkDetails = await Promise.all(
                    artworkIds.map(async (id: number) => {
                        const res = await axios.get(
                            `https://api.artic.edu/api/v1/artworks/${id}`
                        );
                        return res.data.data;
                    })
                );

                console.log(artworkDetails)
                setArtworks(artworkDetails);
                console.log(paginationData)
                // Extract pagination properties from the response data
                const { total, limit, offset, total_pages, current_page } = paginationData;

                router.push({
                    pathname: "/chicago/(artist)/[artist]",
                    params: {
                        artist: artistName,
                        artworks: JSON.stringify(
                            artworkDetails.map(({ id, title, image_id, artist_titles, date_start }) => ({
                                id,
                                title,
                                image_id,
                                artist_titles,
                                date_start
                            }))
                        ),
                        total: total.toString(),
                        limit: limit.toString(),
                        offset: offset.toString(),
                        total_pages: total_pages.toString(),
                        current_page: current_page.toString(),
                    },
                });
            } catch (error) {
                console.error("Error fetching artwork details:", error);
                router.push("/Home");
            } finally {
                setLoading(false);
                setSearchTriggered(false);
            }
        };

        workByArtist(artistName);
    }, [artistName, searchTriggered]);


    const handleSubmit = () => {
        if (artistName.trim()) {
            setSearchTriggered(true);
        }
    };

    return (
        <>
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchBox}
                placeholder="e.g. 'Monet' / 'Gogh' for best results "
                placeholderTextColor="rgba(0,0,0,.5)"
                returnKeyType="search"
                value={artistName}
                onChangeText={setArtistName}
                onSubmitEditing={handleSubmit}
            />
        </View>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <Text style={styles.loadingText}>
                        Not long now, just fetching results for '{artistName}'
                    </Text>
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                </View>
            )}
            </>
    );
}

const styles = StyleSheet.create({
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
        shadowOpacity: 0.3,
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
