import { View, TextInput, StyleSheet } from "react-native"

export default function SerachBar() {


    return (
        <View style={styles.searchContainer}>
            <TextInput style={styles.searchBox}
                placeholder="e.g 'Calude Monet' or 'Modern Art'"
                placeholderTextColor="rgba(0,0,0,.5)"
                returnKeyType="search"
            ></TextInput>
        </View>
    )
}

const styles = StyleSheet.create({

    searchContainer: {
        marginTop: 0,
        marginBottom: 5,
        height: 120,
        // backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        width: "100%",
        backgroundColor: "#fff",
        borderColor: 'grey',
        shadowColor: 'black',  // Shadow color (black here)
        shadowOffset: { width: 0, height: 2 },  // x: 0 (no horizontal offset), y: 10 (vertical offset)
        shadowOpacity: .3,  // Set shadow opacity (0-1 range)
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

})