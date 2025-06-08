import { Text, View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from "react-native"
import axios, { Axios } from "axios";
import { useEffect, useState} from "react";
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { useRouter } from 'expo-router';
import React from 'react';

type SuggestionsProps = {
    artist: string;
};

export default function Suggestions({ artist }: SuggestionsProps) {

    console.log(artist)

    const router = useRouter();
    const { width } = useWindowDimensions();
    const isWeb = width > 768;

    const [fontsLoaded] = useFonts({
        NunitoSans_900Black,
        NunitoSans_400Regular_Italic,
        NunitoSans_700Bold
    });

    type Artwork = {
        id: number;
        title: string;
        image_id: string;
        artist_titles: string
    };

    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [artistLinks, setArtistLinks] = useState<string[]>([]);

    const fetchMoreWorks = async () => {
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(artist)}`);
            const data = response.data.data;

            const artistLinks = data.map((art: any) => art.api_link);

            setArtistLinks(artistLinks); // assuming this is state you're using

            // Fetch each artwork's full details
            const artworkDetails = await Promise.all(
                artistLinks.map(async (link: any) => {
                    const res = await axios.get(link);
                    return res.data.data; // or res.data depending on the structure
                })
            );

            const filteredArtworks = artworkDetails.filter(a => 
                a.artist_titles && a.artist_titles.includes(artist[0])
            );
            
            setArtworks(filteredArtworks);
            // assuming you want full artwork objects now

        } catch (error) {
            console.error('Error fetching artist links or artwork details:', error);
        }
    };


    useEffect(() => {
        fetchMoreWorks();
    }, []);

    console.log(artworks)

    return (
        <View style={[styles.gallery, isWeb && styles.galleryWeb]}>
            {artworks.map((art) => (
                <View key={art.id} style={styles.gallery}>
                    <View style={[styles.card, isWeb && styles.cardWeb ]}>
                        <Image
                            source={{
                                uri: `https://www.artic.edu/iiif/2/${art.image_id}/full/!843,843/0/default.jpg`,
                            }}
                            style={styles.image}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                router.push({
                                    pathname: "/chicago/(artwork)/[id]", // Literal path matching your file
                                    params: {
                                        title: art.title,
                                        id: art.id.toString(),     // Always pass params as strings
                                    },
                                });
                            }}
                        >
                            <Text style={styles.title}>
                               View - '{art.title}'
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.underline} />
                    </View>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    gallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        // backgroundColor:'#DCDCDC'
        // padding: 10,
    },
    galleryWeb: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "flex-start",
        marginLeft:35,
        // padding: 10,
    },

    card: {
        marginBottom: 10,
        width: 185,
        flexDirection: 'column',
        margin:5,
    },
    cardWeb: {
        margin: 10,
        width: 250,
        flexDirection: 'column'
    },
    image: {
        width: '100%',           // Two images side by side with some margin
        aspectRatio: 2 / 3,     // Example aspect ratio (width:height) — adjust as needed
        resizeMode: 'contain',
      
      },
    title: {
        fontFamily: 'NunitoSans_700Bold',
        color: "black",
        fontSize: 16,
        textAlign: 'left',
        marginTop: 4,
    },
    underline: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -2, // adjust this to offset the line
        height: 2,
        backgroundColor: 'black',
        width: '100%'
    },
});
