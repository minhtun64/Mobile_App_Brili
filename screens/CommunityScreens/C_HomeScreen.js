import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
  Animated,
  Modal,
  RefreshControl,
} from "react-native";

import {
  useNavigation,
  useScrollToTop,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { Audio, Video, ResizeMode } from "expo-av";
import * as Font from "expo-font";
import moment from "moment";
import { database } from "../../firebase";
import { onValue, ref, get, set, push } from "firebase/database";
import getStatusInfo from "../../firebase_functions/getStatusInfo";
import ShakeBackgroundImage from "../../components/ShakeBackgroundImage";
import TextAnimation from "../../components/TextAnimation";
import { UserContext } from "../../UserIdContext";

export default function C_HomeScreen({ navigation }) {
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

  // LẤY DANH SÁCH CÁC BÀI ĐĂNG (REAL-TIME)
  const [recentPosts, setRecentPosts] = useState([]);
  const [cachedPostData, setCachedPostData] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);

  const fetchRecentPosts = async () => {
    try {
      const userRef = ref(database, `user/${myUserId}`);
      onValue(userRef, async (snapshot) => {
        const userData = snapshot.val();
        setMyAvatar(userData.avatar);
      });

      // Lấy danh sách bài đăng từ Firebase
      const postsRef = ref(database, "post");
      onValue(postsRef, async (snapshot) => {
        const postsData = snapshot.val();
        const sortedPosts = Object.values(postsData).sort((a, b) => {
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

  useFocusEffect(
    React.useCallback(() => {
      fetchRecentPosts();
    }, [])
  );

  // CUỘN XUỐNG ĐỂ CẬP NHẬT SỐ LƯỢNG LIKE/COMMENT (KHÔNG REAL-TIME)
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
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

  //VIDEO
  const video = React.useRef(null);
  const [status, setStatus] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);

  if (!fontLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      {/* heading */}
      <View style={styles.heading}></View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("C_Profile", {
                  userId: myUserId,
                })
              }
            >
              <Image style={styles.avatar60} source={{ uri: myAvatar }}></Image>
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

          {/* DANH SÁCH BÀI ĐĂNG */}
          {recentPosts.map((post) => {
            const isLiked = likedPosts.some(
              (likedPost) => likedPost.postId === post.postId
            );
            return (
              <TouchableOpacity
                key={post.postId}
                style={styles.status}
                onPress={() => {
                  navigation.navigate("C_Status", {
                    postId: post.postId,
                    userId: post.userId,
                    userName: post.userName,
                    userAvatar: post.userAvatar,
                    content: post.content,
                    media: post.media,
                    mediaType: post.mediaType,
                    formattedDate: post.formattedDate,
                    likeCount: post.likeCount,
                    likedUsers: post.likedUsers,
                    commentCount: post.commentCount,
                    isLiked: isLiked,
                  });
                  // setIsMuted(true);
                  video.current.pauseAsync();
                }}
              >
                <View style={styles.row}>
                  <View style={styles.row2}>
                    {/* Avatar người đăng */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("C_Profile", {
                          userId: post.userId,
                        })
                      }
                    >
                      <Image
                        style={styles.avatar50}
                        source={{ uri: post.userAvatar }}
                      ></Image>
                    </TouchableOpacity>
                    <View>
                      <TouchableOpacity>
                        {/* Tên người đăng */}
                        <Text style={styles.status_name}>{post.userName}</Text>
                      </TouchableOpacity>
                      {/* Thời gian đăng */}
                      <Text style={styles.status_date}>
                        {post.formattedDate}
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
                          ref={video}
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
                <View style={styles.row}>
                  <View style={styles.row2}>
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
                      onPress={() =>
                        navigation.navigate("C_Status", { postId: post.postId })
                      }
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
          {/* DANH SÁCH BÀI ĐĂNG */}
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
    borderRadius: 50,
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
