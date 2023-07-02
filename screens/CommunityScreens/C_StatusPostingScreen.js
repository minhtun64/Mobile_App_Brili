import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";
import { Audio, Video, ResizeMode } from "expo-av";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as VideoPicker from "expo-image-picker";

import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import * as Font from "expo-font";
import moment from "moment";
import { storage, database } from "../../firebase";
import {
  getDatabase,
  set,
  push,
  ref,
  get,
  onValue,
  remove,
} from "firebase/database";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import { UserContext } from "../../UserIdContext";

export default function C_StatusPostingScreen({ navigation }) {
  const myUserId = useContext(UserContext).userId;

  const [fontLoaded, setFontLoaded] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [postIdList, setPostIdList] = useState([]);

  useEffect(() => {
    const userRef = ref(database, `user/${myUserId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setAvatar(data.avatar);
      setName(data.name);
    });

    const postRef = ref(database, "post");
    get(postRef).then((snapshot) => {
      const data = snapshot.val();
      const postIdList = Object.keys(data);
      setPostIdList(postIdList);
    });
  }, []);

  // CÀI ĐẶT FONT CHỮ
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "lexend-black": require("../../assets/fonts/Lexend/static/Lexend-Black.ttf"),
        "lexend-bold": require("../../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
        "lexend-extrabold": require("../../assets/fonts/Lexend/static/Lexend-ExtraBold.ttf"),
        "lexend-extralight": require("../../assets/fonts/Lexend/static/Lexend-ExtraLight.ttf"),
        "lexend-light": require("../../assets/fonts/Lexend/static/Lexend-Light.ttf"),
        "lexend-medium": require("../../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
        "lexend-regular": require("../../assets/fonts/Lexend/static/Lexend-Regular.ttf"),
        "lexend-semibold": require("../../assets/fonts/Lexend/static/Lexend-SemiBold.ttf"),
        "lexend-thin": require("../../assets/fonts/Lexend/static/Lexend-Thin.ttf"),
        "SF-Pro-Display": require("../../assets/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  //ĐĂNG BÀI
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState("");
  const [media, setMedia] = useState("");
  const handlePost = async () => {
    if (value === "") {
      return;
    }
    const maxPostId = Math.max(...postIdList);
    const newPostId = maxPostId + 1;
    const newPostRef = ref(database, `post/${newPostId}`);
    const newPostData = {
      user_id: myUserId,
      content: value,
      media: "",
      mediaType: "",
      date: moment().format("DD-MM-YYYY HH:mm:ss"),
    };
    if (isSelected) {
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Status_Images/${newPostId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          newPostData.media = url;
          newPostData.mediaType = "image";
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      } else {
        const response = await fetch(video);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Status_Videos/${newPostId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          newPostData.media = url;
          newPostData.mediaType = "video";
        } catch (error) {
          console.log("Error uploading video:", error);
        }
      }
    }
    setModalVisible(true);
    await set(newPostRef, newPostData);
    // Hiển thị snackbar thành công
    setModalVisible(false);
    navigation.navigate("C_Home");
  };

  // CHỌN/XÓA ẢNH
  const [image, setImage] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const pickImage = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setIsSelected(true);
      setImage(result.assets[0].uri);
    }
  };
  const removeImage = () => {
    setIsSelected(false);
    setImage(null);
  };

  // CHỌN/XÓA VIDEO
  const [video, setVideo] = useState(null);
  const pickVideo = async () => {
    const { status } = await VideoPicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
      return;
    }
    let result = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setIsSelected(true);
      setVideo(result.assets[0].uri);
    }
  };
  const removeVideo = () => {
    setIsSelected(false);
    setVideo(null);
  };

  if (!fontLoaded) {
    return null; // or a loading spinner
  }
  return (
    <View style={styles.container}>
      {/* heading */}
      <View style={styles.heading}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancel}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.post_button}
            onPress={handlePost}
            disabled={value === ""}
          >
            <Text style={styles.post}>Đăng</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.row3}>
          {/* Ảnh đại diện người đăng */}
          <Image style={styles.avatar40} source={{ uri: avatar }}></Image>
          <View>
            {/* Tên người đăng */}
            <Text style={styles.account_name}>{name}</Text>
            {/* Thời gian đăng */}
            <TouchableOpacity style={styles.set_public}>
              <View style={styles.row2}>
                <Text style={styles.public}>Công khai</Text>
                <Image
                  style={styles.arrow_down}
                  source={require("../../assets/icons/arrow-down.png")}
                ></Image>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.status_input}
          placeholder="Hôm nay tâm trạng thú cưng của bạn như thế nào?"
          value={value}
          onChangeText={setValue}
          multiline={true}
        ></TextInput>
        {isSelected ? (
          <View
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 28,
            }}
          >
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: 12,
                }}
              />
            )}
            {video && (
              <Video
                source={{ uri: video }}
                // style={styles.previewVideo}
                style={{
                  width: 320,
                  height: 180,
                  borderRadius: 12,
                }}
                useNativeControls
                resizeMode="contain"
              />
            )}
            <TouchableOpacity
              onPress={removeImage}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <Image
            source={require("../../assets/images/background-posting-status.png")}
            style={styles.background}
          ></Image>
        )}

        <View style={styles.row2}>
          <TouchableOpacity onPress={pickImage}>
            <ImageBackground
              source={require("../../assets/images/post_image.jpg")}
              style={styles.post_media}
              borderRadius={10}
            >
              <Text style={styles.label}>Chọn Ảnh</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickVideo}>
            <ImageBackground
              source={require("../../assets/images/post-image.gif")}
              style={styles.post_media}
              borderRadius={10}
            >
              <Text style={styles.label}>Chọn Video</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Snackbar
            visible={true}
            duration={2000}
            style={{ backgroundColor: "white" }}
            theme={{ colors: { text: "white" } }}
          >
            <View style={styles.row10}>
              <Ionicons name="sync-outline" size={28} color="green" />
              <Text style={styles.snackbarText}>Đang tải lên...</Text>
            </View>
          </Snackbar>
        </View>
      </Modal>
    </View>
  );
}

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
  container: {
    width: "100%",
    height: "90%",
    backgroundColor: "#ffffff",
  },
  heading: {
    width: "100%",
    height: "14%",
    // backgroundColor: "red",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#FFF6F6",
  },
  content: {
    flex: 1,
    // backgroundColor: "red",
  },
  posting_content: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "black",
  },
  back: {
    width: 34,
    height: 30,
    marginLeft: 12,
    marginTop: 8,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingLeft: 16,
    paddingRight: 16,
    position: "absolute",
    bottom: "10%",
    // backgroundColor: "white",
  },
  row2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row3: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: "center",
  },
  avatar40: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginLeft: 16,
    borderRadius: 50,
  },
  cancel: {
    fontSize: 16,
    fontFamily: "lexend-light",
  },
  post: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "lexend-medium",
  },
  post_button: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#8F1928",
    borderRadius: 12,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
  },
  background: {
    width: 300,
    height: 300,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "7%",
  },
  account_name: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  set_public: {
    padding: 4,
    borderColor: "#8F1928",
    borderRadius: 12,
    borderStyle: "solid",
    borderWidth: 1,
    width: 86,
  },

  public: {
    fontSize: 12,
    color: "#8F1928",
    fontFamily: "lexend-regular",
  },
  arrow_down: {
    width: 12,
    height: 12,
    // marginRight: 4,
    marginLeft: 8,
  },
  status_input: {
    fontSize: 18,
    padding: 16,
    marginTop: 8,
    fontFamily: "lexend-regular",
  },
  post_media: {
    width: 150,
    height: 100,
    marginTop: 80,
    marginRight: 30,
    marginLeft: 30,
  },
  label: {
    color: "white",
    fontFamily: "lexend-regular",
    marginTop: 76,
    fontSize: 18,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
