import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Suggestions from '../../Components/suggestionsArtist';
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import AddToCollection from '../../Functions/addToCollection';
import React from 'react';

export default function ArtworkScreen() {
  const { title, id } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    NunitoSans_900Black,
    NunitoSans_400Regular_Italic,
    NunitoSans_700Bold
  });
  const { width } = useWindowDimensions();
  const isWeb = width > 850;

  type Artwork = {
    id: number;
    title: string;
    image_id: string;
    artist_titles: string;
    date_display: string;
    alt_text: string;
    artist_display: string;
    medium_display: string;
    description: string;
    artwork_type_title: string;
    credit_line: string;
    department_title: string;
    category_titles: string;
    thumbnail: {
      alt_text: string;
    };
    dimensions: string
  };

  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;

      try {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`);
        setArtwork(response.data.data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };

    if (fontsLoaded) {
      fetchArtwork();
    }
  }, [id, fontsLoaded]);

  console.log(artwork?.image_id)

  if (!fontsLoaded || !artwork) {
    return (
      <View style={styles.mainContainer}>
        <Text>Loading artwork...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{title || "untitled"}</Text>
      <Text style={styles.date}>{artwork.date_display}</Text>
      <Text style={styles.artist}>{artwork.artist_display || "Unknown"}</Text>
      <View style={styles.gallery}>
        {artwork.image_id && (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
              }}
              style={[styles.image, isWeb && styles.imageWeb]}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <Text style={styles.credit}>Credited: {artwork.credit_line}</Text>
      <Text style={styles.dimensions}>Dimensions:{artwork.dimensions}</Text>
      <Text style={styles.descriptionLabel}>Description</Text>
      <Text style={styles.description}>
        {(artwork.description && artwork.description.replace(/<[^>]*>/g, '')) || "No description available."}
      </Text>
      <View style={styles.collection}>
        <Text style={styles.collectionText}>Add to your collection</Text>
      <AddToCollection/>
      </View>
      <Text style={styles.id}>Artwork ID: {id}</Text>
      <Text style={styles.category}>Catagory: {artwork.category_titles}</Text>
      <Text style={styles.suggestion}>More Works by {artwork.artist_titles}</Text>
      <Suggestions artist={artwork.artist_titles} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // padding: 10,
  },
  card: {
    marginBottom: 20,
    width: "100%",
    flexDirection: 'column'
  },
  image: {
    alignSelf:'center',
    width: '100%',           // Two images side by side with some margin
    aspectRatio: 4 / 3,     // Example aspect ratio (width:height) — adjust as needed
    resizeMode: 'contain',
  },
  imageWeb: {
    alignSelf:'center',
    width: '60%',           // Two images side by side with some margin
    aspectRatio: 4 / 3,     // Example aspect ratio (width:height) — adjust as needed
    resizeMode: 'contain',
  },
  scrollContent: {
    paddingBottom: 80,
    padding: 0
  },
  title: {
    fontSize: 28,
    fontFamily: 'NunitoSans_900Black',
    fontWeight: "bold",
    color: "#222",
    marginTop: 40,
    padding: 10
  },
  artist: {
    padding: 10,
    fontFamily: 'NunitoSans_900Black',
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  altText: {
    padding: 10,
    fontStyle: "italic",
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  dimensions: {
    fontStyle: "italic",
    fontSize: 14,
    padding: 1,
    color: "black",
    marginTop: -20,
    marginBottom: 10
  },
  id: {
    padding: 10,
    fontSize: 16,
    color: "#999",
    marginBottom: -10,
  },
  descriptionLabel: {
    fontSize: 20,
    marginBottom: 0,
    fontFamily: 'NunitoSans_700Bold',
    color: "#333",
    padding: 10
  },
  description: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: "#444",
    padding: 10,
    marginTop: -20,

  },
  date: {
    marginTop: -20,
    marginLeft: 0,
    fontFamily: 'NunitoSans_400Regular_Italic',
    padding: 10,
    fontSize: 16,
    color: "black",
  },
  category: {
    // fontFamily: 'NunitoSans_700Bold',
    padding: 10,
    fontSize: 16,
  },
  suggestion: {
    fontFamily: 'NunitoSans_400Regular_Italic',
    padding: 10,
    fontSize: 16,
  },
  credit: {
    marginTop: -20,
    marginBottom: 20
  },
  collection: {
    width: '100%',
    borderTopWidth: 2,
    borderBottomWidth:2,
    alignSelf: 'center',
    flexDirection: 'row',     // Lay out children horizontally
    justifyContent: 'space-evenly', // Push content to the right
    padding: 8,                 // Optional: spacing inside the container
  },
  collectionText:{
    fontFamily: 'NunitoSans_700Bold',
    fontSize:20,
    color:'brown',
    marginTop:10
  }
});

