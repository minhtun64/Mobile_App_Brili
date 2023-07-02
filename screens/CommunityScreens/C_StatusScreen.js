import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
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
  useContext,
} from "react";
import {
  useNavigation,
  useScrollToTop,
  useRoute,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Icon } from "react-native-elements";

import { useSwipe } from "../../hooks/useSwipe";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";

import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Permissions } from "expo-permissions";
import * as FileSystem from "expo-file-system";

import { storage, database } from "../../firebase";
import {
  getDatabase,
  set,
  push,
  ref,
  get,
  onValue,
  onChildAdded,
  update,
  remove,
} from "firebase/database";

import { formatDate } from "../../components/utils";
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";

// import getStatusDetailInfo from "../../firebase_functions/getStatusDetailInfo";
import getStatusInfo from "../../firebase_functions/getStatusInfo";
import moment from "moment";

import { Audio, Video, ResizeMode } from "expo-av";

import { showMessage } from "react-native-flash-message";
import CustomFlashMessage from "../../components/CustomFlashMessage";

import EmojiSelector from "react-native-emoji-selector";
import { Categories } from "react-native-emoji-selector";
import { UserContext } from "../../UserIdContext";

export default function C_StatusScreen({ navigation }) {
  const myUserId = useContext(UserContext).userId;
  const [myAvatar, setMyAvatar] = useState(null);

  // CÀI ĐẶT FONT CHỮ
  const [fontLoaded, setFontLoaded] = useState(false);
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

  // LẤY THAM SỐ ĐƯỢC TRUYỀN TỪ MÀN HÌNH TRƯỚC
  const route = useRoute();
  const postId = route?.params?.postId;
  const [statusInfo, setStatusInfo] = useState({
    userId: route?.params?.userId,
    userName: route?.params?.userName,
    userAvatar: route?.params?.userAvatar,
    content: route?.params?.content,
    media: route?.params?.media,
    mediaType: route?.params?.mediaType,
    formattedDate: route?.params?.formattedDate,
    likeCount: route?.params?.likeCount,
    commentCount: route?.params?.commentCount,
    likedUsers: route?.params?.likedUsers,
    commentedUsers: [],
  });

  const [commentedUsers, setCommentedUsers] = useState([]);
  const [isLiked, setIsLiked] = useState(route?.params?.isLiked);

  //CẬP NHẬT REAL-TIME NỘI DUNG BÌNH LUẬN
  const [numCommentsDisplayed, setNumCommentsDisplayed] = useState(5);
  //    Lấy thông tin người dùng từ Firebase
  const getUserInfo = async (userId) => {
    try {
      const userRef = ref(database, `user/${userId}`);
      let userData;
      await new Promise((resolve) => {
        onValue(userRef, (snapshot) => {
          userData = snapshot.val();
          resolve();
        });
      });
      return userData;
    } catch (error) {
      console.error("Error retrieving user information:", error);
      throw error;
    }
  };
  //    Lắng nghe sự thay đổi của dữ liệu bình luận và lấy thông tin người dùng từ Firebase
  useEffect(() => {
    const userRef = ref(database, `user/${myUserId}`);
    onValue(userRef, async (snapshot) => {
      const userData = snapshot.val();
      setMyAvatar(userData.avatar);
    });

    const commentsRef = ref(database, "comment");
    onValue(commentsRef, async (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsArray = await Promise.all(
          Object.keys(commentsData)
            .filter((commentId) => commentsData[commentId].post_id === postId)
            .map(async (commentId) => {
              const commentData = commentsData[commentId];
              const formattedCommentDate = formatDate(commentData.date);
              const userInfo = await getUserInfo(commentData.user_id);
              const likeRef = ref(database, `like/${commentData.post_id}`);
              const likeSnapshot = await get(likeRef);
              const likeData = likeSnapshot.val();
              let likeCount = 0;
              let isLiked = false;
              const likedUsers = [];
              for (const userId in likeData) {
                const userLikes = likeData[userId];
                for (const likedCommentId in userLikes) {
                  // const likeUserData = await getUserInfo(userId);
                  if (likedCommentId == commentId) {
                    likedUsers.push({
                      userId: userId,
                    });
                    likeCount++;
                    if (userId == myUserId) {
                      isLiked = true;
                    }
                  }
                }
              }
              return {
                commentId,
                userId: commentData.user_id,
                userAvatar: userInfo.avatar,
                userName: userInfo.name,
                content: commentData.content,
                formattedDate: formattedCommentDate,
                likeCount: likeCount,
                media: commentData.media,
                likedUsers: likedUsers,
                isLiked: isLiked,
              };
            })
        );
        setCommentedUsers(commentsArray);
      }
    });
  }, [postId]);
  const handleLoadPreviousComments = () => {
    setNumCommentsDisplayed(numCommentsDisplayed + 5);
  };

  // CUỘN XUỐNG ĐỂ CẬP NHẬT THÔNG TIN STATUS (KHÔNG REAL-TIME)
  const scrollViewRef = useRef(null);
  const fetchPost = async () => {
    if (postId) {
      getStatusInfo(postId)
        .then((info) => {
          setStatusInfo(info);
        })
        .catch((error) => console.log(error));
      setIsLiked(
        statusInfo.likedUsers.some((user) => user.userId === myUserId)
      );
    }
  };
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPost();
    setRefreshing(false);
  };
  useEffect(() => {
    handleRefresh();
  }, [postId]);

  // XỬ LÝ LIKE BÀI VIẾT
  const handleLikePost = async (postId, isLiked) => {
    try {
      if (isLiked) {
        // Unlike the post
        const likesSnapshot = await get(
          ref(database, `like/${postId}/${myUserId}`)
        );
        const likesData = likesSnapshot.val();
        for (const commentId in likesData) {
          if (commentId === "post") {
            await set(
              ref(database, `like/${postId}/${myUserId}/${commentId}`),
              null
            );
          }
        }
        setIsLiked(false);
        setStatusInfo((prevStatusInfo) => ({
          ...prevStatusInfo,
          likeCount: prevStatusInfo.likeCount - 1,
        }));
      } else {
        // Like bài viết
        const likeData = {
          date: moment().format("DD-MM-YYYY HH:mm:ss"),
        };
        await set(ref(database, `like/${postId}/${myUserId}/post`), likeData);
        // Phát âm thanh khi nhấn like
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(
          require("../../assets/soundeffects/like-sound.mp3")
        );
        await soundObject.playAsync();
        setIsLiked(true);
        setStatusInfo((prevStatusInfo) => ({
          ...prevStatusInfo,
          likeCount: prevStatusInfo.likeCount + 1,
        }));
      }
      handleRefresh();
      if (isLiked) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  // XỬ LÝ COMMENT BÀI VIẾT
  const handleCommentSubmit = async (postId) => {
    let newCommentId = 1;
    const commentsSnapshot = await get(ref(database, "comment"));
    const commentsData = commentsSnapshot.val();
    if (commentsData) {
      const commentIds = Object.keys(commentsData);
      const maxCommentId = Math.max(...commentIds.map(Number));
      newCommentId = maxCommentId + 1;
    }
    const newCommentData = {
      user_id: myUserId,
      content: value,
      date: moment().format("DD-MM-YYYY HH:mm:ss"),
      post_id: postId,
      media: "",
    };
    if (isSelected) {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageReference = storageRef(
        storage,
        `Comment_Images/${newCommentId}`
      );
      try {
        await uploadBytes(storageReference, blob);
        const url = await getDownloadURL(storageReference);
        newCommentData.media = url;
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
    await set(ref(database, `comment/${newCommentId}`), newCommentData);
    setValue("");
    setIsSelected(false);
    setShowEmojiSelector(false);
    scrollViewRef.current.scrollToEnd();
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(
        require("../../assets/soundeffects/comment-sound.mp3")
      );
      await soundObject.playAsync();
    } catch (error) {
      console.log("Error playing comment sound:", error);
    }
  };

  // XỬ LÝ CÁC THAO TÁC QUẸT MÀN HÌNH
  const panResponder = useSwipe(
    () => {
      // console.log("swiped left")
    },
    () => navigation.goBack(),
    () => {
      // console.log("swiped up")
    },
    () => {
      // console.log("swiped down")
    }
  );

  // TĂNG CHIỀU DÀI TEXTINPUT KHI NHẬP NHIỀU KÍ TỰ
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

  // XỬ LÝ LIKE BÌNH LUẬN
  const handleLikeComment = async (commentId, isLiked) => {
    const likeRef = ref(database, `like/${postId}/${myUserId}/${commentId}`);
    const likeSnapshot = await get(likeRef);
    if (isLiked) {
      // Hủy thích bình luận
      await remove(likeRef);
      // Cập nhật trạng thái "isLiked" thành false
      setCommentedUsers((prevState) =>
        prevState.map((comment) => {
          if (comment.commentId === commentId) {
            const updatedLikedUsers = comment.likedUsers.filter(
              (likedUser) => likedUser.userId !== myUserId
            );
            return {
              ...comment,
              isLiked: false,
              likeCount: comment.likeCount - 1,
              likedUsers: updatedLikedUsers,
            };
          }
          return comment;
        })
      );
    } else {
      // Thích bình luận
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(
        require("../../assets/soundeffects/like-sound.mp3")
      );
      await soundObject.playAsync();
      const likeData = {
        date: moment().format("DD-MM-YYYY HH:mm:ss"),
      };
      await set(likeRef, likeData);
      // Cập nhật trạng thái "isLiked" thành true
      setCommentedUsers((prevState) =>
        prevState.map((comment) => {
          if (comment.commentId === commentId) {
            const updatedLikedUsers = [
              ...comment.likedUsers,
              {
                userId: myUserId,
              },
            ];
            return {
              ...comment,
              isLiked: true,
              likeCount: comment.likeCount + 1,
              likedUsers: updatedLikedUsers,
            };
          }
          return comment;
        })
      );
    }
  };

  // TỰ ĐỘNG MỞ KEYBOARD NHẬP BÌNH LUẬN
  const textInputRef = useRef(null);
  const onPressInHandler = () => {
    textInputRef.current.focus();
  };

  // CHỌN/XÓA ẢNH TRONG KHI COMMENT
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

  // POPUP ẢNH
  const [modalVisible, setModalVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const openOptions = () => setShowOptions(true);
  const closeOptions = () => setShowOptions(false);

  // LƯU ẢNH VỀ MÁY
  const SaveImage = async () => {
    try {
      // Yêu cầu quyền truy cập thư viện
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        // Tải ảnh từ URL
        const { uri } = await FileSystem.downloadAsync(
          statusInfo.media,
          FileSystem.cacheDirectory + "temp_image.jpg"
        );
        // Tạo đối tượng từ file ảnh đã tải
        const asset = await MediaLibrary.createAssetAsync(uri);
        // Lưu vào thư viện
        if (asset) {
          await MediaLibrary.createAlbumAsync("YourAlbumName", asset, false);
          console.log("Ảnh đã được lưu thành công.");
          // Đóng Lựa chọn
          setShowOptions(false);
          // Hiển thị thông báo lưu thành công
          showMessage({
            message: "Lưu thành công!",
            type: "success",
            duration: 3000,
            floating: true,
            position: "bottom",
            titleStyle: {
              fontSize: 18,
              textAlign: "center",
            },
            textStyle: {
              fontSize: 16,
              textAlign: "center",
            },
            titleAlign: "center",
            titleNumberOfLines: 1,
            // Thêm các thuộc tính khác tùy chọn
            renderCustomContent: () => {
              return (
                <View style={styles.customContent}>
                  <Icon
                    name="check"
                    type="font-awesome"
                    size={24}
                    color="#fff"
                  />
                </View>
              );
            },
          });
        }
      } else {
        console.log("Quyền truy cập thư viện bị từ chối.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // CHIA SẺ ẢNH
  const ShareImage = async () => {
    //
  };

  // CHỌN EMOJI
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

  //VIDEO
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  //QUAY LẠI
  const handleGoBack = () => {
    const previousRoute = navigation
      .dangerouslyGetState()
      .routes.slice(-2, -1)[0];

    if (previousRoute && previousRoute.name === "C_Profile") {
      navigation.goBack("C_Profile");
    } else {
      navigation.goBack();
    }
  };

  // Thêm state để lưu trữ thông tin bình luận hiện tại
  const [modalVisible2, setModalVisible2] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  // Hàm xử lý khi nhấn vào icon Option
  const handleOptionPress = (comment) => {
    setCurrentComment(comment);
    if (comment.media) {
      setEditImage(comment.media);
      setIsSelectedEditImage(true);
    }

    if (comment.content) {
      setEditContent(comment.content);
    }
    setModalVisible2(true);
  };

  // Hàm xử lý khi nhấn vào nút "Chỉnh sửa bình luận" trong modal
  const handleEditComment = () => {
    // Đóng modal chỉnh sửa
    setModalVisible2(false);
    // Hiển thị modal nội dung bình luận để chỉnh sửa
    setEditModalVisible(true);
  };

  const handleDeleteComment = () => {
    setModalVisible2(false);
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const [showSnackbar2, setShowSnackbar2] = useState(false);
  const handleConfirmDelete = async () => {
    // Xóa bình luận khỏi Firebase
    const commentRef = ref(database, `comment/${currentComment.commentId}`);
    // const likeRef = ref(database, `like/${currentPost.postId}`);
    try {
      await remove(commentRef);
      // await remove(likeRef);

      // Xóa ảnh từ storage (nếu có)
      if (currentComment.media) {
        const storageReference = storageRef(
          storage,
          `Comment_Images/${currentComment.commentId}`
        );
        // await deleteObject(storageReference);
      }

      // Đóng modal xóa bình luận
      setDeleteModalVisible(false);
      handleRefresh();
      // Hiển thị snackbar thành công
      setShowSnackbar2(true);
      setTimeout(() => setShowSnackbar2(false), 2000); // Hide snackbar after 2 seconds
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  //CHỈNH SỬA BÌNH LUẬN
  const [showSnackbar1, setShowSnackbar1] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [media, setMedia] = useState("");
  const handleUpdateComment = async () => {
    console.log(editImage);
    if (
      currentComment.content === editContent &&
      currentComment.media === editImage
    ) {
      // Nếu không có thay đổi nội dung và phương tiện, không thực hiện cập nhật
      console.log("Không cập nhật");
      setEditModalVisible(false);
      return;
    }

    const updatedCommentRef = ref(
      database,
      `comment/${currentComment.commentId}`
    );

    const { commentId, content, media } = currentComment;
    const updatedCommentData = { commentId, content: editContent, media };
    console.log(updatedCommentData);
    if (currentComment.media != editImage) {
      if (isSelectedEditImage) {
        console.log("Đã chọn ảnh");
        const response = await fetch(editImage);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Comment_Images/${currentComment.commentId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          updatedCommentData.media = url;
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      } else {
        const storageReference = storageRef(
          storage,
          `Comment_Images/${currentComment.commentId}`
        );
        try {
          await deleteObject(storageReference);
          updatedCommentData.media = null;
        } catch (error) {
          console.log("Error deleting image:", error);
        }
      }
    }
    try {
      await update(updatedCommentRef, updatedCommentData);
      console.log("Bình luận đã được cập nhật thành công");
      // Tiến hành cập nhật thành công, bạn có thể thực hiện các hành động khác
      // Hiển thị snackbar thành công
      setShowSnackbar1(true);
      setTimeout(() => setShowSnackbar1(false), 2000); // Hide snackbar after 2 seconds
    } catch (error) {
      console.log("Lỗi khi cập nhật bình luận:", error);
      // Xử lý lỗi khi cập nhật bình luận
    }

    setEditModalVisible(false);
  };

  // CHỌN/XÓA ẢNH
  const [editImage, setEditImage] = useState("");
  const [isSelectedEditImage, setIsSelectedEditImage] = useState(false);
  const pickEditImage = async () => {
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
      setIsSelectedEditImage(true);
      setEditImage(result.assets[0].uri);
    }
  };
  const removeEditImage = () => {
    setIsSelectedEditImage(false);
    setEditImage(null);
  };

  if (!fontLoaded) {
    return null;
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
        // onScroll={handleScroll}
        // scrollEventThrottle={16}
        style={styles.content}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        {...panResponder.panHandlers}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Nút quay lại */}
        <TouchableOpacity
          // onPress={() => navigation.popToTop()}
          onPress={() => navigation.popToTop()}
          // onPress={() => handleGoBack()}
        >
          <Image
            style={styles.back}
            source={require("../../assets/icons/back.png")}
          ></Image>
        </TouchableOpacity>
        <View style={styles.newsfeed}>
          <View style={styles.row2}>
            <Text style={styles.text}>Bài viết</Text>
            <Image
              style={styles.footprint}
              source={require("../../assets/images/footprint.png")}
              //resizeMode="contain"
            ></Image>
          </View>

          {statusInfo && (
            <View style={styles.status}>
              {/* PHẦN BÀI ĐĂNG*/}
              <View style={styles.row}>
                <View style={styles.row2}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("C_Profile", {
                        userId: statusInfo.userId,
                      })
                    }
                  >
                    {/* Avatar người đăng */}
                    <Image
                      style={styles.avatar50}
                      source={{ uri: statusInfo.userAvatar }}
                    ></Image>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("C_Profile", {
                          userId: statusInfo.userId,
                        })
                      }
                    >
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
                  {/* Tùy chọn */}
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
              {/* Ảnh/Video Status */}
              {statusInfo.media && (
                <View>
                  {statusInfo.mediaType == "image" ? (
                    <View>
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
                            backgroundColor: showOptions
                              ? "rgba(0,0,0,0.5)"
                              : "white",
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
                            // progressiveRenderingEnabled={true}
                          />
                          {/* Thông báo */}
                          <CustomFlashMessage />
                        </TouchableOpacity>

                        {/* Bottom popup */}
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
                              <Text style={styles.image_option}>
                                Chia sẻ ảnh
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </Modal>
                    </View>
                  ) : (
                    <TouchableOpacity>
                      <Video
                        style={styles.status_video}
                        source={{ uri: statusInfo.media }}
                        ref={video}
                        resizeMode="cover"
                        shouldPlay={true}
                        isLooping={true}
                        useNativeControls
                        // isMuted
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={(status) =>
                          setStatus(() => status)
                        }
                      />
                      {/* <View>
                          <Button
                            title={status.isPlaying ? "Pause" : "Play"}
                            onPress={() =>
                              status.isPlaying
                                ? video.current.pauseAsync()
                                : video.current.playAsync()
                            }
                          />
                        </View> */}
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Like / Comment / Share */}
              <View style={styles.row}>
                <View style={styles.row2}>
                  {statusInfo.likedUsers && (
                    <TouchableOpacity
                      onPress={() => handleLikePost(postId, isLiked)}
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
                  {statusInfo.likeCount !== 0 ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("C_StatusLikedList", {
                          likedUsers: statusInfo.likedUsers,
                        })
                      }
                    >
                      <Text style={styles.status_like_comment}>
                        {statusInfo.likeCount} Lượt thích
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <Text style={styles.status_like_comment}>
                        {statusInfo.likeCount} Lượt thích
                      </Text>
                    </View>
                  )}

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
              {/* PHẦN BÀI ĐĂNG*/}
              {/* PHẦN BÌNH LUẬN*/}
              {numCommentsDisplayed < commentedUsers.length && (
                <TouchableOpacity onPress={handleLoadPreviousComments}>
                  <Text style={styles.pre_cmt_text}>
                    Xem các bình luận trước...
                  </Text>
                </TouchableOpacity>
              )}
              {commentedUsers
                .slice(-numCommentsDisplayed)
                .map((commentedUser) => (
                  <TouchableOpacity
                    onLongPress={() => handleOptionPress(commentedUser)}
                    style={styles.row4}
                    key={commentedUser.commentId}
                  >
                    <View style={styles.row5}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("C_Profile", {
                            userId: commentedUser.userId,
                          })
                        }
                      >
                        {/* Avatar người bình luận */}
                        <Image
                          style={styles.avatar40}
                          source={{ uri: commentedUser.userAvatar }}
                        ></Image>
                      </TouchableOpacity>
                      <View>
                        <View style={styles.comment_name_content}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("C_Profile", {
                                userId: commentedUser.userId,
                              })
                            }
                          >
                            {/* Tên người bình luận */}
                            <Text style={styles.comment_name}>
                              {commentedUser.userName}
                            </Text>
                          </TouchableOpacity>
                          {/* Nội dung bình luận */}
                          <Text
                            style={styles.comment_content}
                            selectable={true}
                          >
                            {commentedUser.content}
                          </Text>
                          {commentedUser.media && (
                            <Image
                              source={{ uri: commentedUser.media }}
                              style={{
                                width: 160,
                                height: 160,
                                borderRadius: 12,
                                margin: 8,
                              }}
                            />
                          )}
                        </View>
                        <View style={styles.row5}>
                          {/* Thời gian bình luận */}
                          <Text style={styles.comment_date}>
                            {commentedUser.formattedDate}
                          </Text>

                          {commentedUser.likeCount !== 0 ? (
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("C_StatusLikedList", {
                                  likedUsers: commentedUser.likedUsers,
                                })
                              }
                            >
                              {/* Số người thích bình luận */}
                              <Text style={styles.comment_option}>
                                {commentedUser.likeCount} lượt thích
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View>
                              {/* Số người thích bình luận */}
                              <Text style={styles.comment_option}>
                                {commentedUser.likeCount} lượt thích
                              </Text>
                            </View>
                          )}

                          <TouchableOpacity onPressIn={onPressInHandler}>
                            {/* Phản hồi bình luận */}
                            <Text style={styles.comment_option}>Phản hồi</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleLikeComment(
                          commentedUser.commentId,
                          commentedUser.isLiked
                        )
                      }
                    >
                      <Image
                        style={styles.comment_like}
                        source={
                          commentedUser.isLiked
                            ? require("../../assets/icons/liked.png")
                            : require("../../assets/icons/like.png")
                        }
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              {/* PHẦN BÌNH LUẬN*/}
            </View>
          )}
        </View>
      </ScrollView>

      {/* MỜI BÌNH LUẬN*/}
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setValue(value + emoji);
          }}
          showSearchBar={false}
          showHistory={false}
          showSectionTitles={false}
          buttonStyle={{ backgroundColor: "transparent" }}
          buttonTextStyle={{ color: "#000" }}
          columns={8}
          rows={4}
          emojiSize={24}
          category={Categories.emotion}
          positon="bottom"
          onBackspacePress={() => {
            setValue(value.slice(0, -1));
          }}
          onClose={() => setShowEmojiSelector(false)}
        />
      )}
      <View style={styles.mycomment}>
        <View style={styles.row7}>
          <TouchableOpacity>
            {/* Avatar của tôi */}
            <Image style={styles.avatar40} source={{ uri: myAvatar }}></Image>
          </TouchableOpacity>

          <View
            style={
              value || isSelected
                ? styles.comment_textfield
                : styles.comment_textfield_full
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
                ></TextInput>
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
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/image.png")}
                  ></Image>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowEmojiSelector(!showEmojiSelector)}
                >
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/emoji.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {(value || isSelected) && (
            <TouchableOpacity onPress={() => handleCommentSubmit(postId)}>
              <Image
                style={styles.comment_send}
                source={require("../../assets/icons/send.png")}
              ></Image>
            </TouchableOpacity>
          )}
        </View>
        {/* MỜI BÌNH LUẬN*/}
      </View>

      {/* Thêm component Modal để hiển thị modal chỉnh sửa và xóa bình luận */}
      <Modal
        visible={modalVisible2}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible2(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          // onPress={closePetInfo}
          onPress={() => setModalVisible2(false)}
        >
          <View style={styles.modalOptionBackground}>
            <View style={styles.line2}></View>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleEditComment}
            >
              <View style={styles.row8}>
                <Image
                  style={styles.modalOptionIcon}
                  source={require("../../assets/icons/edit.png")}
                />
                <Text style={styles.modalOptionText}>Chỉnh sửa bình luận</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line}></View>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeleteComment}
            >
              <View style={styles.row8}>
                <Image
                  style={styles.modalOptionIcon}
                  source={require("../../assets/icons/delete.png")}
                />
                <Text style={styles.modalOptionText}>Xóa bình luận</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Thêm component Modal để hiển thị modal chỉnh sửa */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.container2}>
            {/* heading */}
            <View style={styles.heading2}>
              <View style={styles.row13}>
                <TouchableOpacity
                  onPress={() => {
                    setEditModalVisible(false);
                    setEditContent("");
                    setEditImage("");
                    setIsSelectedEditImage(false);
                  }}
                >
                  <Text style={styles.cancel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.post_button}
                  onPress={handleUpdateComment}
                  disabled={editContent === ""}
                >
                  <Text style={styles.post}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <TextInput
                style={styles.status_input}
                placeholder="Viết bình luận"
                value={editContent}
                onChangeText={setEditContent}
                multiline={true}
              ></TextInput>
              {isSelectedEditImage && (
                <View
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 28,
                  }}
                >
                  {editImage && (
                    <Image
                      source={{ uri: editImage }}
                      style={{
                        width: 250,
                        height: 250,
                        borderRadius: 12,
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={removeEditImage}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <AntDesign name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.row2}>
                <TouchableOpacity onPress={pickEditImage}>
                  <Image
                    style={styles.comment_media}
                    source={require("../../assets/icons/image.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          // onPress={closePetInfo}
          onPress={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Xác nhận xóa bình luận?</Text>

            <View style={styles.row9}>
              <TouchableOpacity
                onPress={handleCancelDelete}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText1}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText2}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Snackbar
        visible={showSnackbar1}
        // visible={true}
        onDismiss={() => setShowSnackbar1(false)}
        duration={2000}
        // action={{
        //   label: "Dismiss",
        //   onPress: () => setShowSnackbar(false),
        // }}
        style={{ backgroundColor: "white" }}
        theme={{ colors: { text: "white" } }}
      >
        <View style={styles.row10}>
          <Ionicons name="md-checkmark-circle" size={28} color="green" />
          <Text style={styles.snackbarText}>
            Bình luận đã được cập nhật thành công
          </Text>
        </View>
      </Snackbar>
      <Snackbar
        visible={showSnackbar2}
        onDismiss={() => setShowSnackbar2(false)}
        duration={2000}
        style={{ backgroundColor: "white" }}
        theme={{ colors: { text: "white" } }}
      >
        <View style={styles.row10}>
          <Ionicons name="md-checkmark-circle" size={28} color="green" />
          <Text style={styles.snackbarText}>
            Bình luận đã được xóa thành công
          </Text>
        </View>
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  status_input: {
    fontSize: 18,
    padding: 16,
    marginTop: 8,
    fontFamily: "lexend-regular",
  },
  post_media: {
    width: 120,
    height: 80,
    marginTop: 80,
    marginRight: 30,
    marginLeft: 30,
  },
  // label: {
  //   color: "white",
  //   fontFamily: "lexend-regular",
  //   marginTop: 54,
  //   fontSize: 16,
  //   marginLeft: "auto",
  //   marginRight: "auto",
  // },
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
  add: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "lexend-medium",
  },
  add_button: {
    height: 40,
    marginTop: 28,
    marginBottom: 8,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: "#8F1928",
    borderRadius: 12,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
  },
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
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    fontFamily: "lexend-medium",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
    width: 80,
    height: 40,
    borderRadius: 4,
    borderColor: "red",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    width: 80,
    height: 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText1: {
    color: "red",
    fontSize: 16,
    fontFamily: "lexend-medium",
  },
  buttonText2: {
    color: "white",
    fontSize: 16,
    fontFamily: "lexend-medium",
  },
  row9: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
    alignItems: "center",
  },
  container2: {
    width: "90%",
    height: "30%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  container1: {
    width: "100%",
    height: "90%",
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  heading2: {
    width: "100%",
    height: "18%",
    borderRadius: 12,
    backgroundColor: "#FFF6F6",
  },
  account_name2: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  row8: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    // paddingBottom: 10,
    // alignItems: "center",
  },
  line2: {
    width: 54,
    height: 5,
    backgroundColor: "#F5817E",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "50%",
  },
  modalOptionIcon: {
    width: 24,
    height: 24,
    marginLeft: 40,
    marginRight: 20,
  },
  modalOptionText: {
    color: "#A51A29",
    fontFamily: "lexend-medium",
    fontSize: 18,
  },
  modalOptionBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    height: "16%",
    justifyContent: "space-around",
    // alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#FCAC9E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
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
  row13: {
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
  pre_cmt_text: {
    fontSize: 14,
    color: "#878080",
    fontFamily: "lexend-medium",
    // marginLeft: "6%",
    marginBottom: 8,
    textDecorationLine: "underline",
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
  status_video: {
    width: 300,
    height: 533,
    // resizeMode: "contain",
    alignSelf: "center",
    margin: 8,
    borderRadius: 12,
    //transform: [{ scale: this.state.scaleValue }],
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
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
  },
  status_image: {
    width: 320,
    aspectRatio: 1 / 1,
    // height: 180,
    // resizeMode: "contain",
    alignSelf: "center",
    margin: 8,
    borderRadius: 12,
    //transform: [{ scale: this.state.scaleValue }],
  },

  status_video: {
    width: 300,
    height: 533,
    // resizeMode: "contain",
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
    // width: "92%",
    //marginBottom: 8,
  },
  comment_name_content: {
    backgroundColor: "#EFEBEB",
    padding: 4,
    paddingLeft: 8,
    borderRadius: 12,
    maxWidth: 260,
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
  customContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  customContentText: {
    fontSize: 18,
    marginLeft: 8,
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    // Các thuộc tính kiểu dáng khác tùy ý
  },
});
