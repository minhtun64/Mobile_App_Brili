import React from "react";
import { StyleSheet, View } from "react-native";
import ChatListHeader from "./ChatListHeader";

function M_ChatListScreen() {
  return (
    <View style={styles.container}>
      <ChatListHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

export default M_ChatListScreen;
