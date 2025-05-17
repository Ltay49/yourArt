import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import SearchBar from "../../Components/searchBar";

export default function ArtistSearch() {
    const { artist, artworks } = useLocalSearchParams();

    // Parse the artworks if they exist
    const parsedArtworks = artworks ? JSON.parse(artworks as string) : [];

    return (
        <>
            <SearchBar />
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.gridContainer}>
                <Text>Results For: {artist}</Text>
            {parsedArtworks.length > 0 ? (
                parsedArtworks.map((artwork: any, index: number) => (
                    <View key={index} style={styles.card}>
                          { artwork.image_id?
                                <Image
                                    source={{
                                        uri: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
                                    }}
                                    style={styles.image}
                                /> :(
                                    <View style={styles.noImageBox}>
                                    <Text style={styles.noImageText}>No image available</Text>
                                    </View>
                                    )}
                        <Text>{artwork.artist_titles}</Text>
                        <Text>{artwork.title}</Text>
                    </View>
                ))
            ) : (
                <Text>No artworks found.</Text>
            )}
            </View>
            </ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
scrollContent: {
        paddingBottom: 80,
        padding: 0 },
gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
},
card: {
    width: "95%",
    backgroundColor: "#f0f0f0",
    borderColor:'grey',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 250, 
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
noImageText:{
    textAlign:'center',
    fontSize:50,
    fontFamily:'SpecialElite_400Regular',
    color: "brown",
    transform: [{ rotate: '-45deg' }]
},
noImageBox:{
    height: 300,
    borderRadius:10,
    borderWidth:2,
    justifyContent:'center',
    borderColor:'grey'
}
})