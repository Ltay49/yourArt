import axios from "axios";
import { View, TextInput, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchBar() {
    const [searchPage, setSearchPage] = useState(1);
    const [artworks, setArtworks] = useState<any[]>([]);
    const [artistName, setArtistName] = useState<string>("");
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (!searchTriggered) return;

        const searchMetMuseum = async () => {
            try {
                const searchRes = await axios.get(
                    `https://collectionapi.metmuseum.org/public/collection/v1/search`,
                    { params: { q: artistName } }
                );

                const allObjectIDs: number[] = searchRes.data.objectIDs || [];
                console.log("All objectIDs from search:", allObjectIDs);

                if (allObjectIDs.length === 0) {
                    throw new Error("No object IDs found.");
                }

                // Try to gather up to 10 valid artworks with images
                const maxAttempts = 50;
                const desiredValid = 25;
                const validArtworks = [];

                for (let i = 0; i < maxAttempts && validArtworks.length < desiredValid; i++) {
                    const id = allObjectIDs[i];
                    if (!id) break;

                    try {
                        const res = await axios.get(
                            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
                        );
                        const data = res.data;

                        if (data) {
                            validArtworks.push({
                                id: data.objectID,
                                title: data.title,
                                artist: data.artistDisplayName,
                                date: data.objectDate,
                                image: data.primaryImage,
                                url: data.objectUrl

                            });
                        } else {
                            console.warn(`Skipping ID ${id} (no image)`);
                        }
                    } catch (err) {
                        console.warn(`Error fetching ID ${id}:`, err);
                    }
                }

                if (validArtworks.length === 0) {
                    console.warn("No valid artworks with images found.");
                    router.push({
                        pathname: "./TheMet/not-found",
                        params: { artist: artistName },
                    });
                    return;
                }

                await AsyncStorage.setItem("lastArtistResults", JSON.stringify(validArtworks));
                await AsyncStorage.setItem("lastArtist", artistName);
                await AsyncStorage.setItem("totalLastItems", JSON.stringify(allObjectIDs.length))

                setArtworks(validArtworks);
          
                router.push({
                    pathname: "/TheMet/(artist)/[artist]",
                    params: {
                        artist: artistName,
                        artworks: JSON.stringify(validArtworks),
                        items: JSON.stringify(allObjectIDs.length),
                    },
                });
            } catch (error) {
                console.error("Error fetching from Met Museum API:", error);
                router.push({
                    pathname: "./TheMet/not-found",
                    params: { artist: artistName },
                });
            } finally {
                setSearchTriggered(false);
            }
        };

        searchMetMuseum();
    }, [artistName, searchTriggered]);


    console.log(artworks)

    const handleSubmit = () => {
        if (artistName.trim()) {
            setArtworks([]); // optional: clear previous results
            setSearchTriggered(true);
        }
    };

    return (
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
    );
}

const styles = StyleSheet.create({
    searchContainer: {
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
});
