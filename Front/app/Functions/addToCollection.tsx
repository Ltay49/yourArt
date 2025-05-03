import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import React, { useState, useRef } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default function AddToCollection() {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [rotated, setRotated] = useState(false);

  const handlePress = () => {
    Animated.timing(rotateValue, {
      toValue: rotated ? 0 : 45,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setRotated(!rotated);
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


