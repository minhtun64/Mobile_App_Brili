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
import moment from "moment";

import { useSwipe } from "../../hooks/useSwipe";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { database } from "../../firebase";
import { onValue, ref, get, set, push, remove } from "firebase/database";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import getStatusInfo from "../../firebase_functions/getStatusInfo";

const Tab = createMaterialTopTabNavigator();
const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
export default function C_SearchScreen({ navigation }) {
  const myUserId = "10"; // VÍ DỤ
  const [fontLoaded, setFontLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);
  const [recording, setRecording] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
  function onSwipeLeft() {
    //navigation.goBack();
  }

  function onSwipeRight() {
    navigation.goBack();
  }

  const deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      console.log("There was an error deleting recording file", error);
    }
  };

  const getTranscription = async () => {
    setIsFetching(true);
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;

      const base64content: string = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const body = {
        audio: { content: base64content },
        config: {
          enableAutomaticPunctuation: true,
          encoding: "LINEAR16",
          languageCode: "vi-VN",
          model: "default",
          sampleRateHertz: 44100,
        },
      };

      const transcriptResponse = await fetch(
        "https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AIzaSyATOBs4KUVhKDnk56MxhgOJtN8_Pw1Z280",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      const data = await transcriptResponse.json();
      console.log(data);

      console.log(data.results);
      const message =
        (data.results && data.results[0].alternatives[0].transcript) || "";
      var str = message;
      let lastDotIndex = str.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        str = str.substring(0, lastDotIndex) + str.substring(lastDotIndex + 1);
      }
      // if (str <> null) {

      // }
      console.log(str);
      if (str != undefined) {
        setSearchQuery(str);
      }
    } catch (error) {
      console.log("There was an error reading file", error);
      stopRecording();
      resetRecording();
    }
    setIsFetching(false);
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      setIsRecording(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      console.log("Start !!!");
      setRecording(recording);
    } catch (error) {
      console.log(error);
      stopRecording();
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {}
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
  };

  const resetRecording = () => {
    deleteRecordingFile();
    setRecording(null);
  };

  const start = () => {
    console.log("start recording");
    startRecording();
  };

  const stop = async () => {
    console.log("stop recording");
    stopRecording();
    await getTranscription();
    await console.log(searchQuery);
    setHasSubmittedQuery(true);
  };

  useEffect(() => {
    if (searchQuery != "") {
      searchPosts();
      searchUsers();
      searchClinics();
    }
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    if (searchQuery != "") {
      setHasSubmittedQuery(true);
      searchPosts();
      searchUsers();
      searchClinics();
    }
  };

  function AllScreen() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Text style={styles.text}>MỌI NGƯỜI</Text>
          {searchedUsers.length > 0 ? (
            <View style={styles.newsfeed}>
              <View style={styles.account_list}>
                {searchedUsers.map((user) => {
                  return (
                    <View style={styles.row5} key={user.userId}>
                      <View style={styles.row4}>
                        <TouchableOpacity>
                          {/* Ảnh đại diện người dùng */}
                          <Image
                            style={styles.avatar60}
                            source={{ uri: user.userAvatar }}
                          ></Image>
                        </TouchableOpacity>
                        <View>
                          <TouchableOpacity>
                            {/* Tên người dùng */}
                            <Text style={styles.account_name}>
                              {user.userName}
                            </Text>
                          </TouchableOpacity>
                          {/* Tiểu sử người dùng */}
                          <Text style={styles.account_bio}>
                            {user.userIntro}
                          </Text>
                        </View>
                      </View>
                      {/* Tùy chọn Follow */}
                      {user.userId !== myUserId &&
                        (user.isFollowing ? (
                          <TouchableOpacity
                            style={styles.following_button}
                            onPress={() =>
                              handleFollowButton(user.userId, user.isFollowing)
                            }
                          >
                            <Text style={styles.following_text}>
                              Đang theo dõi
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.follow_button}
                            onPress={() =>
                              handleFollowButton(user.userId, user.isFollowing)
                            }
                          >
                            <Text style={styles.follow_text}>Theo dõi</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text style={styles.no_result}>Không có kết quả tìm kiếm</Text>
          )}
          <Text style={styles.text}>BÀI VIẾT</Text>
          {searchedPosts.length > 0 ? (
            <View style={styles.newsfeed2}>
              {searchedPosts.map((post) => {
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
                        userName: post.name,
                        userAvatar: post.avatar,
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
                      <View style={styles.row7}>
                        {post.userAvatar && (
                          <TouchableOpacity>
                            <Image
                              style={styles.avatar50}
                              source={{ uri: post.userAvatar }}
                            ></Image>
                          </TouchableOpacity>
                        )}
                        <View>
                          <TouchableOpacity>
                            {/* Tên người đăng */}
                            <Text style={styles.status_name}>
                              {post.userName}
                            </Text>
                          </TouchableOpacity>
                          {/* Thời gian đăng */}
                          <Text style={styles.status_date}>
                            {post.formattedDate}
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
                      {post.content}
                    </Text>
                    {/* Ảnh / Video Status */}
                    {post.media && (
                      <TouchableOpacity>
                        <Image
                          style={styles.status_image}
                          source={{ uri: post.media }}
                        />
                      </TouchableOpacity>
                    )}
                    {/* Like / Comment / Share */}
                    <View style={styles.row6}>
                      <View style={styles.row7}>
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
            </View>
          ) : (
            <Text style={styles.no_result}>Không có kết quả tìm kiếm</Text>
          )}
          {/* NỘI DUNG MỘT STATUS */}
        </ScrollView>
      </View>
    );
  }

  // BÀI VIẾT
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [cachedPostData, setCachedPostData] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const searchPosts = async () => {
    try {
      // Lấy danh sách bài đăng từ Firebase
      const postsRef = ref(database, "post");
      onValue(postsRef, async (snapshot) => {
        const postsData = snapshot.val();

        // Lọc danh sách bài đăng của nội dung khớp với từ khóa
        const filteredPosts = Object.values(postsData).filter((post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
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
        setSearchedPosts(statusResults);
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
      const updatedSearchedPosts = searchedPosts.map((post) => {
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
      setSearchedPosts(updatedSearchedPosts);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };
  function PostScreen() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {searchedPosts.length > 0 ? (
            <View style={styles.newsfeed2}>
              {searchedPosts.map((post) => {
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
                        userName: post.name,
                        userAvatar: post.avatar,
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
                      <View style={styles.row7}>
                        {post.userAvatar && (
                          <TouchableOpacity>
                            <Image
                              style={styles.avatar50}
                              source={{ uri: post.userAvatar }}
                            ></Image>
                          </TouchableOpacity>
                        )}
                        <View>
                          <TouchableOpacity>
                            {/* Tên người đăng */}
                            <Text style={styles.status_name}>
                              {post.userName}
                            </Text>
                          </TouchableOpacity>
                          {/* Thời gian đăng */}
                          <Text style={styles.status_date}>
                            {post.formattedDate}
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
                      {post.content}
                    </Text>
                    {/* Ảnh / Video Status */}
                    {post.media && (
                      <TouchableOpacity>
                        <Image
                          style={styles.status_image}
                          source={{ uri: post.media }}
                        />
                      </TouchableOpacity>
                    )}
                    {/* Like / Comment / Share */}
                    <View style={styles.row6}>
                      <View style={styles.row7}>
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
            </View>
          ) : (
            <Text style={styles.no_result}>Không có kết quả tìm kiếm</Text>
          )}
          {/* NỘI DUNG MỘT STATUS */}
        </ScrollView>
      </View>
    );
  }

  // NGƯỜI
  const [searchedUsers, setSearchedUsers] = useState([]);
  const searchUsers = async () => {
    const usersRef = ref(database, "user");
    const usersSnapshot = await get(usersRef);
    const users = [];
    if (usersSnapshot.exists()) {
      usersSnapshot.forEach((userSnapshot) => {
        const user = userSnapshot.val();
        if (
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          user.role == 1
        ) {
          users.push({
            userId: userSnapshot.key,
            userName: user.name,
            userAvatar: user.avatar,
            userIntro: user.intro,
            isFollowing: false, // Thay đổi giá trị tùy thuộc vào trạng thái theo dõi
          });
        }
      });
    }

    const currentUserFollowedRef = ref(database, `follow/${myUserId}`);
    const currentUserFollowedSnapshot = await get(currentUserFollowedRef);

    // Cập nhật giá trị isFollowing cho từng người trong danh sách searchedUsers
    const updatedUsers = users.map((user) => {
      if (user.userId === myUserId) {
        // Nếu người dùng trong danh sách là người hiện tại (tôi)
        return {
          ...user,
          isFollowing: true, // Đánh dấu là tôi đang theo dõi chính mình
        };
      } else if (
        currentUserFollowedSnapshot.exists() &&
        currentUserFollowedSnapshot.child(user.userId).exists()
      ) {
        // Nếu người dùng trong danh sách được theo dõi bởi tôi
        return {
          ...user,
          isFollowing: true,
        };
      } else {
        // Nếu người dùng trong danh sách không được theo dõi bởi tôi
        return user;
      }
    });

    const sortedUsers = [...updatedUsers];
    sortedUsers.sort((a, b) => {
      // Sắp xếp theo yêu cầu của bạn
      if (a.userId === myUserId) {
        return -1; // Đưa tôi lên đầu danh sách
      } else if (b.userId === myUserId) {
        return 1;
      } else if (a.isFollowing && !b.isFollowing) {
        return -1; // Đưa những người tôi đang theo dõi lên trước
      } else if (!a.isFollowing && b.isFollowing) {
        return 1;
      } else {
        return 0;
      }
    });
    setSearchedUsers(sortedUsers);
    // setSearchedUsers(updatedUsers);
    // sortSearchedUsers(updatedUsers);
  };
  // THEO DÕI/HỦY THEO DÕI
  const handleFollowButton = (userId, isFollowing) => {
    if (isFollowing) {
      // Hủy theo dõi
      const followerRef = ref(database, `follow/${myUserId}/${userId}`);
      remove(followerRef);
      updateFollowingStatus(userId, false);
    } else {
      // Theo dõi
      const followData = {
        date: moment().format("DD-MM-YYYY HH:mm:ss"),
      };
      set(ref(database, `follow/${myUserId}/${userId}`), followData);
      updateFollowingStatus(userId, true);
    }
  };
  const updateFollowingStatus = (userId, isFollowing) => {
    setSearchedUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userId === userId) {
          return {
            ...user,
            isFollowing: isFollowing,
          };
        }
        return user;
      })
    );
    setSearchedClinics((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userId === userId) {
          return {
            ...user,
            isFollowing: isFollowing,
          };
        }
        return user;
      })
    );
  };

  function UserScreen() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {searchedUsers.length > 0 ? (
            <View style={styles.newsfeed}>
              <View style={styles.account_list}>
                {searchedUsers.map((user) => {
                  return (
                    <View style={styles.row5} key={user.userId}>
                      <View style={styles.row4}>
                        <TouchableOpacity>
                          {/* Ảnh đại diện người dùng */}
                          <Image
                            style={styles.avatar60}
                            source={{ uri: user.userAvatar }}
                          ></Image>
                        </TouchableOpacity>
                        <View>
                          <TouchableOpacity>
                            {/* Tên người dùng */}
                            <Text style={styles.account_name}>
                              {user.userName}
                            </Text>
                          </TouchableOpacity>
                          {/* Tiểu sử người dùng */}
                          <Text style={styles.account_bio}>
                            {user.userIntro}
                          </Text>
                        </View>
                      </View>
                      {/* Tùy chọn Follow */}
                      {user.userId !== myUserId &&
                        (user.isFollowing ? (
                          <TouchableOpacity
                            style={styles.following_button}
                            onPress={() =>
                              handleFollowButton(user.userId, user.isFollowing)
                            }
                          >
                            <Text style={styles.following_text}>
                              Đang theo dõi
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.follow_button}
                            onPress={() =>
                              handleFollowButton(user.userId, user.isFollowing)
                            }
                          >
                            <Text style={styles.follow_text}>Theo dõi</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text style={styles.no_result}>Không có kết quả tìm kiếm</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  // PHÒNG KHÁM
  const [searchedClinics, setSearchedClinics] = useState([]);
  const searchClinics = async () => {
    const usersRef = ref(database, "user");
    const usersSnapshot = await get(usersRef);
    const users = [];
    if (usersSnapshot.exists()) {
      usersSnapshot.forEach((userSnapshot) => {
        const user = userSnapshot.val();
        if (
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          user.role == 2
        ) {
          users.push({
            userId: userSnapshot.key,
            userName: user.name,
            userAvatar: user.avatar,
            userIntro: user.intro,
            isFollowing: false, // Thay đổi giá trị tùy thuộc vào trạng thái theo dõi
          });
        }
      });
    }

    const currentUserFollowedRef = ref(database, `follow/${myUserId}`);
    const currentUserFollowedSnapshot = await get(currentUserFollowedRef);

    // Cập nhật giá trị isFollowing cho từng người trong danh sách searchedUsers
    const updatedUsers = users.map((user) => {
      if (user.userId === myUserId) {
        // Nếu người dùng trong danh sách là người hiện tại (tôi)
        return {
          ...user,
          isFollowing: true, // Đánh dấu là tôi đang theo dõi chính mình
        };
      } else if (
        currentUserFollowedSnapshot.exists() &&
        currentUserFollowedSnapshot.child(user.userId).exists()
      ) {
        // Nếu người dùng trong danh sách được theo dõi bởi tôi
        return {
          ...user,
          isFollowing: true,
        };
      } else {
        // Nếu người dùng trong danh sách không được theo dõi bởi tôi
        return user;
      }
    });

    const sortedUsers = [...updatedUsers];
    sortedUsers.sort((a, b) => {
      // Sắp xếp theo yêu cầu của bạn
      if (a.userId === myUserId) {
        return -1; // Đưa tôi lên đầu danh sách
      } else if (b.userId === myUserId) {
        return 1;
      } else if (a.isFollowing && !b.isFollowing) {
        return -1; // Đưa những người tôi đang theo dõi lên trước
      } else if (!a.isFollowing && b.isFollowing) {
        return 1;
      } else {
        return 0;
      }
    });
    setSearchedClinics(sortedUsers);
  };
  function ClinicScreen() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {searchedClinics.length > 0 ? (
            <View style={styles.newsfeed}>
              <View style={styles.account_list}>
                {searchedClinics.map((user) => (
                  <View style={styles.row5} key={user.userId}>
                    <View style={styles.row4}>
                      <TouchableOpacity>
                        {/* Ảnh đại diện người dùng */}
                        <Image
                          style={styles.avatar60}
                          source={{ uri: user.userAvatar }}
                        ></Image>
                      </TouchableOpacity>
                      <View>
                        <TouchableOpacity>
                          {/* Tên người dùng */}
                          <Text style={styles.account_name}>
                            {user.userName}
                          </Text>
                        </TouchableOpacity>
                        {/* Tiểu sử người dùng */}
                        <Text style={styles.account_bio}>{user.userIntro}</Text>
                      </View>
                    </View>
                    {/* Tùy chọn Follow */}
                    {user.userId !== myUserId &&
                      (user.isFollowing ? (
                        <TouchableOpacity
                          style={styles.following_button}
                          onPress={() =>
                            handleFollowButton(user.userId, user.isFollowing)
                          }
                        >
                          <Text style={styles.following_text}>
                            Đang theo dõi
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.follow_button}
                          onPress={() =>
                            handleFollowButton(user.userId, user.isFollowing)
                          }
                        >
                          <Text style={styles.follow_text}>Theo dõi</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.no_result}>Không có kết quả tìm kiếm</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container2}>
      {/* heading */}
      <View style={styles.heading}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.back}
              source={require("../../assets/icons/chevron-left.png")}
            ></Image>
          </TouchableOpacity>
          <View style={styles.search_box}>
            <TextInput
              style={styles.search_input}
              placeholder="Tìm kiếm trên PetCare"
              placeholderTextColor="#ffffff"
              autoCapitalize="none"
              returnKeyType="search"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setHasSubmittedQuery(false);
              }}
              //   onChangeText={setSearchQuery}
              //   onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus={true}
              onSubmitEditing={handleSearchSubmit}
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              start();
            }}
          >
            <Image
              style={styles.micro}
              source={require("../../assets/icons/micro-active.png")}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View>
          {/* Icon để đóng Modal */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 80,
              left: 20,
              zIndex: 1,
            }}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Image
              source={require("../../assets/icons/close.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          {/* Hình ảnh sẽ hiển thị trong Modal */}
          <Image
            source={require("../../assets/icons/micro-active-gif.gif")}
            style={{
              width: 100,
              height: 100,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 320,
            }}
          />
          <TouchableOpacity
            style={styles.search_button}
            onPress={() => {
              setModalVisible(false);
              stop();
            }}
          >
            <View style={styles.row3}>
              <Image
                source={require("../../assets/icons/search-white.png")}
                style={{
                  width: 30,
                  height: 30,
                  // marginLeft: "auto",
                  // marginRight: "auto",
                  // marginTop: 320,
                }}
              />
              <Text style={styles.search_button_text}>Tìm kiếm</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {hasSubmittedQuery ? (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#8F1928",
            tabBarInactiveTintColor: "#A5A5A5",
            tabBarLabelStyle: {
              fontSize: 14,
              fontFamily: "lexend-regular",
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#8F1928",
            },
          }}
        >
          <Tab.Screen name="Tất cả" component={AllScreen} />
          <Tab.Screen name="Bài viết" component={PostScreen} />
          <Tab.Screen name="Người" component={UserScreen} />
          <Tab.Screen name="Phòng khám" component={ClinicScreen} />
        </Tab.Navigator>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Text style={styles.search_text}>
            Thử tìm kiếm mọi người, chủ đề hoặc từ khóa
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    width: "100%",
    height: "90%",
    backgroundColor: "#ffffff",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF6F6",
  },
  heading: {
    width: "100%",
    height: "14%",
    // backgroundColor: "red",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#FFF6F6",
  },
  text: {
    fontSize: 18,
    fontFamily: "lexend-semibold",
    marginLeft: 24,
    marginTop: 24,
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
    height: 180,
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
  content: {
    flex: 1,
    // marginTop: 40,
    // backgroundColor: "red",
  },
  newsfeed: {
    // backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newsfeed2: {
    backgroundColor: "#FFF6F6",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  avatar50: {
    width: 50,
    height: 50,
    margin: 8,
    borderRadius: 50,
  },
  row6: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  micro: {
    width: 32,
    height: 32,
    marginRight: 4,
    // marginTop: 4,
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
  row5: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 8,
  },
  row7: {
    //width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    //paddingLeft: "6%",
    paddingBottom: 4,
    // backgroundColor: "black",
    alignItems: "center",
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
    // paddingTop: 10,
    // paddingBottom: 10,
    alignItems: "center",
  },
  row4: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 2,
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
  status_input: {
    fontSize: 18,
    padding: 16,
    marginTop: 8,
    fontFamily: "lexend-regular",
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
  search_text: {
    fontSize: 14,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 24,
    fontFamily: "lexend-regular",
  },
  search_button: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#F5817E",
    borderRadius: 12,
    width: "40%",
    // height: 30,
    marginTop: 200,
    alignSelf: "center",
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
  },
  search_button_text: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "lexend-medium",
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
    borderRadius: 50,
  },
  account_name: {
    fontSize: 14,
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
    height: 28,
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
  no_result: {
    fontSize: 14,
    color: "grey",
    fontFamily: "lexend-medium",
    marginLeft: "auto",
    marginRight: "auto",

    marginTop: 20,
  },
  following_button: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#8F1928",
    borderRadius: 12,
    width: 114,
    height: 28,
    justifyContent: "center", // căn giữa theo chiều dọc
    alignItems: "center", // căn giữa theo chiều ngang
    // marginRight: 24,
    // marginLeft: 16,
  },
  following_text: {
    fontSize: 14,
    color: "#8F1928",
    fontFamily: "lexend-medium",
    //marginLeft: "6%",
    //marginTop: -48,
  },
});
