import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import React, { useState, useRef } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useContext } from 'react'
import { UserContext } from "@/utils/UserConext";

type CollectionItem = {
  collection: string;
  artTitle: string;
  artist: string;
  imageUrl: string;
};

type AddToCollectionProps = {
  collectionItem: CollectionItem;
};

export default function AddToCollection({ collectionItem }: AddToCollectionProps) {
  if (!collectionItem) {
    console.warn("AddToCollection: collectionItem prop is missing or undefined");
    return null; // or a fallback UI
  }
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [rotated, setRotated] = useState(false);

  const { user, setUser } = useContext(UserContext);


  console.log("AddToCollection props:", collectionItem);

  const handlePress = async () => {
    Animated.timing(rotateValue, {
      toValue: rotated ? 0 : 45,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setRotated(!rotated);

    if (!user?.username) {
      console.warn("User not logged in");
      return;
    }

    const { collection, artTitle, artist, imageUrl } = collectionItem;

    const artworkExists = user.collection?.some(
      (item) => item.artTitle === artTitle
    );

    try {
      if (artworkExists) {
        // 🔴 REMOVE request
        const response = await fetch(
          `https://yourart-production.up.railway.app/api/userProfile/${user.username}/collection/${encodeURIComponent(artTitle)}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to remove artwork. Status: ${response.status}`);
        }

        // 🔄 Update context
        setUser({
          ...user,
          collection: user.collection.filter((item) => item.artTitle !== artTitle),
        });

        alert("Artwork removed from your collection.");
      } else {
        // ✅ ADD request
        const response = await fetch(
          `https://yourart-production.up.railway.app/api/userProfile/${user.username}/collection`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ collection, artTitle, artist, imageUrl }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to add artwork. Status: ${response.status}`);
        }

        // 🔄 Update context
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
    inputRange: [0, 45],
    outputRange: ["0deg", "45deg"],
  });

  const wrapperColor = rotated ? "red" : "green";

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.iconWrapper, { transform: [{ rotate }], borderColor: wrapperColor }]}>
        <Icon
          name="add"
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


