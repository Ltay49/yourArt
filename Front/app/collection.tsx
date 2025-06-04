import React, { useContext, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { UserContext } from '../utils/UserContext';

export default function Collection() {
    const { user } = useContext(UserContext);
    const [collection, setCollection] = useState(user?.collection || []);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const { width } = useWindowDimensions();
    const isWeb = width > 850;

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Please log in to view your collection.</Text>
            </View>
        );
    }

    const filteredCollection = activeFilter
        ? collection.filter(item => item.collection === activeFilter)
        : collection;

    const handleRemove = async (artTitle: string, index: number) => {
        const encodedTitle = encodeURIComponent(artTitle);
        const username = user.username; // Assuming your user object has a `username` field

        try {
            const response = await fetch(`https://yourart-production.up.railway.app/api/userProfile/${username}/collection/${encodedTitle}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete');
            }

            // Update local state after successful delete
            setCollection(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            Alert.alert('Error', 'Could not remove artwork. Please try again.');
            console.error('Delete error:', error);
        }
    };

    return (
        <View style={[styles.container, isWeb && styles.containerWeb]}>
            {/* <Text style={styles.title}>{user.firstname}'s Collection</Text> */}
        <View>
            <Text>Your collection ranges from:</Text>
            </View>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'The Metropolitan Museum of Art' && styles.activeFilter,
                    ]}
                    onPress={() =>
                        activeFilter === 'The Metropolitan Museum of Art'
                            ? setActiveFilter(null)
                            : setActiveFilter('The Metropolitan Museum of Art')
                    }
                >
                    <Text style={styles.filterText}>
                        The Metropolitan Museum of Art {activeFilter === 'The Metropolitan Museum of Art' && '✕'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'The Art Institute of Chicago' && styles.activeFilter,
                    ]}
                    onPress={() =>
                        activeFilter === 'The Art Institute of Chicago'
                            ? setActiveFilter(null)
                            : setActiveFilter('The Art Institute of Chicago')
                    }
                >
                    <Text style={styles.filterText}>
                        The Art Institute of Chicago {activeFilter === 'The Art Institute of Chicago' && '✕'}
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredCollection}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item, index }) => (
                    <View style={[styles.card, { backgroundColor: index % 2 === 0 ? '#fff' : '#f0f0f0' }]}>
                        <Image source={{ uri: item.imageUrl }} style={[styles.image, isWeb && styles.imageWeb]} resizeMode="contain" />
                        <View style={styles.textContainer}>
                            <Text style={styles.artTitle}>{item.artTitle}</Text>
                            <Text style={styles.artist}>{item.artist}</Text>
                            <Text style={styles.collection}>{item.collection}</Text>
                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.artTitle, index)}>
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    containerWeb: {
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    filterContainer: {
        flexDirection:'row',
        justifyContent: 'center',
        marginBottom: 0,
        // margin:'2%',
        paddingHorizontal: 10,
        width:'100%'
    },
    filterButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center', // ✅ centers children horizontally
        justifyContent: 'center', // ✅ centers vertically
        marginBottom: 5,
        marginHorizontal: 5,
      },
    clearButton: {
        backgroundColor: '#999',
    },
    activeFilter: {
        backgroundColor: '#4CAF50',
    },
    filterText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
    card: {
        flex: 1,
        // margin: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center', // ← Ensures children are centered horizontally
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    imageWeb: {
        alignSelf: 'center',
        width: '59%',           // Two images side by side with some margin
        aspectRatio: 4 / 3,     // Example aspect ratio (width:height) — adjust as needed
        resizeMode: 'contain',
    },
    textContainer: {
        width:'50%',
        // marginTop: 10,
        padding: 12,
        // backgroundColor: 'darkgrey',
        // borderRadius: 6,
        alignItems: 'center',
    },
    artTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black',
    },
    artist: {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
    },
    collection: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    removeButton: {
        marginTop: 10,
        backgroundColor: '#ff4d4d',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    removeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});



