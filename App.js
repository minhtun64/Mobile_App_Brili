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

export default function App() {
  return <MainNavigator></MainNavigator>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
