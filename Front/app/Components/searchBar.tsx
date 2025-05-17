import axios from "axios";
import { View, TextInput, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'expo-router';


export default function SearchBar() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [artistLinks, setArtistLinks] = useState<string[]>([]);
    const [artistName, setArtistName] = useState<string>("");
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false);

    const router = useRouter();


    type Artwork = {
        id: number;
        title: string;
        image_id: string;
        artist_titles: string;
    };

    const nextPage = () => {


    }

    useEffect(() => {
        if (!searchTriggered) return;
    
        const workByArtist = async (artistName: string) => {
            try {
                // Search for artworks by the artist name
                const response = await axios.get(
                    `https://api.artic.edu/api/v1/artworks/search`,
                    {
                        params: { q: artistName, 
                                page : 1    }
                    }
                );
                const artwork = response.data.data;
    
                // Check if any artworks were found
                if (!artwork || artwork.length === 0) {
                    console.warn("No artworks found for this artist.");
                    router.push({
                        pathname: "/Chicago/not-found",
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
    
                setArtworks(artworkDetails);
                console.log("Artwork Details:", artworkDetails);
    
                router.push({
                    pathname: "/Chicago/(artist)/[artist]",
                    params: {
                        artist: artistName,
                        artworks: JSON.stringify(artworkDetails.map(({ id, title, image_id, artist_titles }) => ({
                            id,
                            title,
                            image_id,
                            artist_titles,
                        })))
                    },
                });
                
            } catch (error) {
                console.error("Error fetching artwork details:", error);
                router.push("/Home");
            } finally {
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
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchBox}
                placeholder="e.g. 'Claude Monet'"
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
});
