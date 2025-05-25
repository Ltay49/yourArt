import SearchBar from "@/app/Components/searchBarMet"
import SortBy from "@/app/Components/sortBy"
import { useRouter, useLocalSearchParams, usePathname } from "expo-router";
import { ScrollView, Text, View, StyleSheet } from "react-native";

export default function artistWork(){


    const { artist
        , artworks, total, limit, offset, total_pages, current_page, items } = useLocalSearchParams();

    console.log(artist)



    return(
        <ScrollView>
        <SearchBar/>
        <View>
        <Text>{items}</Text>
        <Text>results found for:</Text>
        <Text>{artist}</Text>
        </View>

        </ScrollView>
    )
}

const syles = StyleSheet.create({


})