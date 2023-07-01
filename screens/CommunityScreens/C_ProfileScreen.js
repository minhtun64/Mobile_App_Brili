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
  RefreshControl,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-native-datepicker";

import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import {
  useNavigation,
  useScrollToTop,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import * as Font from "expo-font";

import { useSwipe } from "../../hooks/useSwipe";
import { saveNotification, saveNotificationFollow } from "../../components/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";

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
import {
  getDownloadURL,
  getStorage,
  uploadBytes,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";

import { formatDate } from "../../components/utils";
import getStatusInfo from "../../firebase_functions/getStatusInfo";
import moment from "moment";
import { Audio, Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as VideoPicker from "expo-image-picker";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";

export default function C_ProfileScreen({ navigation }) {
  const myUserId = "10"; // VÍ DỤ
  const [myProfile, setMyProfile] = useState(false);

  // LẤY THAM SỐ ĐƯỢC TRUYỀN TỪ MÀN HÌNH TRƯỚC
  const route = useRoute();
  const userId = route?.params?.userId;

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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);

  const [iconStatus, setIconStatus] = useState(false);
  const [showPetInfo, setShowPetInfo] = useState(false);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [wallpaper, setWallpaper] = useState("");
  const [intro, setIntro] = useState("");
  const [followingCount, setFollowingCount] = useState(0);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followerUsers, setFollowerUsers] = useState({});
  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedUsers, setLikedUsers] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(Array(posts.length).fill(false));

  const fetchProfile = async () => {
    if (userId === myUserId) {
      setMyProfile(true);
    }

    // Load user data
    const nameRef = ref(database, `user/${userId}/name`);
    const avatarRef = ref(database, `user/${userId}/avatar`);
    const wallpaperRef = ref(database, `user/${userId}/wallpaper`);
    const introRef = ref(database, `user/${userId}/intro`);

    get(nameRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const name = snapshot.val();
          setName(name);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    get(avatarRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const avatarUrl = snapshot.val();
          setAvatar(avatarUrl);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    get(wallpaperRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const wallpaperUrl = snapshot.val();
          setWallpaper(wallpaperUrl);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    get(introRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const introText = snapshot.val();
          setIntro(introText);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // Load follower and following counts
    const followingRef = ref(database, `follow/${userId}`);
    onValue(followingRef, (snapshot) => {
      const followingData = snapshot.val();
      const followingUsers = [];
      const followingCount = followingData
        ? Object.keys(followingData).length
        : 0;
      followingUsers.splice(0, followingUsers.length); // Xóa tất cả các phần tử trong mảng
      if (followingData) {
        Object.keys(followingData).forEach((key) => {
          followingUsers.push({ userId: key });
        });
      }
      setFollowingCount(followingCount);
      setFollowingUsers(followingUsers);
    });

    const followerRef = ref(database, "follow");

    onValue(followerRef, (snapshot) => {
      const followers = snapshot.val();
      const users = [];

      let count = 0;
      Object.keys(followers).forEach((followerId) => {
        const followerData = followers[followerId];
        Object.keys(followerData).forEach((followedId) => {
          if (followedId === userId) {
            count++;
            const user = { userId: followerId };
            users.push(user);
          }
        });
      });

      // Kiểm tra xem myUserId có trong danh sách hay không
      const isFollowingUser = users.some((user) => user.userId === myUserId);
      setIsFollowing(isFollowingUser);

      setFollowerUsers(users);
      setFollowerCount(count);
    });

    // Load pets
    const petRef = ref(database, `pet/${userId}`);

    onValue(petRef, (snapshot) => {
      const pets = [];
      snapshot.forEach((childSnapshot) => {
        const pet = childSnapshot.val();
        pets.push(pet);
      });
      setPets(pets);
    });
  };

  // LẤY DANH SÁCH CÁC BÀI ĐĂNG (REAL-TIME)
  const [recentPosts, setRecentPosts] = useState([]);
  const [cachedPostData, setCachedPostData] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);

  const fetchRecentPosts = async () => {
    try {
      // Lấy danh sách bài đăng từ Firebase
      const postsRef = ref(database, "post");
      onValue(postsRef, async (snapshot) => {
        const postsData = snapshot.val();

        // Lọc danh sách bài đăng của người dùng có userId hiện tại
        const filteredPosts = Object.values(postsData).filter(
          (post) => post.user_id === userId
        );
        const sortedPosts = filteredPosts.sort((a, b) => {
          const dateA = moment(a.date, "DD-MM-YYYY HH:mm:ss");
          const dateB = moment(b.date, "DD-MM-YYYY HH:mm:ss");
          return dateB - dateA;
        });

        // Tạo một object mới để lưu trữ dữ liệu bài viết đã được caching
        const updatedCachedPostData = {};
        const statusPromises = sortedPosts.map(async (post) => {
          const postId = Object.keys(postsData).find(
            (key) => postsData[key] === post
          );

          // Kiểm tra xem bài viết đã tồn tại trong cachedPostData chưa
          if (cachedPostData[postId]) {
            // Nếu đã tồn tại, lấy dữ liệu từ cachedPostData
            return cachedPostData[postId];
          } else {
            // Nếu chưa tồn tại, lấy dữ liệu từ Firebase
            const postInfo = await getStatusInfo(postId);
            // Lưu dữ liệu vào updatedCachedPostData
            updatedCachedPostData[postId] = postInfo;
            return postInfo;
          }
        });

        const statusResults = await Promise.all(statusPromises);
        // Cập nhật dữ liệu bài viết gần đây và cachedPostData
        setRecentPosts(statusResults);
        setCachedPostData(updatedCachedPostData);
        // Kiểm tra các bài viết đã tải lên lần đầu để xác định những bài đã được người dùng hiện tại thích
        const likedPosts = statusResults.filter((post) =>
          post.likedUsers.some((user) => user.userId === myUserId)
        );
        setLikedPosts(likedPosts);
      });
    } catch (error) {
      console.error("Error retrieving recent posts:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchRecentPosts();
  }, [userId]);

  // CUỘN XUỐNG ĐỂ CẬP NHẬT SỐ LƯỢNG LIKE/COMMENT (KHÔNG REAL-TIME)
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile();
    fetchRecentPosts();
    setRefreshing(false);
  };

  // XỬ LÝ LIKE BÀI ĐĂNG
  const handleLikePost = async (postId, isLiked) => {
    try {
      if (isLiked) {
        // Unlike bài đăng
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
        // Xóa bài viết đã được like khỏi danh sách likedPosts
        const updatedLikedPosts = likedPosts.filter(
          (post) => post.postId !== postId
        );
        setLikedPosts(updatedLikedPosts);
      } else {
        // Like bài đăng
        const likeData = {
          date: moment().format("DD-MM-YYYY HH:mm:ss"),
        };
        await set(ref(database, `like/${postId}/${myUserId}/post`), likeData);
        // Thêm bài viết vào danh sách likedPosts
        const updatedLikedPosts = [...likedPosts, { postId }];
        setLikedPosts(updatedLikedPosts);
        // Phát âm thanh khi nhấn like
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(
          require("../../assets/soundeffects/like-sound.mp3")
        );
        await soundObject.playAsync();
      }
      // Lấy dữ liệu bài viết đã được caching từ cachedPostData
      const updatedRecentPosts = recentPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            isLiked: !isLiked,
            likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      });
      // Cập nhật giao diện với dữ liệu mới
      setRecentPosts(updatedRecentPosts);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const openPetInfo = (index) => {
    setSelectedPetIndex(index);
    setModalVisible(true);
  };

  const closePetInfo = () => {
    setModalVisible(false);
  };

  const switchPet = (direction) => {
    let newIndex;
    if (direction === "left") {
      newIndex =
        selectedPetIndex === 0 ? pets.length - 1 : selectedPetIndex - 1;
    } else {
      newIndex =
        selectedPetIndex === pets.length - 1 ? 0 : selectedPetIndex + 1;
    }
    setSelectedPetIndex(newIndex);
  };

  const pet = pets[selectedPetIndex];

  // console.log(followingUsers);

  const handleFollowButton = () => {
    if (isFollowing) {
      // Hủy theo dõi
      const followerRef = ref(database, `follow/${myUserId}/${userId}`);
      remove(followerRef)
        .then(() => {
          setIsFollowing(false);
        })
        .catch((error) => {
          console.log("Error unfollowing user:", error);
        });
    } else {
      // Theo dõi
      const followData = {
        date: moment().format("DD-MM-YYYY HH:mm:ss"),
      };
      if(set(ref(database, `follow/${myUserId}/${userId}`), followData)){
        
        saveNotificationFollow(myUserId,'follow', userId)
      }
      setIsFollowing(true);
    }
  };

  const handleLikeButton = async (postId, currentIsLiked) => {
    if (currentIsLiked) {
      // Hủy like bài viết
      const likeRef = ref(database, `like/${postId}/${myUserId}/post`);
      remove(likeRef); // Xóa nút like của người dùng
    } else {
      // Thêm like vào bài viết
      const likeRef = ref(database, `like/${postId}/${myUserId}/post/date`);
      set(likeRef, moment().format("DD-MM-YYYY HH:mm:ss")); // Gán giá trị cho nút like
      // Phát âm thanh khi nhấn like
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(
        require("../../assets/soundeffects/like-sound.mp3")
      );
      await soundObject.playAsync();
    }
  };

  // Thêm state để lưu trữ thông tin bài viết hiện tại
  const [modalVisible2, setModalVisible2] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // Hàm xử lý khi nhấn vào icon Option
  const handleOptionPress = (post) => {
    setCurrentPost(post);
    // console.log(post);
    // Hiển thị modal chỉnh sửa hoặc xóa bài viết
    if (post.mediaType == "image") {
      setImage(post.media);
      setIsSelected(true);
    } else if (post.mediaType == "video") {
      setVideo(post.media);
      setIsSelected(true);
    }
    if (post.content) {
      setValue(post.content);
    }
    setModalVisible2(true);
  };

  //VIDEO
  const video2 = React.useRef(null);
  const [status, setStatus] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);

  // Hàm xử lý khi nhấn vào nút "Chỉnh sửa bài viết" trong modal
  const handleEditPost = () => {
    // Đóng modal chỉnh sửa
    setModalVisible2(false);
    // Hiển thị modal nội dung bài viết để chỉnh sửa
    setEditModalVisible(true);
  };

  const handleDeletePost = () => {
    setModalVisible2(false);
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const [showSnackbar2, setShowSnackbar2] = useState(false);
  const handleConfirmDelete = async () => {
    // Xóa bài viết khỏi Firebase
    const postRef = ref(database, `post/${currentPost.postId}`);
    const likeRef = ref(database, `like/${currentPost.postId}`);
    try {
      await remove(postRef);
      await remove(likeRef);

      // Xóa ảnh từ storage (nếu có)
      if (currentPost.mediaType === "image" && currentPost.media) {
        const storageReference = storageRef(
          storage,
          `Status_Images/${currentPost.postId}`
        );
        // await deleteObject(storageReference);
      }

      // Xóa video từ storage (nếu có)
      if (currentPost.mediaType === "video" && currentPost.media) {
        const storageReference = storageRef(
          storage,
          `Status_Videos/${currentPost.postId}`
        );
        await deleteObject(storageReference);
      }

      // Đóng modal xóa bài viết
      setDeleteModalVisible(false);
      // Hiển thị snackbar thành công
      setShowSnackbar2(true);
      setTimeout(() => setShowSnackbar2(false), 2000); // Hide snackbar after 2 seconds
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  //CHỈNH SỬA BÀI VIẾT
  const handleEditProfilePress = () => {
    setEditProfileModalVisible(true);
    setEditName(name);
    setEditIntro(intro);
    setEditAvatar(avatar);
    setEditWallpaper(wallpaper);
  };

  const [showSnackbar1, setShowSnackbar1] = useState(false);
  const [value, setValue] = useState("");
  const [media, setMedia] = useState("");
  const handleUpdatePost = async () => {
    if (
      currentPost.content === value &&
      (currentPost.media === image || currentPost.media === video)
    ) {
      // Nếu không có thay đổi nội dung và phương tiện, không thực hiện cập nhật
      console.log("Không cập nhật");
      setEditModalVisible(false);
      return;
    }

    const updatedPostRef = ref(database, `post/${currentPost.postId}`);
    const updatedPostData = { ...currentPost, content: value };
    if (currentPost.media != image && video == null) {
      if (isSelected) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Status_Images/${currentPost.postId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          updatedPostData.media = url;
          updatedPostData.mediaType = "image";
        } catch (error) {
          console.log("Error uploading image:", error);
        }
      } else {
        const storageReference = storageRef(
          storage,
          `Status_Images/${currentPost.postId}`
        );
        try {
          await deleteObject(storageReference);
          updatedPostData.media = null;
          updatedPostData.mediaType = null;
        } catch (error) {
          console.log("Error deleting image:", error);
        }
      }
    }
    if (currentPost.media != video && image == null) {
      if (isSelected) {
        const response = await fetch(video);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Status_Videos/${currentPost.postId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          updatedPostData.media = url;
          updatedPostData.mediaType = "video";
        } catch (error) {
          console.log("Error uploading video:", error);
        }
      } else {
        const storageReference = storageRef(
          storage,
          `Status_Videos/${currentPost.postId}`
        );
        try {
          await deleteObject(storageReference);
          updatedPostData.media = null;
          updatedPostData.mediaType = null;
        } catch (error) {
          console.log("Error deleting video:", error);
        }
      }
    }

    try {
      await update(updatedPostRef, updatedPostData);
      console.log("Bài viết đã được cập nhật thành công");
      // Tiến hành cập nhật thành công, bạn có thể thực hiện các hành động khác
      // Hiển thị snackbar thành công
      setShowSnackbar1(true);
      setTimeout(() => setShowSnackbar1(false), 2000); // Hide snackbar after 2 seconds
    } catch (error) {
      console.log("Lỗi khi cập nhật bài viết:", error);
      // Xử lý lỗi khi cập nhật bài viết
    }

    setEditModalVisible(false);
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

  //CHỈNH SỬA TRANG CÁ NHÂN
  const [showSnackbar3, setShowSnackbar3] = useState(false);
  const [editName, setEditName] = useState(null);
  const [editIntro, setEditIntro] = useState(null);
  const handleUpdateProfile = async () => {
    if (
      name === editName &&
      intro === editIntro &&
      avatar === editAvatar &&
      wallpaper === editWapper
    ) {
      console.log("Không cập nhật");
      setEditProfileModalVisible(false);
      return;
    }

    const updatedUserRef = ref(database, `user/${userId}`);
    const userSnapshot = await get(updatedUserRef);
    let updatedUserData = userSnapshot.val();

    if (name != editName) {
      updatedUserData = { ...updatedUserData, name: editName };
    }

    if (intro != editIntro) {
      updatedUserData = { ...updatedUserData, intro: editIntro };
    }

    if (avatar != editAvatar) {
      if (isSelectedAvatar) {
        const response = await fetch(editAvatar);
        const blob = await response.blob();
        const storageReference = storageRef(storage, `Avatar_Images/${userId}`);
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          updatedUserData.avatar = url;
        } catch (error) {
          console.log("Error uploading avatar:", error);
        }
      } else {
        const storageReference = storageRef(storage, `Avatar_Images/${userId}`);
        try {
          await deleteObject(storageReference);
          updatedUserData.avatar = null;
        } catch (error) {
          console.log("Error deleting avatar:", error);
        }
      }
    }

    if (wallpaper != editWallpaper) {
      if (isSelectedWallpaper) {
        const response = await fetch(editWallpaper);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Wallpaper_Images/${userId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          updatedUserData.wallpaper = url;
        } catch (error) {
          console.log("Error uploading wallpaper:", error);
        }
      } else {
        const storageReference = storageRef(
          storage,
          `Wallpaper_Images/${userId}`
        );
        try {
          await deleteObject(storageReference);
          updatedUserData.wallpaper = null;
        } catch (error) {
          console.log("Error deleting wallpaper:", error);
        }
      }
    }

    try {
      await update(updatedUserRef, updatedUserData);
      console.log("Trang cá nhân đã được cập nhật thành công");
      // Tiến hành cập nhật thành công, bạn có thể thực hiện các hành động khác
      // Hiển thị snackbar thành công
      setShowSnackbar3(true);
      setTimeout(() => setShowSnackbar3(false), 2000); // Hide snackbar after 2 seconds
      handleRefresh();
    } catch (error) {
      console.log("Lỗi khi cập nhật trang cá nhân:", error);
    }
    setEditProfileModalVisible(false);
  };

  // CHỌN/XÓA ẢNH ĐẠI DIỆN
  const [editAvatar, setEditAvatar] = useState(null);
  const [isSelectedAvatar, setIsSelectedAvatar] = useState(true);
  const pickAvatar = async () => {
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
      setIsSelectedAvatar(true);
      setEditAvatar(result.assets[0].uri);
    }
  };
  const removeAvatar = () => {
    setIsSelectedAvatar(false);
    setEditAvatar(null);
  };

  // CHỌN/XÓA ẢNH TƯỜNG
  const [editWallpaper, setEditWallpaper] = useState(null);
  const [isSelectedWallpaper, setIsSelectedWallpaper] = useState(true);
  const pickWallpaper = async () => {
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
      setIsSelectedWallpaper(true);
      setEditWallpaper(result.assets[0].uri);
    }
  };
  const removeWallpaper = () => {
    setIsSelectedWallpaper(false);
    setEditWallpaper(null);
  };

  // THÊM THÚ CƯNG
  const [addPetName, setAddPetName] = useState(null);
  const [addPetType, setAddPetType] = useState(null);
  const [addPetBreed, setAddPetBreed] = useState(null);
  const [addPetGender, setAddPetGender] = useState(null);
  const [addPetBirthdate, setAddPetBirthdate] = useState(null);
  const [addPetWeight, setAddPetWeight] = useState(null);
  const [addPetHairColor, setAddPetHairColor] = useState(null);
  const [addPetModalVisible, setAddPetModalVisible] = useState(false);
  const { handleSubmit, control } = useForm();

  const [typeOpen, setTypeOpen] = useState(false);
  const [type, setType] = useState([
    { label: "Hamster", value: 1 },
    { label: "Mèo", value: 2 },
    { label: "Chó", value: 3 },
  ]);

  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Đực", value: 1 },
    { label: "Cái", value: 0 },
  ]);

  const [hairColorOpen, setHairColorOpen] = useState(false);
  const [hairColor, setHairColor] = useState([
    { label: "Vàng", value: "Vàng" },
    { label: "Trắng", value: "Trắng" },
    { label: "Đen", value: "Đen" },
    { label: "Nâu", value: "Nâu" },
    { label: "Trắng đen", value: "Trắng đen" },
    { label: "Vàng trắng", value: "Vàng trắng" },
    { label: "Nâu đen", value: "Nâu đen" },
    { label: "Xám", value: "Xám" },
  ]);

  const onTypeOpen = useCallback(() => {
    setGenderOpen(false);
    setHairColorOpen(false);
  }, []);
  const onGenderOpen = useCallback(() => {
    setTypeOpen(false);
    setHairColorOpen(false);
  }, []);
  const onHairColorOpen = useCallback(() => {
    setTypeOpen(false);
    setGenderOpen(false);
  }, []);
  // TỰ ĐỘNG MỞ KEYBOARD NHẬP TÊN
  const textInputRef = useRef(null);
  const onPressInHandler = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  // CHỌN/XÓA ẢNH THÚ CƯNG
  const [addPetAvatar, setAddPetAvatar] = useState(null);
  const [isSelectedPetAvatar, setIsSelectedPetAvatar] = useState(false);
  const pickPetAvatar = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setIsSelectedPetAvatar(true);
      setAddPetAvatar(result.assets[0].uri);
    }
  };
  const removePetAvatar = () => {
    setIsSelectedPetAvatar(false);
    setAddPetAvatar(null);
  };

  const addPet = async () => {
    try {
      const petRef = ref(database, `pet/${myUserId}`);
      // Tạo newPetId mới bằng cách lấy giá trị lớn nhất hiện tại trong pet/${myUserId} và cộng thêm 1
      const snapshot = await get(petRef);
      let currentMaxId = 0;
      if (snapshot.exists()) {
        const petIds = Object.keys(snapshot.val());
        currentMaxId = Math.max(...petIds);
      }
      const newPetId = currentMaxId + 1;

      const newPetRef = ref(database, `pet/${myUserId}/${newPetId}`);
      const newPetData = {
        name: addPetName,
        type: addPetType,
        breed: addPetBreed,
        gender: addPetGender,
        birthdate: addPetBirthdate,
        weight: addPetWeight,
        hairColor: addPetHairColor,
        avatar: null,
      };
      // Upload ảnh thú cưng lên Storage
      if (isSelectedPetAvatar) {
        console.log("Có ảnh");
        const response = await fetch(addPetAvatar);
        const blob = await response.blob();
        const storageReference = storageRef(
          storage,
          `Pet_Images/${myUserId}/${newPedId}`
        );
        try {
          await uploadBytes(storageReference, blob);
          const url = await getDownloadURL(storageReference);
          newPetData.avatar = url;
        } catch (error) {
          console.log("Error uploading pet avatar:", error);
        }
      }
      await set(newPetRef, newPetData);
      console.log("Thêm thú cưng thành công!");
      setAddPetModalVisible(false);
      handleRefresh();
    } catch (error) {
      console.error("Error adding pet to Firebase:", error);
    }
  };

  useEffect(() => {
    if (addPetModalVisible && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [addPetModalVisible]);

  if (!fontLoaded) {
    return null;
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
          <Text style={styles.text}>{name}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("C_Search")}>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 142,
          }}
        >
          {wallpaper && (
            <Image
              source={{ uri: wallpaper }}
              style={{
                width: "100%",
                height: "100%",
              }}
              // resizeMode="contain"
            />
          )}

          <TouchableOpacity style={{ position: "absolute", top: 4, right: 4 }}>
            <AntDesign name="ellipsis1" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {avatar && (
          <TouchableOpacity>
            <Image style={styles.avatar100} source={{ uri: avatar }}></Image>
          </TouchableOpacity>
        )}

        <View style={styles.row4}>
          {!myProfile && (
            <TouchableOpacity style={styles.chat_border}>
              <Image
                style={styles.chat}
                source={require("../../assets/icons/chat.png")}
              ></Image>
            </TouchableOpacity>
          )}
          {myProfile ? (
            <TouchableOpacity
              style={styles.myedit_button}
              onPress={handleEditProfilePress}
            >
              <Text style={styles.following_text}>Chỉnh sửa trang cá nhân</Text>
            </TouchableOpacity>
          ) : (
            <View>
              {isFollowing ? (
                <TouchableOpacity
                  style={styles.following_button}
                  onPress={handleFollowButton}
                >
                  <Text style={styles.following_text}>Đang theo dõi</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.follow_button}
                  onPress={handleFollowButton}
                >
                  <Text style={styles.follow_text}>Theo dõi</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.account_name}>{name}</Text>
          <Text style={styles.account_bio}>{intro}</Text>
          {/* Like / Comment / Share */}
          <View style={styles.row3}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("C_FollowingList", {
                  followingUsers: followingUsers,
                })
              }
            >
              <View style={styles.row3}>
                <Text style={styles.following_count}>{followingCount}</Text>
                <Text style={styles.following_count_text}> Đang theo dõi</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("C_FollowedList", {
                  followerUsers: followerUsers,
                })
              }
            >
              <View style={styles.row3}>
                <Text style={styles.followed_count}>{followerCount}</Text>
                <Text style={styles.followed_count_text}> Người theo dõi</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {pets.length > 0 && (
          <View style={styles.pet_frame}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.row3}>
                {myProfile && (
                  <TouchableOpacity
                    style={styles.add_pet}
                    onPress={() => {
                      setAddPetModalVisible(true);
                      onPressInHandler();
                    }}
                  >
                    <Ionicons name="add" size={24} color="#F5817E" />
                  </TouchableOpacity>
                )}
                {pets.map((pet, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={{
                        marginRight: 8,
                        marginLeft: 8,
                      }}
                      onPress={() => openPetInfo(index)}
                    >
                      {pet.avatar ? (
                        <Image
                          style={styles.pet_img}
                          source={{ uri: pet.avatar }}
                        ></Image>
                      ) : (
                        <Image
                          style={styles.pet_img}
                          source={require("../../assets/images/avatar_pet.png")}
                        ></Image>
                      )}

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
                        {pet.type === 1 && (
                          <Image
                            style={StyleSheet.flatten([
                              styles.chat,
                              {
                                marginRight: 4,
                              },
                            ])}
                            source={require("../../assets/images/icon-hamster.png")}
                          ></Image>
                        )}
                        {pet.type === 2 && (
                          <Image
                            style={StyleSheet.flatten([
                              styles.chat,
                              {
                                marginRight: 4,
                              },
                            ])}
                            source={require("../../assets/images/icon-cat.png")}
                          ></Image>
                        )}
                        {pet.type === 3 && (
                          <Image
                            style={StyleSheet.flatten([
                              styles.chat,
                              {
                                marginRight: 4,
                              },
                            ])}
                            source={require("../../assets/images/icon-dog.png")}
                          ></Image>
                        )}
                        <Text
                          style={{
                            fontFamily: "lexend-regular",
                          }}
                        >
                          {pet.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            {pet && (
              <Modal
                // animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closePetInfo}
                // key={index}
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
                        top: 18,
                        right: 20,
                        zIndex: 1,
                      }}
                      onPress={closePetInfo}
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
                      onPress={() => switchPet("left")}
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
                      onPress={() => switchPet("right")}
                    >
                      <Image
                        source={require("../../assets/icons/arrow-right.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </TouchableOpacity>

                    <View style={styles.row7}>
                      <View
                        style={{
                          width: 200,
                          height: 200,
                          backgroundColor: "#ffffff",
                          borderRadius: 12,
                          marginRight: 16,
                        }}
                      >
                        <Text style={styles.pet_name}>{pet.name}</Text>
                        <View style={styles.row3}>
                          <Text style={styles.pet_pro}>Loài: </Text>
                          {pet.type === 1 && (
                            <Text style={styles.pet_pro_val}>Hamster</Text>
                          )}
                          {pet.type === 2 && (
                            <Text style={styles.pet_pro_val}>Mèo</Text>
                          )}
                          {pet.type === 3 && (
                            <Text style={styles.pet_pro_val}>Chó</Text>
                          )}
                        </View>
                        <View style={styles.row3}>
                          <Text style={styles.pet_pro}>Giống: </Text>
                          <Text style={styles.pet_pro_val}>{pet.breed}</Text>
                        </View>
                        <View style={styles.row3}>
                          <Text style={styles.pet_pro}>Giới tính: </Text>
                          {pet.gender === 0 && (
                            <Text style={styles.pet_pro_val}>Cái</Text>
                          )}
                          {pet.gender === 1 && (
                            <Text style={styles.pet_pro_val}>Đực</Text>
                          )}
                        </View>
                        <View style={styles.row3}>
                          <Text style={styles.pet_pro}>Tuổi: </Text>
                          <Text style={styles.pet_pro_val}>
                            {Math.floor(
                              moment().diff(
                                moment(pet.birthdate, "DD-MM-YYYY"),
                                "years",
                                true
                              )
                            )}
                          </Text>
                        </View>
                        <View style={styles.row3}>
                          <Text style={styles.pet_pro}>Cân nặng: </Text>
                          <Text style={styles.pet_pro_val}>0.3 kg</Text>
                        </View>
                        <View style={styles.row3}>
                          <Text style={styles.pet_pro}>Màu lông: </Text>
                          <Text style={styles.pet_pro_val}>
                            {pet.hairColor}
                          </Text>
                        </View>
                      </View>
                      <Image
                        style={styles.pet_img}
                        source={{ uri: pet.avatar }}
                      ></Image>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>
        )}

        {/* DANH SÁCH BÀI ĐĂNG */}
        <View style={styles.newsfeed}>
          <View style={styles.row5}>
            <Text style={styles.text}>Bài viết</Text>
            <Image
              style={styles.footprint}
              source={require("../../assets/images/footprint.png")}
              //resizeMode="contain"
            ></Image>
          </View>
          {/* NỘI DUNG MỘT BÀI ĐĂNG */}
          {recentPosts.map((post) => {
            const isLiked = likedPosts.some(
              (likedPost) => likedPost.postId === post.postId
            );

            return (
              <TouchableOpacity
                key={post.postId}
                style={styles.status}
                onPress={() =>
                  navigation.navigate("C_Status", {
                    postId: post.postId,
                    userId: post.userId,
                    userName: name,
                    userAvatar: avatar,
                    content: post.content,
                    media: post.media,
                    formattedDate: post.formattedDate,
                    likeCount: post.likeCount,
                    likedUsers: post.likedUsers,
                    commentCount: post.commentCount,
                    isLiked: isLiked,
                  })
                }
              >
                <View style={styles.row6}>
                  <View style={styles.row5}>
                    {avatar && (
                      <TouchableOpacity>
                        <Image
                          style={styles.avatar50}
                          source={{ uri: avatar }}
                        ></Image>
                      </TouchableOpacity>
                    )}
                    <View>
                      <TouchableOpacity>
                        {/* Tên người đăng */}
                        <Text style={styles.status_name}>{name}</Text>
                      </TouchableOpacity>
                      {/* Thời gian đăng */}
                      <Text style={styles.status_date}>
                        {post.formattedDate}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleOptionPress(post)}>
                    {/* Tùy chọn Status */}
                    <Image
                      style={styles.status_option}
                      source={require("../../assets/icons/option.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                {/* Nội dung Status */}
                <Text style={styles.status_content} selectable={true}>
                  {post.content}
                </Text>
                {/* Ảnh/Video Status */}
                {post.media && (
                  <View>
                    {post.mediaType == "image" ? (
                      <Image
                        style={styles.status_image}
                        source={{ uri: post.media }}
                      />
                    ) : (
                      <TouchableOpacity>
                        <Video
                          style={styles.status_video}
                          source={{ uri: post.media }}
                          ref={video2}
                          resizeMode="cover"
                          // shouldPlay={true}
                          shouldPlay={false}
                          isLooping={true}
                          useNativeControls
                          isMuted={true}
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
                <View style={styles.row6}>
                  <View style={styles.row5}>
                    <TouchableOpacity
                      onPress={() => handleLikePost(post.postId, isLiked)}
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
                    <Text>{post.likeCount}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("C_Status")}
                    >
                      <Image
                        style={styles.comment}
                        source={require("../../assets/icons/comment.png")}
                      ></Image>
                    </TouchableOpacity>
                    <Text>{post.commentCount}</Text>
                  </View>
                  <TouchableOpacity>
                    <Image
                      style={styles.share}
                      source={require("../../assets/icons/share.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
          {/* NỘI DUNG MỘT STATUS */}
        </View>
        {/* BÀI VIẾT */}
      </ScrollView>

      {/* Thêm component Modal để hiển thị modal chỉnh sửa và xóa bài viết */}
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
              onPress={handleEditPost}
            >
              <View style={styles.row8}>
                <Image
                  style={styles.modalOptionIcon}
                  source={require("../../assets/icons/edit.png")}
                />
                <Text style={styles.modalOptionText}>Chỉnh sửa bài viết</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.line}></View>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeletePost}
            >
              <View style={styles.row8}>
                <Image
                  style={styles.modalOptionIcon}
                  source={require("../../assets/icons/delete.png")}
                />
                <Text style={styles.modalOptionText}>Xóa bài viết</Text>
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
          // onPress={closePetInfo}
          onPress={() => setEditModalVisible(false)}
        >
          <View style={styles.container2}>
            {/* heading */}
            <View style={styles.heading2}>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.cancel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.post_button}
                  onPress={handleUpdatePost}
                  disabled={value === ""}
                >
                  <Text style={styles.post}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.row3}>
                {/* Ảnh đại diện người đăng */}
                <Image style={styles.avatar40} source={{ uri: avatar }}></Image>
                <View>
                  {/* Tên người đăng */}
                  <Text style={styles.account_name2}>{name}</Text>
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
                        width: 250,
                        height: 250,
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
            <Text style={styles.modalText}>Xác nhận xóa bài viết?</Text>

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
            Bài viết đã được cập nhật thành công
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
            Bài viết đã được xóa thành công
          </Text>
        </View>
      </Snackbar>

      {/* Thêm component Modal để hiển thị modal chỉnh sửa trang cá nhân */}
      <Modal
        visible={editProfileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setEditProfileModalVisible(false)}
        >
          <View style={styles.container1}>
            {/* heading */}
            <View style={styles.heading2}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => setEditProfileModalVisible(false)}
                >
                  <Text style={styles.cancel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.post_button}
                  onPress={handleUpdateProfile}
                  disabled={name === ""}
                >
                  <Text style={styles.post}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                onPress={pickWallpaper}
                style={{
                  width: Dimensions.get("window").width,
                  height: 142,
                }}
              >
                {wallpaper && (
                  <Image
                    source={{ uri: editWallpaper }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    // resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
              {avatar && (
                <TouchableOpacity onPress={pickAvatar}>
                  <Image
                    style={styles.avatar100}
                    source={{ uri: editAvatar }}
                  ></Image>
                  {/* Màn hình xám trong suốt */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 100,
                      height: 100,
                      marginTop: -46,
                      // marginRight: 8,
                      marginLeft: 16,
                      borderColor: "#FFFFFF",
                      borderWidth: 3,
                      borderRadius: 50,
                    }}
                  >
                    {/* Icon thay đổi ảnh */}
                    <View>
                      <Ionicons name="image-outline" size={24} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              <View style={styles.info}>
                <View style={styles.line3}></View>
                <View style={styles.row12}>
                  <Text style={styles.edit_label}>Tên</Text>
                  <TextInput
                    style={styles.edit_name_input}
                    placeholder="Họ tên của bạn"
                    value={editName}
                    onChangeText={setEditName}
                    multiline={true}
                  ></TextInput>
                </View>
                <View style={styles.line3}></View>
                <View style={styles.row12}>
                  <Text style={styles.edit_label}>Tiểu sử</Text>
                  <TextInput
                    style={styles.edit_intro_input}
                    placeholder="Tiểu sử của bạn"
                    value={editIntro}
                    onChangeText={setEditIntro}
                    multiline={true}
                  ></TextInput>
                </View>
                <View style={styles.line3}></View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      <Snackbar
        visible={showSnackbar3}
        // visible={true}
        onDismiss={() => setShowSnackbar3(false)}
        duration={2000}
        style={{ backgroundColor: "white" }}
        theme={{ colors: { text: "white" } }}
      >
        <View style={styles.row10}>
          <Ionicons name="md-checkmark-circle" size={28} color="green" />
          <Text style={styles.snackbarText}>
            Trang cá nhân đã được cập nhật thành công
          </Text>
        </View>
      </Snackbar>

      <Modal
        // animationType="slide"
        transparent={true}
        visible={addPetModalVisible}
        onRequestClose={() => setAddPetModalVisible(false)}
      >
        <View
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          // onPress={() => setAddPetModalVisible(false)}
        >
          {/* Hình ảnh sẽ hiển thị trong Modal */}
          <View
            style={{
              width: "100%",
              height: 700,
              backgroundColor: "#FFF6F6",
              marginTop: -40,
              borderRadius: 24,
            }}
          >
            {/* Icon để đóng Modal */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 18,
                right: 20,
                zIndex: 1,
              }}
              onPress={() => setAddPetModalVisible(false)}
            >
              <Image
                source={require("../../assets/icons/close-red.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>

            <View style={styles.row7}>
              <View
                style={{
                  width: 240,
                  height: 540,
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  marginRight: 16,
                }}
              >
                <TextInput
                  style={styles.pet_name_edit}
                  placeholder="Tên thú cưng"
                  value={addPetName}
                  onChangeText={setAddPetName}
                  ref={textInputRef}
                  // multiline={true}
                ></TextInput>

                <Text style={styles.pet_pro}>Loài: </Text>
                <DropDownPicker
                  items={type}
                  value={addPetType}
                  open={typeOpen}
                  setOpen={setTypeOpen}
                  placeholder="Chọn loài"
                  placeholderStyle={{ fontFamily: "lexend-light" }}
                  setValue={setAddPetType}
                  setItems={setType}
                  style={styles.dropdown}
                  labelStyle={{ fontFamily: "lexend-light" }}
                  onOpen={onTypeOpen}
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  containerStyle={{
                    margin: 20,
                    marginTop: 8,
                    marginBottom: 8,
                    width: 200,
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa", marginLeft: 20 }}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
                <Text style={styles.pet_pro}>Giống: </Text>
                <View style={styles.pet_info_input}>
                  <TextInput
                    style={styles.pet_pro_val}
                    placeholder="Giống thú cưng"
                    value={addPetBreed}
                    onChangeText={setAddPetBreed}
                    // multiline={true}
                  ></TextInput>
                </View>

                <Text style={styles.pet_pro}>Giới tính: </Text>
                <DropDownPicker
                  items={gender}
                  value={addPetGender}
                  open={genderOpen}
                  setOpen={setGenderOpen}
                  placeholder="Chọn giới tính"
                  placeholderStyle={{ fontFamily: "lexend-light" }}
                  setValue={setAddPetGender}
                  setItems={setGender}
                  style={styles.dropdown}
                  labelStyle={{ fontFamily: "lexend-light" }}
                  onOpen={onGenderOpen}
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  containerStyle={{
                    margin: 20,
                    marginTop: 8,
                    marginBottom: 8,
                    width: 200,
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa", marginLeft: 20 }}
                  zIndex={3000}
                  zIndexInverse={1000}
                />

                <Text style={styles.pet_pro}>Ngày sinh: </Text>
                <View style={styles.pet_info_input}>
                  <DatePicker
                    style={styles.datePicker}
                    date={addPetBirthdate}
                    mode="date"
                    format="DD-MM-YYYY"
                    placeholder="Chọn ngày sinh"
                    confirmBtnText="Xác nhận"
                    cancelBtnText="Hủy"
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        alignItems: "flex-start",
                      },
                      dateText: {
                        fontFamily: "lexend-light",
                      },
                      placeholderText: {
                        fontFamily: "lexend-light",
                        color: "#888888",
                      },
                    }}
                    onDateChange={(date) => setAddPetBirthdate(date)}
                    useNativeDriver
                  />
                </View>

                <Text style={styles.pet_pro}>Cân nặng (kg): </Text>
                <View style={styles.pet_info_input}>
                  <TextInput
                    style={styles.pet_pro_val}
                    placeholder="Cân nặng thú cưng"
                    value={addPetWeight}
                    keyboardType="numbers-and-punctuation"
                    onChangeText={setAddPetWeight}
                    // multiline={true}
                  ></TextInput>
                </View>

                <Text style={styles.pet_pro}>Màu lông: </Text>
                <DropDownPicker
                  items={hairColor}
                  value={addPetHairColor}
                  open={hairColorOpen}
                  setOpen={setHairColorOpen}
                  placeholder="Chọn màu lông"
                  placeholderStyle={{ fontFamily: "lexend-light" }}
                  setValue={setAddPetHairColor}
                  setItems={setHairColor}
                  style={styles.dropdown}
                  labelStyle={{ fontFamily: "lexend-light" }}
                  onOpen={onHairColorOpen}
                  labelProps={{
                    numberOfLines: 1,
                  }}
                  containerStyle={{
                    margin: 20,
                    marginTop: 8,
                    marginBottom: 8,
                    width: 200,
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa", marginLeft: 20 }}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>
              {!isSelectedPetAvatar ? (
                <TouchableOpacity onPress={pickPetAvatar}>
                  <Image
                    style={styles.pet_img}
                    source={require("../../assets/images/avatar_pet.png")}
                  ></Image>
                  {/* Màn hình xám trong suốt */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 134,
                      width: 100,
                      borderRadius: 12,
                    }}
                  >
                    {/* Icon thay đổi ảnh */}
                    <View>
                      <Ionicons name="image-outline" size={24} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={pickPetAvatar}>
                  <Image
                    style={styles.pet_img}
                    source={{ uri: addPetAvatar }}
                  ></Image>
                  {/* Màn hình xám trong suốt */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 134,
                      width: 100,
                      borderRadius: 12,
                    }}
                  >
                    {/* Icon thay đổi ảnh */}
                    <View>
                      <Ionicons name="image-outline" size={24} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.add_button}
              onPress={addPet}
              disabled={
                addPetName === "" ||
                // addPetAvatar === "" ||
                addPetBirthdate === "" ||
                addPetBreed === "" ||
                addPetGender === "" ||
                addPetHairColor === "" ||
                addPetType === ""
              }
            >
              <Text style={styles.add}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    width: "100%",
    marginTop: -4,
  },
  pet_info_input: {
    borderColor: "#B7B7B7",
    borderWidth: 1,
    margin: 20,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    height: 48,
    padding: 8,
  },
  dropdownType: {
    marginHorizontal: 10,
    width: "50%",
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  line3: {
    width: "100%",
    height: 0.7,
    backgroundColor: "#EFEBEB",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "50%",
  },
  row12: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  edit_label: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-medium",
  },
  edit_name_input: {
    fontSize: 18,
    color: "#39A3C0",
    fontFamily: "lexend-light",
  },
  edit_intro_input: {
    fontSize: 18,
    // height: 52,
    color: "#39A3C0",
    fontFamily: "lexend-light",
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
    height: "80%",
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
    height: "8%",
    borderRadius: 12,
    backgroundColor: "#FFF6F6",
  },
  account_name2: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  background: {
    width: 300,
    height: 300,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "7%",
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
    width: 120,
    height: 80,
    marginTop: 80,
    marginRight: 30,
    marginLeft: 30,
  },
  label: {
    color: "white",
    fontFamily: "lexend-regular",
    marginTop: 54,
    fontSize: 16,
    marginLeft: "auto",
    marginRight: "auto",
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
  container: {
    width: "100%",
    height: "90%",
    backgroundColor: "#ffffff",
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
  line: {
    width: 360,
    height: 1,
    backgroundColor: "#FCAC9E",
    marginLeft: "auto",
    marginRight: "auto",
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
  row8: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    // paddingBottom: 10,
    // alignItems: "center",
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
    borderRadius: 50,
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
  myedit_button: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#8F1928",
    borderRadius: 12,
    width: 180,
    height: 25,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
    marginRight: 24,
    marginLeft: 16,
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
    marginRight: 24,
    marginLeft: 16,
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
    marginTop: 20,
    marginBottom: 20,
  },
  add_pet: {
    height: 134,
    width: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F5817E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
    marginRight: 8,
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
  pet_name_edit: {
    fontSize: 18,
    color: "#F5817E",
    fontFamily: "lexend-medium",
    alignSelf: "center",
    marginBottom: 20,
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
    // marginTop: 20,
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
    borderRadius: 50,
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
    // marginBottom: 0,
  },
});
