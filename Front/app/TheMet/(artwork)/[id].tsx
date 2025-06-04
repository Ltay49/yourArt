import { Text, View, ScrollView, StyleSheet, Image, ImageBackground, ActivityIndicator } from "react-native"
import { useRouter, usePathname } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import AddToCollection from "../../Functions/addToCollection";
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { UserContext } from "@/utils/UserContext";

export default function TheMetArtwork() {

  const { id } = useLocalSearchParams()
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  const [fontsLoaded] = useFonts({
    NunitoSans_900Black,
    NunitoSans_400Regular_Italic,
    NunitoSans_700Bold
  });

  type Artwork = {
    objectID: number
    primaryImage: string
    title: string
    culture: string
    objectBeginDate: number
    artistDisplayName: string
    artistDisplayBio: string
    creditLine: string
    objectDate: string
    country: string
    artistNationality: string
  }

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
  
      setLoading(true); // ✅ Start loading here
  
      try {
        const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        setArtwork(response.data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      } finally {
        setLoading(false); // ✅ Only stop loading after try/catch finishes
      }
    };
  
    fetchArtwork();
  }, [id]);
  



  const artTitle = artwork?.title || "Untitled";

  const isAlreadyAdded = user?.collection?.some(
    (item) => item.artTitle === artTitle
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>
            Not long now, your art is on its way!
          </Text>
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        </View>
      )}
      <View style={styles.page}>
        <Text style={styles.title}>{artwork?.title || "untitled"}</Text>
        <View style={styles.row}>
          <Text style={styles.date}>{artwork?.country || "location unknown"},</Text>
          <Text style={styles.date}>{artwork?.objectDate}</Text>
        </View>
        <Text style={styles.artist}>{artwork?.artistDisplayName || "Artist: Unknown"}</Text>
        <Text style={styles.artist}>{artwork?.artistDisplayBio}</Text>
        {artwork?.primaryImage ? (
          <Image
            style={styles.image}
            source={{ uri: artwork?.primaryImage || "https://example.com/no-image.png" }}
            resizeMode="contain"
          />) : (
          <ImageBackground style={styles.noImageBox}>
            <Text style={styles.noImageText}>No image available</Text>
          </ImageBackground>
        )}
        <Text style={styles.credit}>Credited:{artwork?.creditLine}</Text>
        <View style={styles.collection}>
          <Text style={styles.collectionText}>Add to your collection</Text>
          <AddToCollection
            collectionItem={{
              collection: "The Metropolitan Museum of Art",
              artTitle: artwork?.title || "Untitled",
              artist: artwork?.artistDisplayName || "Unknown Artist",
              imageUrl: artwork?.primaryImage || "https://example.com/no-image.png"
            }}
            defaultRotated={isAlreadyAdded}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: {
    // flex: 1,
    justifyContent: 'center'
  },
  scrollContent: {
    paddingBottom: 80,
    padding: 0
  },
  noImageText: {
    top: '0%',
    height: '40%',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 50,
    fontFamily: 'SpecialElite_400Regular',
    color: "brown",
    transform: [{ rotate: '-45deg' }],
    // borderWidth: 2
  },
  noImageBox: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    overflow: 'hidden',
    height: 300,
    justifyContent: 'center',
    borderColor: 'grey'
  },
  image: {
    width: '100%',           // Two images side by side with some margin
    aspectRatio: 4 / 3,     // Example aspect ratio (width:height) — adjust as needed
    resizeMode: 'contain',
  },
  collection: {
    width: '100%',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    alignSelf: 'center',
    flexDirection: 'row',     // Lay out children horizontally
    justifyContent: 'space-evenly', // Push content to the right
    padding: 8,                 // Optional: spacing inside the container
  },
  collectionText: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 20,
    color: 'brown',
    marginTop: 10
  },
  row: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 28,
    fontFamily: 'NunitoSans_900Black',
    fontWeight: "bold",
    color: "#222",
    marginTop: 40,
    padding: 10
  },
  date: {
    marginTop: -20,
    marginLeft: 0,
    fontFamily: 'NunitoSans_400Regular_Italic',
    padding: 10,
    fontSize: 16,
    color: "black",
  },
  artist: {
    padding: 10,
    fontFamily: 'NunitoSans_900Black',
    fontSize: 18,
    color: "#555",
    marginBottom: -10,
  },
  credit: {
    marginTop: 0,
    marginBottom: 20
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