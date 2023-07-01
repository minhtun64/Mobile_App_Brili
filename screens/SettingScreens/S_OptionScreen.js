import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
} from "react-native";
import React, { Component } from "react";

export default function S_OptionScreen({ navigation }) {
  return (
    <View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("T_SignIn")}
      >
        <Text style={styles.opt}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 332,
    height: 80,
    backgroundColor: "#195ABB",
    marginTop: 400,
    marginBottom: 8,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
  },
  opt: {
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 8,
    marginLeft: 40,
    marginRight: 40,
  },
});
