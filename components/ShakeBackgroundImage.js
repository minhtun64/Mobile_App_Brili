import React, { useState, useEffect } from "react";
import { ImageBackground, Animated, Easing } from "react-native";

const ShakeBackgroundImage = ({ source, children, ...props }) => {
  const [shakeValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const shake = Animated.sequence([
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 250,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: -10,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 0,
        duration: 250,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(shake, { iterations: -1 }).start();
  }, [shakeValue]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeValue }] }}>
      <ImageBackground source={source} {...props}>
        {children}
      </ImageBackground>
    </Animated.View>
  );
};

export default ShakeBackgroundImage;
