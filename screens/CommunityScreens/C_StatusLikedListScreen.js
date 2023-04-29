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

export default function C_StatusLikedListScreen({ navigation }) {
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
      <View style={styles.heading}></View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.back}
            source={require("../../assets/icons/back.png")}
          ></Image>
        </TouchableOpacity>
        <View style={styles.newsfeed}>
          <View style={styles.row2}>
            <Text style={styles.text}>Được thích bởi</Text>
          </View>

          <View style={styles.account_list}>
            {/* NỘI DUNG MỘT NGƯỜI DÙNG */}
            <View style={styles.row}>
              <View style={styles.row3}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người dùng */}
                  <Image
                    style={styles.avatar60}
                    source={require("../../assets/images/myavatar.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity>
                    {/* Tên người dùng */}
                    <Text style={styles.account_name}>Đỗ Quỳnh Chi</Text>
                  </TouchableOpacity>
                  {/* Tiểu sử người dùng */}
                  <Text style={styles.account_bio}>LOVE</Text>
                </View>
              </View>

              {/* Tùy chọn Follow */}
              {/* <TouchableOpacity style={styles.follow_button}>
                <Text style={styles.follow_text}>Theo dõi</Text>
              </TouchableOpacity> */}
            </View>
            {/* NỘI DUNG MỘT NGƯỜI DÙNG */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "90%",
    backgroundColor: "#FFF6F6",
  },
  heading: {
    width: "100%",
    height: "5%",
  },
  content: {
    flex: 1,
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
    paddingRight: 8,
  },
  row2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: "center",
  },
  row3: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#A51A29",
    fontFamily: "lexend-medium",
    marginLeft: "6%",
    marginTop: -48,
  },
  newsfeed: {
    // backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  account_list: {
    backgroundColor: "#ffffff",
    width: "90%",
    //height: 352,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  avatar60: {
    width: 60,
    height: 60,
    margin: 8,
  },
  account_name: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  account_bio: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "lexend-light",
  },
  follow_button: {
    backgroundColor: "#8F1928",
    borderRadius: 12,
    width: 114,
    height: 25,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
  },
  follow_text: {
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "lexend-medium",
    //marginLeft: "6%",
    //marginTop: -48,
  },
  following_button: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#8F1928",
    borderRadius: 12,
    width: 114,
    height: 25,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
  },
  following_text: {
    fontSize: 14,
    color: "#8F1928",
    fontFamily: "lexend-medium",
    //marginLeft: "6%",
    //marginTop: -48,
  },
});
