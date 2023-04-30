import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import * as Font from "expo-font";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Permissions } from "expo-permissions";
import * as FileSystem from "expo-file-system";

const ImagePopup = ({ imageSource }) => {
  console.log(imageSource);
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "lexend-black": require("../assets/fonts/Lexend/static/Lexend-Black.ttf"),
        "lexend-bold": require("../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
        "lexend-extrabold": require("../assets/fonts/Lexend/static/Lexend-ExtraBold.ttf"),
        "lexend-extralight": require("../assets/fonts/Lexend/static/Lexend-ExtraLight.ttf"),
        "lexend-light": require("../assets/fonts/Lexend/static/Lexend-Light.ttf"),
        "lexend-medium": require("../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
        "lexend-regular": require("../assets/fonts/Lexend/static/Lexend-Regular.ttf"),
        "lexend-semibold": require("../assets/fonts/Lexend/static/Lexend-SemiBold.ttf"),
        "lexend-thin": require("../assets/fonts/Lexend/static/Lexend-Thin.ttf"),
        "SF-Pro-Display": require("../assets/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  //Pop up ảnh
  const [modalVisible, setModalVisible] = useState(true);

  //Lưu / Chia sẻ ảnh
  const [showOptions, setShowOptions] = useState(false);

  const openOptions = () => setShowOptions(true);
  const closeOptions = () => setShowOptions(false);

  const SaveImage = async () => {
    try {
      // Request device storage access permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        // Create asset object from local image file
        const asset = await MediaLibrary.createAssetAsync(imageSource);

        // Save image to media library
        await MediaLibrary.saveToLibraryAsync(asset.localUri);

        console.log("Image successfully saved");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ShareImage = async () => {
    //
  };
  //Lưu/ Chia sẻ ảnh

  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,

          backgroundColor: showOptions ? "rgba(0,0,0,0.5)" : "white",
        }}
        onPress={closeOptions}
      >
        {/* Icon để đóng Modal */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 80,
            left: 20,
            zIndex: 1,
          }}
          onPress={() => {
            closeOptions();
            setModalVisible(false);
          }}
        >
          <Image
            source={require("../assets/icons/close.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        {/* Icon để hiển thị các tùy chọn khác */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 80,
            right: 20,
            zIndex: 1,
          }}
          onPress={openOptions}
        >
          <Image
            source={require("../assets/icons/dots.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        {/* Hình ảnh sẽ hiển thị trong Modal */}
        <Image
          source={{ uri: imageSource }}
          style={{
            width: Dimensions.get("window").width,
            height: "100%",
            marginTop: -40,
            opacity: showOptions ? 0.5 : 1,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* Bottom pop up */}
      {showOptions && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFF6F6",
            height: "16%",
            justifyContent: "space-around",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: "#FCAC9E",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 24,
          }}
        >
          <TouchableOpacity onPress={SaveImage}>
            <Text style={styles.image_option}>Lưu ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ShareImage}>
            <Text style={styles.image_option}>Chia sẻ ảnh</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  image_option: {
    fontSize: 16,
    fontFamily: "lexend-regular",
    color: "#A51A29",
  },
});

export default ImagePopup;
