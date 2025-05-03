import { TouchableOpacity, Text, StyleSheet } from "react-native"
import React from 'react';

export default function AddToCollection(){

    return(
        <TouchableOpacity>
        <Text style={styles.collect}>Add to your collection</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    collect: {
        color: 'brown',
        fontWeight: 'bold',
        fontSize:16,
    },
})