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
  Platform,
  Dimensions,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import Constants from "expo-constants";
import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import {
  useNavigation,
  useScrollToTop,
  useRoute,
} from "@react-navigation/native";
import * as Font from "expo-font";

import { useSwipe } from "../../hooks/useSwipe";
import { AntDesign } from "@expo/vector-icons";

import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Permissions } from "expo-permissions";
import * as FileSystem from "expo-file-system";

import { database } from "../../firebase";
import { onValue, ref, get, set, push } from "firebase/database";
import getStatusInfo from "../../firebase_functions/getStatusInfo";
import moment from "moment";

export default function C_StatusScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [fontLoaded, setFontLoaded] = useState(false);

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  const [statusInfo, setStatusInfo] = useState(null);
  const [commentedUsers, setCommentedUsers] = useState([]);

  const fetchPost = async () => {
    const postId = route?.params?.postId;
    if (postId) {
      getStatusInfo(postId)
        .then((info) => {
          setStatusInfo(info);
          setCommentedUsers(info.commentedUsers);
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    fetchPost();
  }, [route?.params?.postId]);

  const isLiked =
    statusInfo &&
    statusInfo.likedUsers &&
    statusInfo.likedUsers.some((user) => user.userId === "10"); //ID NGƯỜI DÙNG CHÍNH THỨC

  const handleLikePost = async (postId, isLiked) => {
    try {
      const userId = 10; // Thay thế bằng ID người dùng thực tế
      if (isLiked) {
        // Unlike the post
        const likesSnapshot = await get(
          ref(database, `like/${postId}/${userId}`)
        );
        const likesData = likesSnapshot.val();

        for (const commentId in likesData) {
          if (commentId === "0") {
            await set(
              ref(database, `like/${postId}/${userId}/${commentId}`),
              null
            );
          }
        }
      } else {
        // Like the post
        const likeData = {
          date: moment().format("DD-MM-YYYY HH:mm:ss"),
        };
        await set(ref(database, `like/${postId}/${userId}/0`), likeData);
      }

      // Fetch bài viếty để cập nhật giao diện
      fetchPost();
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const scrollViewRef = useRef(null);

  const handleCommentSubmit = async (postId) => {
    // Tạo một comment id mới
    let newCommentId = 1;
    const commentsSnapshot = await get(ref(database, `comment`));
    const commentsData = commentsSnapshot.val();
    if (commentsData) {
      const commentIds = Object.keys(commentsData);
      const maxCommentId = Math.max(...commentIds.map(Number));
      newCommentId = maxCommentId + 1;
    }

    // Tạo dữ liệu mới cho comment
    const newCommentData = {
      user_id: 10,
      content: value,
      date: moment().format("DD-MM-YYYY HH:mm:ss"),
      comment_id: 0, // Comment cha, nếu có
      post_id: postId,
    };

    // Update vào database
    await set(ref(database, `comment/${newCommentId}`), newCommentData);

    // Reset giá trị value
    setValue("");

    // Thực hiện các bước cần thiết sau khi cập nhật bình luận, ví dụ:
    // 1. Làm mới danh sách bình luận
    // 2. Cập nhật giao diện để hiển thị bình luận mới

    // Ví dụ: Sử dụng fetchPost() để làm mới danh sách bình luận
    await fetchPost();

    // Cuộn xuống dưới cùng
    scrollViewRef.current.scrollToEnd();
  };

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPost();
    setRefreshing(false);
  };

  function onSwipeLeft() {
    //navigation.goBack();
  }

  function onSwipeRight() {
    navigation.popToTop();
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

  const textInputRef = useRef(null);

  const onPressInHandler = () => {
    textInputRef.current.focus();
  };

  //Chọn ảnh
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
  //Chọn ảnh

  //Pop up ảnh
  const [modalVisible, setModalVisible] = useState(false);

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
        const asset = await MediaLibrary.createAssetAsync(
          require("../../assets/images/status-1.png")
        );

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
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.popToTop()}>
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

          {statusInfo && (
            <View style={styles.status}>
              <View style={styles.row}>
                <View style={styles.row2}>
                  <TouchableOpacity>
                    {/* Ảnh đại diện người đăng */}
                    <Image
                      style={styles.avatar50}
                      source={{ uri: statusInfo.userAvatar }}
                    ></Image>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity>
                      {/* Tên người đăng */}
                      <Text style={styles.status_name}>
                        {statusInfo.userName}
                      </Text>
                    </TouchableOpacity>
                    {/* Thời gian đăng */}
                    <Text style={styles.status_date}>
                      {statusInfo.formattedDate}
                    </Text>
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
                {statusInfo.content}
              </Text>

              {/* Ảnh / Video Status */}
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  style={styles.status_image}
                  source={{ uri: statusInfo.media }}
                />
              </TouchableOpacity>

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
                      source={require("../../assets/icons/close.png")}
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
                      source={require("../../assets/icons/dots.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>

                  {/* Hình ảnh sẽ hiển thị trong Modal */}
                  <Image
                    source={{ uri: statusInfo.media }}
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

              {/* Like / Comment / Share */}
              <View style={styles.row}>
                <View style={styles.row2}>
                  {statusInfo.likedUsers && (
                    <TouchableOpacity
                      onPress={() => handleLikePost(statusInfo.postId, isLiked)}
                    >
                      <Image
                        style={styles.like}
                        source={
                          isLiked
                            ? require("../../assets/icons/liked.png")
                            : require("../../assets/icons/like.png")
                        }
                      ></Image>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => navigation.navigate("C_StatusLikedList")}
                  >
                    <Text style={styles.status_like_comment}>
                      {statusInfo.likeCount} Lượt thích
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPressIn={onPressInHandler}>
                    <Image
                      style={styles.comment}
                      source={require("../../assets/icons/comment.png")}
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity onPressIn={onPressInHandler}>
                    <Text style={styles.status_like_comment}>
                      {statusInfo.commentCount} Bình luận
                    </Text>
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
              {commentedUsers.map((commentedUser) => (
                <View style={styles.row4} key={commentedUser.commentId}>
                  <View style={styles.row5}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("C_Profile")}
                    >
                      {/* Ảnh đại diện người bình luận */}
                      <Image
                        style={styles.avatar40}
                        source={{ uri: commentedUser.userAvatar }}
                      ></Image>
                    </TouchableOpacity>
                    <View>
                      <View style={styles.comment_name_content}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("C_Profile")}
                        >
                          {/* Tên người bình luận */}
                          <Text style={styles.comment_name}>
                            {commentedUser.userName}
                          </Text>
                        </TouchableOpacity>
                        {/* Nội dung bình luận */}
                        <Text style={styles.comment_content} selectable={true}>
                          {commentedUser.content}
                        </Text>
                      </View>
                      <View style={styles.row5}>
                        {/* Thời gian đăng */}
                        <Text style={styles.comment_date}>
                          {commentedUser.formattedDate}
                        </Text>

                        <TouchableOpacity>
                          {/* Số người thích bình luận */}
                          <Text style={styles.comment_option}>
                            {commentedUser.likeCount} lượt thích
                          </Text>
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
              ))}
              {/* BÌNH LUẬN*/}
            </View>
          )}
        </View>
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
              <View style={{ width: "72%" }}>
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
                  ref={textInputRef}
                  onSubmitEditing={() => Keyboard.dismiss()}
                >
                  {/* {showEmojiBoard && (
                    <EmojiBoard
                      onEmojiSelected={onEmojiSelected}
                      containerStyle={styles.emoji_board}
                    />
                  )} */}
                </TextInput>
                {isSelected && (
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      margin: 12,
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 12,
                      }}
                    />
                    <TouchableOpacity
                      onPress={removeImage}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.row2}>
                {/* Icon Image */}
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/image.png")}
                  ></Image>
                </TouchableOpacity>

                {/* Icon Emoji */}
                <TouchableOpacity
                // onPress={toggleEmojiBoard}
                >
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/emoji.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {value && (
            <TouchableOpacity
              onPress={() => handleCommentSubmit(statusInfo.postId)}
            >
              {/* Icon Send */}
              <Image
                style={styles.comment_send}
                source={require("../../assets/icons/send.png")}
              ></Image>
            </TouchableOpacity>
          )}
        </View>

        {/* MỜI BÌNH LUẬN*/}
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
    borderRadius: 50,
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
    borderRadius: 50,
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
    width: "92%",
    //marginBottom: 8,
  },
  comment_name_content: {
    backgroundColor: "#EFEBEB",
    padding: 4,
    paddingLeft: 8,
    borderRadius: 12,
    width: "90%",
  },
  greyline: {
    backgroundColor: "#E4E3E3",
    width: "90%",
    height: 1,
    margin: 12,
    //marginBottom: 12,
  },
  mycomment: {
    position: "relative",
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
    //width: "72%",
    fontSize: 16,
    margin: 8,
    fontFamily: "lexend-regular",
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
  image_option: {
    fontSize: 16,
    fontFamily: "lexend-regular",
    color: "#A51A29",
  },
});
