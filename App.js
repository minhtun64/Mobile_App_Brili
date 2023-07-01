import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MainNavigator from "./navigation/PetCareNav";
import { LogBox } from "react-native";

import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";

import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./UserIdContext";

export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);
  return (
    <UserProvider>
      <MainNavigator></MainNavigator>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
