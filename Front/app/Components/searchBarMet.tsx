import axios from "axios";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";


export default function SearchBar() {
    const [searchPage, setSearchPage] = useState(1);
    const [artworks, setArtworks] = useState<any[]>([]);
    const [artistName, setArtistName] = useState<string>("");
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [processedCount, setProcessedCount] = useState(0)
    const [allObjectIDs, setAllObjectIDs] = useState<number[]>([]);



    const router = useRouter();

    useEffect(() => {
        if (!searchTriggered) return;

        const searchMetMuseum = async () => {
            try {
                setLoading(true);

                // 1. Search for all objectIDs based on the artist name
                const searchRes = await axios.get(
                    `https://collectionapi.metmuseum.org/public/collection/v1/search`,
                    { params: { q: artistName } }
                );

                const rawObjectIDs: number[] = searchRes.data.objectIDs || [];

                if (!rawObjectIDs.length) {
                    throw new Error("No object IDs found.");
                }

                // 2. Validate the objectIDs — remove ones with { message: "Not a valid object" }
                const validatedResults = await Promise.allSettled(
                    rawObjectIDs.map(id =>
                        axios
                            .get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                            .then(res => (!res.data.message ? id : null))
                            .catch(() => null)
                    )
                );

                const validObjectIDs = validatedResults
                    .filter(
                        (result): result is PromiseFulfilledResult<number> =>
                            result.status === "fulfilled" && result.value !== null
                    )
                    .map(result => result.value);

                if (!validObjectIDs.length) {
                    throw new Error("No valid object IDs found.");
                }

                // Use validObjectIDs directly — don't rely on state
                setAllObjectIDs(validObjectIDs); // This is still useful if other components depend on it

                const first25 = validObjectIDs.slice(0, 25);

                const artworkResponses = await Promise.all(
                    first25.map(id =>
                        axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                    )
                );

                const validArtworks = artworkResponses.map(res => {
                    const data = res.data;
                    return {
                        id: data.objectID,
                        title: data.title,
                        artist: data.artistDisplayName,
                        date: data.objectDate,
                        image: data.primaryImage,
                        url: data.objectUrl
                    };
                });

                if (validArtworks.length === 0) {
                    console.warn("No valid artworks with images found.");
                    router.push("./themet/not-found");
                    return;
                }

                // Persist results
                await AsyncStorage.setItem("lastArtistResults", JSON.stringify(validArtworks));
                await AsyncStorage.setItem("lastArtist", artistName);
                await AsyncStorage.setItem("totalLastItems", JSON.stringify(validObjectIDs.length));
                await AsyncStorage.setItem("allObjectIDs", JSON.stringify(validObjectIDs));

                setArtworks(validArtworks);

                router.push({
                    pathname: "/themet/(artist)/[artist]",
                    params: {
                        artist: artistName,
                        artworks: JSON.stringify(validArtworks),
                        items: JSON.stringify(validObjectIDs.length),
                        objectIDs: JSON.stringify(validObjectIDs),
                        date: validArtworks[0]?.date || "Unknown"
                    },
                });
            } catch (error) {
                router.push('/themet/not-found');
            } finally {
                setLoading(false);
                setSearchTriggered(false);
            }
        };

        searchMetMuseum();
    }, [artistName, searchTriggered]);

    const handleSubmit = () => {
        if (artistName.trim()) {
            setArtworks([]); // optional: clear previous results
            setSearchTriggered(true);
        }
    };

    return (
        <>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBox}
                    placeholder="Search artist (e.g. 'Van Gogh')"
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
        marginBottom: 5,
        height: 80,
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
        fontSize:16,
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
