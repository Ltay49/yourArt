import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from "@/utils/UserContext";

type CollectionItem = {
  collection: string;
  artTitle: string;
  artist: string;
  imageUrl: string;
};

type AddToCollectionProps = {
  collectionItem: CollectionItem;
  defaultRotated?: boolean;
};

export default function AddToCollection({ collectionItem, defaultRotated = false }: AddToCollectionProps) {
  if (!collectionItem) {
    console.warn("AddToCollection: collectionItem prop is missing or undefined");
    return null;
  }

  const rotateValue = useRef(new Animated.Value(defaultRotated ? 1 : 0)).current;
  const [rotated, setRotated] = useState(defaultRotated);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setRotated(defaultRotated);
    Animated.timing(rotateValue, {
      toValue: defaultRotated ? 1 : 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [defaultRotated]);

  const handlePress = async () => {

    if (!user?.username) {
      alert("Please log in or sign up to add items to your collection.");
      return;
    }

    Animated.timing(rotateValue, {
      toValue: rotated ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setRotated(!rotated);

    const { collection, artTitle, artist, imageUrl } = collectionItem;

    const artworkExists = user.collection?.some(
      (item) => item.artTitle === artTitle
    );

    try {
      if (artworkExists) {
        const response = await fetch(
          `https://yourart-production.up.railway.app/api/userProfile/${user.username}/collection/${encodeURIComponent(artTitle)}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error(`Failed to remove artwork. Status: ${response.status}`);

        setUser({
          ...user,
          collection: user.collection.filter((item) => item.artTitle !== artTitle),
        });

        alert("Artwork removed from your collection.");
      } else {
        const response = await fetch(
          `https://yourart-production.up.railway.app/api/userProfile/${user.username}/collection`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collection, artTitle, artist, imageUrl }),
          }
        );

        if (!response.ok) throw new Error(`Failed to add artwork. Status: ${response.status}`);

        setUser({
          ...user,
          collection: [...(user.collection || []), collectionItem],
        });

        alert("Artwork added to your collection.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update your collection.");
    }
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const wrapperColor = rotated ? "red" : "green";

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.iconWrapper, { transform: [{ rotate }], borderColor: wrapperColor }]}>
        <Icon
          name={rotated ? "close" : "add"}
          size={30}
          color={wrapperColor}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    borderWidth: 2,
    borderRadius: 999,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});



