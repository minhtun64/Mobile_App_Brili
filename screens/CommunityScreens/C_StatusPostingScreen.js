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
} from "react";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import * as Font from "expo-font";

import { useSwipe } from "../../hooks/useSwipe";

export default function C_StatusPostingScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    //navigation.goBack();
  }

  function onSwipeRight() {
    navigation.goBack();
  }

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

  //Lưu ảnh

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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.post}>Đăng</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <View style={styles.row3}>
          {/* Ảnh đại diện người đăng */}
          <Image
            style={styles.avatar40}
            source={require("../../assets/images/avatar-1.png")}
          ></Image>
          <View>
            {/* Tên người đăng */}
            <Text style={styles.account_name}>Đỗ Quỳnh Chi</Text>
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
          // value={value}
          // onChangeText={setValue}
          multiline={true}
          // onContentSizeChange={handleContentSizeChange}
          // ref={textInputRef}
          // onSubmitEditing={() => Keyboard.dismiss()}
        ></TextInput>
        <Image
          source={require("../../assets/images/background-posting-status.png")}
          style={styles.background}
        ></Image>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    // position: "fixed",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "40%",
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
    // marginRight: 8,
    marginLeft: 8,
  },
  status_input: {
    fontSize: 18,
    padding: 16,
    marginTop: 8,
    fontFamily: "lexend-regular",
  },
});