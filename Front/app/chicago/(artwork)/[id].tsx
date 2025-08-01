import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, Image, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Suggestions from '../../Components/suggestionsArtist';
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import AddToCollection from '../../Functions/addToCollection';
import React from 'react';
import { UserContext } from '@/utils/UserContext';

export default function ArtworkScreen() {
  const { title, id } = useLocalSearchParams();
  const { user } = useContext(UserContext)
  const [loading, setIsLoading] = useState(false)

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
    category_titles: string[];
    thumbnail: {
      alt_text: string;
    };
    dimensions: string
  };

  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      setIsLoading(true)

      try {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`);
        setArtwork(response.data.data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };
    setIsLoading(false)
    if (fontsLoaded) {
      fetchArtwork();
    }
  }, [id, fontsLoaded]);


  if (!fontsLoaded || !artwork) {
    return (
      <View style={styles.loadingOverlay}>
      <Text style={styles.loadingText}>
        Not long now, your artwork is on its way!
      </Text>
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
    </View>
    );
  }
  const imageUrl = artwork.image_id
    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/!843,843/0/default.jpg`
    : "";
  const artTitle = artwork?.title || "Untitled";

  const isAlreadyAdded = user?.collection?.some(
    (item) => item.artTitle === artTitle && `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg` === item.imageUrl
  );

  const formatedCat = artwork.category_titles.join(", ")

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{artwork.title || "untitled"}</Text>
      <Text style={styles.date}>{artwork.date_display}</Text>
      <Text style={styles.artist}>{artwork.artist_display || "Unknown"}</Text>
      <View style={styles.gallery}>
      {imageUrl ? (
          <View style={styles.card}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, isWeb && styles.imageWeb]}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.noImageBox}>
            <Text style={styles.noImageText}>No image available</Text>
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
        <AddToCollection
          collectionItem={{
            collection: "The Art Institute of Chicago",
            artTitle: artwork?.title || "Untitled",
            artist: artwork?.artist_titles[0] || "Unknown Artist",
            imageUrl: imageUrl
              ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/!843,843/0/default.jpg`
              : ""
          }}
          defaultRotated={isAlreadyAdded}
        />
      </View>
      <Text style={styles.id}>Artwork ID: {id}</Text>
      <Text style={styles.category}>Catagory: {formatedCat}</Text>
      <Text style={styles.suggestion}>See more works by {artwork.artist_display }</Text>
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
  },
  card: {
    marginBottom: 20,
    width: "100%",
    flexDirection: 'column'
  },
  image: {
    alignSelf: 'center',
    width: '100%',     
    aspectRatio: 4 / 3,    
    resizeMode: 'contain',
  },
  imageWeb: {
    alignSelf: 'center',
    width: '60%',         
    aspectRatio: 4 / 3, 
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
    borderBottomWidth: 2,
    alignSelf: 'center',
    flexDirection: 'row',   
    justifyContent: 'space-evenly',
    padding: 8,            
  },
  collectionText: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 20,
    color: 'brown',
    marginTop: 10
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
    height: '40%',
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 60,
    fontFamily: 'SpecialElite_400Regular',
    color: "brown",
},
noImageBox: {
    overflow: 'hidden',
    height: 300,
    borderRadius: 10,
    justifyContent: 'center',
    borderColor: 'grey'
},
});

