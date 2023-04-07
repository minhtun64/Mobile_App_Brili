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

import ShakeBackgroundImage from "../../components/ShakeBackgroundImage";
import TextAnimation from "../../components/TextAnimation";
//import ImageModal from "../../components/ImageModal";

export default function C_HomeScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [iconStatus, setIconStatus] = useState(false);

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.post}>
          <View style={styles.row}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/logo.png")}
              //resizeMode="contain"
            ></Image>
            <TouchableOpacity onPress={() => navigation.navigate("C_Search")}>
              <Image
                style={styles.search}
                source={require("../../assets/icons/search.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity>
              <Image
                style={styles.avatar60}
                source={require("../../assets/images/myavatar.png")}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("C_StatusPosting")}
            >
              <ShakeBackgroundImage
                style={styles.frame_post}
                source={require("../../assets/images/frame-post.png")}
              >
                <View style={styles.label}>
                  <TextAnimation text="Chia sẻ khoảnh khắc với thú cưng !!!" />
                </View>
              </ShakeBackgroundImage>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.whiteline}></View>
        <View style={styles.newsfeed}>
          <View style={styles.row2}>
            <Text style={styles.text}>Bảng tin</Text>
            <Image
              style={styles.footprint}
              source={require("../../assets/images/footprint.png")}
              //resizeMode="contain"
            ></Image>
          </View>

          {/* NỘI DUNG MỘT STATUS */}
          <TouchableOpacity
            style={styles.status}
            onPress={() => navigation.navigate("C_Status")}
            // onPress={() => console.log("Button pressed")}
          >
            <View style={styles.row}>
              <View style={styles.row2}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người đăng */}
                  <Image
                    style={styles.avatar50}
                    source={require("../../assets/images/avatar-1.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity>
                    {/* Tên người đăng */}
                    <Text style={styles.status_name}>Đặng Minh Tuấn</Text>
                  </TouchableOpacity>
                  {/* Thời gian đăng */}
                  <Text style={styles.status_date}>4 giờ trước</Text>
                </View>
              </View>
              <TouchableOpacity>
                {/* Tùy chọn Status */}
                <Image
                  style={styles.status_option}
                  source={require("../../assets/icons/option.png")}
                ></Image>
              </TouchableOpacity>
            </View>

            {/* Nội dung Status */}
            <Text style={styles.status_content} selectable={true}>
              Good morning!!! {"\u2764"}
              {"\u2601"}
            </Text>

            {/* Ảnh / Video Status */}
            <TouchableOpacity>
              <Image
                style={styles.status_image}
                source={require("../../assets/images/status-1.png")}
              />
            </TouchableOpacity>

            {/* Like / Comment / Share */}
            <View style={styles.row}>
              <View style={styles.row2}>
                <TouchableOpacity
                  onPress={() => {
                    setIconStatus(!iconStatus);
                  }}
                >
                  <Image
                    style={styles.like}
                    source={
                      iconStatus
                        ? require("../../assets/icons/liked.png")
                        : require("../../assets/icons/like.png")
                    }
                  ></Image>
                </TouchableOpacity>
                <Text>12</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("C_Status")}
                >
                  <Image
                    style={styles.comment}
                    source={require("../../assets/icons/comment.png")}
                  ></Image>
                </TouchableOpacity>
                <Text>3</Text>
              </View>
              <TouchableOpacity>
                <Image
                  style={styles.share}
                  source={require("../../assets/icons/share.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {/* NỘI DUNG MỘT STATUS */}

          {/* NỘI DUNG MỘT STATUS */}
          <View style={styles.status}>
            <View style={styles.row}>
              <View style={styles.row2}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người đăng */}
                  <Image
                    style={styles.avatar50}
                    source={require("../../assets/images/avatar-1.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity>
                    {/* Tên người đăng */}
                    <Text style={styles.status_name}>Đặng Minh Tuấn</Text>
                  </TouchableOpacity>
                  {/* Thời gian đăng */}
                  <Text style={styles.status_date}>4 giờ trước</Text>
                </View>
              </View>
              <TouchableOpacity>
                {/* Tùy chọn Status */}
                <Image
                  style={styles.status_option}
                  source={require("../../assets/icons/option.png")}
                ></Image>
              </TouchableOpacity>
            </View>

            {/* Nội dung Status */}
            <Text style={styles.status_content} selectable={true}>
              Good morning!!! {"\u{2764}"}
              {"\u{2601}"}
            </Text>

            {/* Ảnh / Video Status */}
            <TouchableOpacity>
              <Image
                style={styles.status_image}
                source={require("../../assets/images/status-1.png")}
              />
            </TouchableOpacity>

            {/* Like / Comment / Share */}
            <View style={styles.row}>
              <View style={styles.row2}>
                <TouchableOpacity>
                  <Image
                    style={styles.like}
                    source={require("../../assets/icons/like.png")}
                  ></Image>
                </TouchableOpacity>
                <Text>12</Text>
                <TouchableOpacity>
                  <Image
                    style={styles.comment}
                    source={require("../../assets/icons/comment.png")}
                  ></Image>
                </TouchableOpacity>
                <Text>3</Text>
              </View>
              <TouchableOpacity>
                <Image
                  style={styles.share}
                  source={require("../../assets/icons/share.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          {/* NỘI DUNG MỘT STATUS */}

          <View style={styles.status}></View>
          <View style={styles.status}></View>
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
  post: {
    backgroundColor: "#FFF6F6",
    width: "100%",
    height: 142,
    paddingBottom: "4%",
  },
  row: {
    width: "100%",
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    //marginTop: "2%",
    //marginBottom: "2%",
    //backgroundColor: "black",
    alignItems: "center",
  },
  logo: {
    // width: "24%",
    // height: "44%",
    width: 100,
    height: 21.73,
    marginLeft: "6%",
    marginTop: "4%",
  },
  search: {
    width: 35,
    height: 35,
    marginRight: "6%",
    //marginTop: "-12%",
  },
  avatar60: {
    width: 60,
    height: 60,
    marginLeft: 20,
  },
  frame_post: {
    width: 324,
    height: 98.92,
    marginTop: "2%",
  },
  label: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteline: {
    backgroundColor: "white",
    width: "100%",
    height: 8,
  },
  row2: {
    //width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    //paddingLeft: "6%",
    paddingBottom: 4,
    // backgroundColor: "black",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#A51A29",
    fontFamily: "lexend-medium",
    marginLeft: "6%",
  },
  footprint: {
    width: 38,
    height: 32,
    //marginLeft: 20,
  },
  newsfeed: {
    // backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 100,
  },
  status: {
    backgroundColor: "white",
    width: "90%",
    height: 352,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  avatar50: {
    width: 50,
    height: 50,
    margin: 8,
  },
  status_option: {
    width: 28,
    height: 28,
    marginRight: 8,
    marginTop: -16,
  },
  row3: {
    width: "100%",
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2%",
    marginBottom: "2%",
    //backgroundColor: "black",
    alignItems: "center",
  },
  status_name: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "lexend-semibold",
  },
  status_date: {
    fontSize: 12,
    color: "#878080",
    fontFamily: "lexend-light",
  },
  status_content: {
    fontSize: 16,
    //color: "#878080",
    fontFamily: "SF-Pro-Display",
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  status_image: {
    width: 320,
    height: 180,
    resizeMode: "contain",
    alignSelf: "center",
    margin: 8,
    borderRadius: 12,
    //transform: [{ scale: this.state.scaleValue }],
  },
  like: {
    width: 22,
    height: 22,
    marginLeft: 20,
    marginRight: 4,
  },
  comment: {
    width: 22,
    height: 22,
    marginLeft: 40,
    marginRight: 4,
  },
  share: {
    width: 22,
    height: 22,
    marginRight: 20,
  },
});
