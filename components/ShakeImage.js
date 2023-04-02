import React, { useState, useEffect } from "react";
import { Animated, Easing } from "react-native";

const ShakeImage = ({ source, style }) => {
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start();
  }, []);

  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }],
  };

  return <Animated.Image source={source} style={[style, animatedStyle]} />;
};

export default ShakeImage;
