import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const SucessPopup = ({ visible, setVisible }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={() => setVisible(false)}
      duration={2000}
      style={{ backgroundColor: "white", marginBottom: 10}}
      theme={{ colors: { text: "white" } }}
    >
      <View style={styles.row10}>
        <Ionicons name="md-checkmark-circle" size={28} color="green" />
        <Text style={styles.snackbarText}>Tin nhắn đã được xóa</Text>
      </View>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  row10: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  snackbarText: {
    fontSize: 16,
    fontFamily: "lexend-light",
    color: "green",
    marginLeft: 20,
  },
});

export default SucessPopup;
