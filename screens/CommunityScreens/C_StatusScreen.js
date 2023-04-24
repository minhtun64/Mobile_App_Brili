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

export default function C_StatusScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    //navigation.goBack();
  }

  function onSwipeRight() {
    navigation.goBack();
  }

  const [value, setValue] = useState("");
  const [lineCount, setLineCount] = useState(1);
  const [height, setHeight] = useState(30);

  const handleContentSizeChange = (event) => {
    const { contentSize } = event.nativeEvent;
    const newLineCount = Math.ceil(contentSize.height / 20);
    if (newLineCount !== lineCount) {
      setLineCount(newLineCount);
      if (newLineCount > 2) {
        setHeight(90);
      } else if (newLineCount > 1) {
        setHeight(60);
      } else {
        setHeight(30);
      }
    }
  };

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

  // if (!fontLoaded) {
  //   return null; // or a loading spinner
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
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
            <Text style={styles.text}>Bảng tin</Text>
            <Image
              style={styles.footprint}
              source={require("../../assets/images/footprint.png")}
              //resizeMode="contain"
            ></Image>
          </View>

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
                <TouchableOpacity>
                  <Image
                    style={styles.like}
                    source={require("../../assets/icons/like.png")}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("C_StatusLikedList")}
                >
                  <Text style={styles.status_like_comment}>12 Lượt thích</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={styles.comment}
                    source={require("../../assets/icons/comment.png")}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.status_like_comment}>3 Bình luận</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Image
                  style={styles.share}
                  source={require("../../assets/icons/share.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.pinkline}></View>

            {/* BÌNH LUẬN*/}
            <View style={styles.row4}>
              <View style={styles.row5}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người bình luận */}
                  <Image
                    style={styles.avatar40}
                    source={require("../../assets/images/avatar-2.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <View style={styles.comment_name_content}>
                    <TouchableOpacity>
                      {/* Tên người bình luận */}
                      <Text style={styles.comment_name}>Lê Hoàng Sơn</Text>
                    </TouchableOpacity>
                    {/* Nội dung bình luận */}
                    <Text style={styles.comment_content} selectable={true}>
                      Phènnnnnnnnnnnnnnnnnnnnnnn
                    </Text>
                  </View>
                  <View style={styles.row5}>
                    {/* Thời gian đăng */}
                    <Text style={styles.comment_date}>34 phút</Text>

                    <TouchableOpacity>
                      {/* Số người thích bình luận */}
                      <Text style={styles.comment_option}>2 lượt thích</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      {/* Phản hồi bình luận */}
                      <Text style={styles.comment_option}>Phản hồi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                {/* Tùy chọn Status */}
                <Image
                  style={styles.comment_like}
                  source={require("../../assets/icons/liked.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            {/* BÌNH LUẬN*/}

            {/* BÌNH LUẬN*/}
            <View style={styles.row4}>
              <View style={styles.row5}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người bình luận */}
                  <Image
                    style={styles.avatar40}
                    source={require("../../assets/images/avatar-3.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <View style={styles.comment_name_content}>
                    <TouchableOpacity>
                      {/* Tên người bình luận */}
                      <Text style={styles.comment_name}>Võ Thanh Phương</Text>
                    </TouchableOpacity>
                    {/* Nội dung bình luận */}
                    <Text style={styles.comment_content} selectable={true}>
                      Xinh đẹp, tuyệt vời
                    </Text>
                  </View>
                  <View style={styles.row5}>
                    {/* Thời gian đăng */}
                    <Text style={styles.comment_date}>12 phút</Text>

                    <TouchableOpacity>
                      {/* Tên người bình luận */}
                      <Text style={styles.comment_option}>0 lượt thích</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      {/* Tên người bình luận */}
                      <Text style={styles.comment_option}>Phản hồi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                {/* Tùy chọn Status */}
                <Image
                  style={styles.comment_like}
                  source={require("../../assets/icons/like.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            {/* BÌNH LUẬN*/}

            {/* MỜI BÌNH LUẬN*/}

            {/* MỜI BÌNH LUẬN*/}
          </View>
        </View>
        {/* NỘI DUNG MỘT STATUS */}
      </ScrollView>
      {/* MỜI BÌNH LUẬN*/}
      <View style={styles.mycomment}>
        <View style={styles.row7}>
          <TouchableOpacity>
            {/* Ảnh đại diện của tôi */}
            <Image
              style={styles.avatar40}
              source={require("../../assets/images/myavatar.png")}
            ></Image>
          </TouchableOpacity>
          <View
            style={
              value ? styles.comment_textfield : styles.comment_textfield_full
            }
          >
            <View style={styles.row6}>
              <TextInput
                style={StyleSheet.flatten([
                  styles.comment_textinput,
                  { height: height },
                ])}
                placeholder="Viết bình luận của bạn..."
                value={value}
                onChangeText={setValue}
                multiline={true}
                onContentSizeChange={handleContentSizeChange}
              ></TextInput>
              <View style={styles.row2}>
                {/* Icon Image */}
                <TouchableOpacity>
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/image.png")}
                  ></Image>
                </TouchableOpacity>

                {/* Icon Emoji */}
                <TouchableOpacity>
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/emoji.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {value && (
            <TouchableOpacity>
              {/* Icon Send */}
              <Image
                style={styles.comment_send}
                source={require("../../assets/icons/send.png")}
              ></Image>
            </TouchableOpacity>
          )}
        </View>

        {/* BÌNH LUẬN*/}
      </View>
    </KeyboardAvoidingView>
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
  },

  row2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#A51A29",
    fontFamily: "lexend-medium",
    marginLeft: "6%",
    marginTop: -48,
  },
  footprint: {
    width: 38,
    height: 32,
    marginTop: -48,
  },
  newsfeed: {
    // backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  status: {
    backgroundColor: "white",
    width: "90%",
    //height: 352,
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
    //transform: [{ scale: this.state.scaleValue }],
  },
  status_like_comment: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "lexend-regular",
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
  pinkline: {
    backgroundColor: "#FCAC9E",
    width: "90%",
    height: 1,
    margin: 12,
    //marginBottom: 12,
  },
  row4: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  row5: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 4,
  },
  avatar40: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginLeft: 16,
  },
  comment_like: {
    width: 18,
    height: 18,
    marginRight: 16,
    marginTop: 24,
  },
  comment_name: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "lexend-semibold",
  },
  comment_date: {
    fontSize: 12,
    color: "#878080",
    fontFamily: "lexend-light",
    margin: 4,
    marginTop: -8,
  },
  comment_option: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "lexend-regular",
    margin: 4,
    marginTop: -8,
    paddingLeft: 4,
  },
  comment_content: {
    fontSize: 16,
    //color: "#878080",
    fontFamily: "SF-Pro-Display",
    textAlign: "left",
    alignSelf: "flex-start",
    //marginLeft: 8,
    marginRight: 8,
    //marginBottom: 8,
  },
  comment_name_content: {
    backgroundColor: "#EFEBEB",
    padding: 4,
    paddingLeft: 8,
    borderRadius: 12,
  },
  greyline: {
    backgroundColor: "#E4E3E3",
    width: "90%",
    height: 1,
    margin: 12,
    //marginBottom: 12,
  },
  mycomment: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    //flex: 1,
    //justifyContent: "flex-end",
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  comment_textfield: {
    backgroundColor: "#EFEBEB",
    width: "70%",
    // padding: 4,
    paddingLeft: 4,
    borderRadius: 12,
  },
  comment_textfield_full: {
    backgroundColor: "#EFEBEB",
    width: "80%",
    // padding: 4,
    paddingLeft: 4,
    borderRadius: 12,
  },
  comment_placeholder: {
    fontSize: 16,
    color: "#878080",
    fontFamily: "lexend-light",
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 16,
    //marginBottom: 8,
  },
  comment_media: {
    width: 24,
    height: 24,
    margin: 4,
    marginTop: 0,
    paddingLeft: 4,
  },
  comment_send: {
    width: 30,
    height: 30,
    //marginRight: 8,
    marginLeft: 16,
    //marginTop: 24,
  },
  comment_textinput: {
    width: 200,
    fontSize: 16,
    // backgroundColor: "black",
  },

  row6: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingTop: 4,
    // paddingBottom: 4,
    alignItems: "center",
  },
  row7: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    //paddingTop: 10,
    //paddingBottom: 4,
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
    // backgroundColor: "black",
  },
});
