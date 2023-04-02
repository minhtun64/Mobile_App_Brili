import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";

const TextAnimation = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;
      if (index > text.length) {
        index = 0;
      }
    }, 100);
    return () => clearInterval(timer);
  }, [text]);

  return <Text style={styles.text}>{displayText}</Text>;
};

export default TextAnimation;

const styles = StyleSheet.create({
  text: {
    //fontSize: 14,
    color: "#754C24",
    fontFamily: "lexend-regular",
  },
});
