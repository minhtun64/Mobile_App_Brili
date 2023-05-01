import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Icon } from "react-native-elements";

const CustomFlashMessage = () => {
  return (
    <View style={styles.container}>
      <FlashMessage position="bottom" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomFlashMessage;
