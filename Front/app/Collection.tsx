import React, { useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { UserContext } from '../utils/UserContext'

export default function Collection() {
    const { user } = useContext(UserContext);

    console.log(user)

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Please log in to view your collection.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Collection</Text>

            <FlatList
                data={user.collection}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: item.imageUrl }} style={styles.image} 
                         resizeMode="contain"/>
                        <View style={styles.textContainer}>
                            <Text style={styles.artTitle}>{item.artTitle}</Text>
                            <Text style={styles.artist}>{item.artist}</Text>
                            <Text style={styles.collection}>{item.collection}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        backgroundColor: '#fff',
        paddingBottom:80
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 15
    },
    item: {
        flexDirection: 'row',
        // marginBottom: 15
    },
    image: {
        alignSelf: 'center',
        width: '100%',           // Two images side by side with some margin
        aspectRatio: 4 / 3,     // Example aspect ratio (width:height) — adjust as needed
        resizeMode: 'contain',
      },
    textContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    artTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },
    artist: {
        fontSize: 14,
        color: '#555'
    },
    collection: {
        fontSize: 12,
        color: '#888'
    },
});
