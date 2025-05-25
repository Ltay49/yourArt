import axios from "axios";
import { View, TextInput, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from 'expo-router';

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
          {
            params: {
              q: artistName,
            },
          }
        );
  
        const objectIDs: number[] = searchRes.data.objectIDs || [];

        console.log(objectIDs)
  
        // if (objectIDs.length === 0) {
        //   console.warn("No artworks found for this artist.");
        //   router.push({
        //     pathname: "./TheMet/not-found",
        //     params: { artist: artistName },
        //   });
        //   return;
        // }
  
        const limitedIDs = objectIDs.slice(0, 25);

        console.log(limitedIDs)
  
        const artworkDetails = await Promise.all(
          limitedIDs.map(async (id) => {
            try {
              const res = await axios.get(
                `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
              );
              return res.data;
            } catch (err) {
              if (err instanceof Error) {
                console.warn(`Failed to fetch object ID ${id}: ${err.message}`);
              } else {
                console.warn(`Failed to fetch object ID ${id}:`, err);
              }
              return null;
            }
          })
        );
  
        const filteredArtworks = artworkDetails.filter(
          (item) => item && item.primaryImage
        );
  
        // if (filteredArtworks.length === 0) {
        //   console.warn("No artworks with images found for this artist.");
        //   router.push({
        //     pathname: "./TheMet/not-found",
        //     params: { artist: artistName },
        //   });
        //   return;
        // }
  
        setArtworks(filteredArtworks);
  
        router.push({
          pathname: "/TheMet/(artist)/[artist]",
          params: {
            artist: artistName,
            artworks: JSON.stringify(
              filteredArtworks.map(
                ({ objectID, title, primaryImage, artistDisplayName, objectDate}) => ({
                  id: objectID,
                  title,
                  image: primaryImage,
                  artist: artistDisplayName,
                  date: objectDate,
                })
              )
            ),
            items: objectIDs.length
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
