import React, { useState } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const ImagePopup = ({ imageSource }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const saveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(imageUri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        alert("Image saved successfully!");
      }
    } catch (error) {
      console.log("An error occurred while saving the image: ", error);
    }
  };

  const onImageLoaded = async () => {
    if (Platform.OS === "ios") {
      const { uri } = await FileSystem.downloadAsync(
        imageSource,
        FileSystem.cacheDirectory + "temp_image.jpg"
      );
      setImageUri(uri);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          style={styles.status_image}
          source={imageSource}
          onLoad={onImageLoaded}
        />
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent={false} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="ios-close" size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveImage}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
          <Image
            style={styles.image}
            source={{ uri: imageUri }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  status_image: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  modalHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default ImagePopup;
