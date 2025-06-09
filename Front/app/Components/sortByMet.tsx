import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";

const SORT_OPTIONS = [
  { key: 'year_asc', label: 'Year ↑' },
  { key: 'year_desc', label: 'Year ↓' },
  { key: 'alpha_asc', label: 'A → Z' },
  { key: 'alpha_desc', label: 'Z → A' },
];

type SortByProps = {
  onSort: (sortKey: string) => void;
  activeSort: string | null;
};

export default function SortBy({ onSort, activeSort }: SortByProps) {
  return (
    <View style={styles.sortContainer}>
      <FlatList
        horizontal
        data={SORT_OPTIONS}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.buttonContainer} 
        renderItem={({ item }) => (
          <Pressable
          onPress={() => onSort(item.key)}
          style={[
            styles.button,
            item.key === activeSort && styles.activeButton, 
          ]}
        >
          <Text style={[
            styles.buttonText,
            item.key === activeSort && styles.activeButtonText,
          ]}>
            {item.label}
          </Text>
        </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sortContainer: {
    paddingTop:0,
    paddingBottom:10,
    marginBottom: 5,
    height: 50,
    justifyContent: "center",
    textAlign:'center',
    borderTopWidth:0,
    borderBottomWidth: 1,
    borderTopColor:"#fff",
    borderColor: "grey",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',     
    flexDirection: 'row',     
    width: '100%',            
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6, 
    borderRadius: 6,
  },
  buttonText: {
    color:'black',
    textAlign:'center',
    fontSize: 14,
    fontWeight: "500",
  },
  activeButton: {
    backgroundColor: '#000',  
  },
  activeButtonText: {
    color: '#fff', 
  },
});