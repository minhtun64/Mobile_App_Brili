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
  Dimensions,
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
import { AntDesign } from "@expo/vector-icons";

export default function C_ProfileScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [iconStatus, setIconStatus] = useState(false);

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  const [showPetInfo, setShowPetInfo] = useState(false);

  const openPetInfo = () => setShowPetInfo(true);
  const closePetInfo = () => setShowPetInfo(false);

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

  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container}>
      {/* heading */}
      <View style={styles.heading}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.back}
              source={require("../../assets/icons/chevron-left.png")}
            ></Image>
          </TouchableOpacity>
          <Text style={styles.text}>Lê Hoàng Sơn</Text>
          <TouchableOpacity onPress={() => navigation.navigate("C_Status")}>
            <Image
              style={styles.search}
              source={require("../../assets/icons/search.png")}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 142,
          }}
        >
          <Image
            source={require("../../assets/images/wallpaper-1.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="contain"
          />
          <TouchableOpacity style={{ position: "absolute", top: 4, right: 4 }}>
            <AntDesign name="ellipsis1" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Image
            style={styles.avatar100}
            source={require("../../assets/images/avatar-2.png")}
          ></Image>
        </TouchableOpacity>
        <View style={styles.row4}>
          <TouchableOpacity style={styles.chat_border}>
            <Image
              style={styles.chat}
              source={require("../../assets/icons/chat.png")}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.follow_button}>
            <Text style={styles.follow_text}>Theo dõi</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={styles.account_name}>Lê Hoàng Sơn</Text>
          <Text style={styles.account_bio}>
            The cashier of the memory bank!
          </Text>
          {/* Like / Comment / Share */}
          <View style={styles.row3}>
            <TouchableOpacity
              onPress={() => navigation.navigate("C_FollowingList")}
            >
              <View style={styles.row3}>
                <Text style={styles.following_count}>3.404</Text>
                <Text style={styles.following_count_text}> Đang theo dõi</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("C_FollowedList")}
            >
              <View style={styles.row3}>
                <Text style={styles.followed_count}>422</Text>
                <Text style={styles.followed_count_text}> Người theo dõi</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pet_frame}>
          <View style={styles.row3}>
            <TouchableOpacity
              style={{
                marginRight: 8,
                marginLeft: 8,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Image
                style={styles.pet_img}
                source={require("../../assets/images/pet-1-1.png")}
              ></Image>
              <View
                style={StyleSheet.flatten([
                  styles.row3,
                  {
                    alignSelf: "center",
                    backgroundColor: "#ffffff",
                    paddingTop: 4,
                    marginTop: 8,
                    padding: 4,
                    borderRadius: 12,
                  },
                ])}
              >
                <Image
                  style={StyleSheet.flatten([
                    styles.chat,
                    {
                      marginRight: 4,
                    },
                  ])}
                  source={require("../../assets/images/icon-hamster.png")}
                ></Image>
                <Text
                  style={{
                    fontFamily: "lexend-regular",
                  }}
                >
                  Bé dâu
                </Text>
              </View>
            </TouchableOpacity>

            {/* Pop up */}
            <Modal
              // animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                {/* Hình ảnh sẽ hiển thị trong Modal */}
                <View
                  style={{
                    width: "100%",
                    height: 300,
                    backgroundColor: "#FFF6F6",
                    marginTop: -40,
                    borderRadius: 24,
                  }}
                >
                  {/* Icon để đóng Modal */}
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 28,
                      right: 20,
                      zIndex: 1,
                    }}
                    onPress={() => {
                      closePetInfo();
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      source={require("../../assets/icons/close-red.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>

                  {/* Icon Chuyển trái/phải */}
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 150,
                      left: 4,
                      zIndex: 1,
                    }}
                    onPress={() => {
                      closePetInfo();
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      source={require("../../assets/icons/arrow-left.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 150,
                      right: 4,
                      zIndex: 1,
                    }}
                    onPress={() => {
                      closePetInfo();
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      source={require("../../assets/icons/arrow-right.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>

                  <View style={styles.row7}>
                    <View
                      style={{
                        width: 220,
                        height: 200,
                        backgroundColor: "#ffffff",
                        borderRadius: 12,
                        marginRight: 16,
                      }}
                    >
                      <Text style={styles.pet_name}>Bé Dâu</Text>
                      <View style={styles.row3}>
                        <Text style={styles.pet_pro}>Loài: </Text>
                        <Text style={styles.pet_pro_val}>Hamster</Text>
                      </View>
                      <View style={styles.row3}>
                        <Text style={styles.pet_pro}>Giống: </Text>
                        <Text style={styles.pet_pro_val}>Winter White</Text>
                      </View>
                      <View style={styles.row3}>
                        <Text style={styles.pet_pro}>Giới tính: </Text>
                        <Text style={styles.pet_pro_val}>Cái</Text>
                      </View>
                      <View style={styles.row3}>
                        <Text style={styles.pet_pro}>Tuổi: </Text>
                        <Text style={styles.pet_pro_val}>1</Text>
                      </View>
                      <View style={styles.row3}>
                        <Text style={styles.pet_pro}>Cân nặng: </Text>
                        <Text style={styles.pet_pro_val}>0.3 kg</Text>
                      </View>
                      <View style={styles.row3}>
                        <Text style={styles.pet_pro}>Màu lông: </Text>
                        <Text style={styles.pet_pro_val}>Xám trắng</Text>
                      </View>
                    </View>
                    <Image
                      style={styles.pet_img}
                      source={require("../../assets/images/pet-1-1.png")}
                    ></Image>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            <TouchableOpacity
              style={{
                marginRight: 8,
                marginLeft: 8,
              }}
            >
              <Image
                style={styles.pet_img}
                source={require("../../assets/images/pet-1-1.png")}
              ></Image>
              <View
                style={StyleSheet.flatten([
                  styles.row3,
                  {
                    alignSelf: "center",
                    backgroundColor: "#ffffff",
                    paddingTop: 4,
                    marginTop: 8,
                    padding: 4,
                    borderRadius: 12,
                  },
                ])}
              >
                <Image
                  style={StyleSheet.flatten([
                    styles.chat,
                    {
                      marginRight: 4,
                    },
                  ])}
                  source={require("../../assets/images/icon-hamster.png")}
                ></Image>
                <Text
                  style={{
                    fontFamily: "lexend-regular",
                  }}
                >
                  Bé dâu
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* BÀI VIẾT */}
        <View style={styles.newsfeed}>
          <View style={styles.row5}>
            <Text style={styles.text}>Bài viết</Text>
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
            <View style={styles.row6}>
              <View style={styles.row5}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người đăng */}
                  <Image
                    style={styles.avatar50}
                    source={require("../../assets/images/avatar-2.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity>
                    {/* Tên người đăng */}
                    <Text style={styles.status_name}>Lê Hoàng Sơn</Text>
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
            <View style={styles.row6}>
              <View style={styles.row5}>
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
            <View style={styles.row6}>
              <View style={styles.row5}>
                <TouchableOpacity>
                  {/* Ảnh đại diện người đăng */}
                  <Image
                    style={styles.avatar50}
                    source={require("../../assets/images/avatar-2.png")}
                  ></Image>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity>
                    {/* Tên người đăng */}
                    <Text style={styles.status_name}>Lê Hoàng Sơn</Text>
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
            <View style={styles.row6}>
              <View style={styles.row5}>
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
        {/* BÀI VIẾT */}
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
    height: "12%",
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
    width: 24,
    height: 24,
    marginLeft: 4,
    // marginTop: 4,
  },
  text: {
    fontSize: 18,
    color: "#A51A29",
    fontFamily: "lexend-medium",
    marginLeft: "6%",
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
  row6: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row5: {
    //width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    //paddingLeft: "6%",
    paddingBottom: 4,
    // backgroundColor: "black",
    alignItems: "center",
  },
  row3: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    // paddingBottom: 10,
    alignItems: "center",
  },
  row4: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // paddingTop: 10,
    // paddingBottom: 10,
    alignItems: "center",
    marginTop: -40,
  },
  row7: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
    marginTop: 60,
    alignItems: "center",
  },
  avatar40: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginLeft: 16,
  },
  post: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "lexend-medium",
  },
  search_box: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FCAC9E",
    borderRadius: 12,
    width: "76%",
    justifyContent: "center", // căn giữa theo chiều dọc
    // alignItems: "center", // căn giữa theo chiều ngang
  },
  search_input: {
    fontSize: 16,
    fontFamily: "lexend-regular",
  },
  account_name: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  search: {
    width: 35,
    height: 35,
  },
  avatar100: {
    width: 100,
    height: 100,
    marginTop: -46,
    // marginRight: 8,
    marginLeft: 16,
    borderColor: "#FFFFFF",
    borderWidth: 3,
    borderRadius: 50,
  },
  chat_border: {
    borderColor: "#D9D9D9",
    borderWidth: 1,
    padding: 4,
    borderRadius: 50,
  },
  chat: {
    width: 16,
    height: 16,
  },
  follow_button: {
    backgroundColor: "#8F1928",
    borderRadius: 12,
    width: 114,
    height: 25,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
    marginRight: 24,
    marginLeft: 16,
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
  pet_frame: {
    height: 200,
    width: "90%",
    backgroundColor: "#FFF6F6",
    borderRadius: 12,
    alignSelf: "center",
    padding: 16,
    paddingTop: 8,
  },
  pet_img: {
    height: 134,
    width: 100,
    borderRadius: 12,
  },
  pet_name: {
    fontSize: 18,
    color: "#F5817E",
    fontFamily: "lexend-medium",
    alignSelf: "center",
    // marginLeft: "6%",
  },
  pet_pro: {
    // fontSize: 18,
    // color: "#F5817E",
    fontFamily: "lexend-medium",
    // alignSelf: "center",
    marginLeft: 12,
  },
  pet_pro_val: {
    // fontSize: 18,
    // color: "#F5817E",
    fontFamily: "lexend-light",
    // alignSelf: "center",
    // marginLeft: "6%",
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
    backgroundColor: "#FFF6F6",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  status: {
    backgroundColor: "white",
    width: "90%",
    // height: 352,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    paddingBottom: 8,
  },
  avatar50: {
    width: 50,
    height: 50,
    margin: 8,
  },
  following_count: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "lexend-semibold",
  },
  following_count_text: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "lexend-regular",
  },
  followed_count: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "lexend-semibold",
    marginLeft: 24,
  },
  followed_count_text: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "lexend-regular",
  },
  status_option: {
    width: 28,
    height: 28,
    marginRight: 8,
    marginTop: -16,
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
  account_name: {
    fontSize: 24,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  account_bio: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "lexend-light",
  },
  info: {
    // marginTop: 20,
    // marginLeft: 8,
    // marginRight: 8,
    // marginBottom: 16,
    margin: 20,
  },
});
