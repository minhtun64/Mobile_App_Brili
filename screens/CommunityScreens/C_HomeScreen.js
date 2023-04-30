import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  Modal,
  RefreshControl,
} from "react-native";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import moment from "moment";
import { database } from "../../firebase";
import { onValue, ref, get, set, push } from "firebase/database";
import getStatusInfo from "../../firebase_functions/getStatusInfo";
import ShakeBackgroundImage from "../../components/ShakeBackgroundImage";
import TextAnimation from "../../components/TextAnimation";

export default function C_HomeScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [cachedPostData, setCachedPostData] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);

  const fetchRecentPosts = async () => {
    try {
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
          const postId = post.id;

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
        const likedPosts = statusResults.filter(
          (post) => post.likedUsers.some((user) => user.userId === "10") //VÍ DỤ ID USER HIỆN TẠI = 10
        );
        setLikedPosts(likedPosts);
      });
    } catch (error) {
      console.error("Error retrieving recent posts:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchRecentPosts();
    });

    return unsubscribe;
  }, [navigation]);

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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecentPosts();
    setRefreshing(false);
  };

  const handleLikePost = async (postId, isLiked) => {
    try {
      const userId = "10"; //VÍ DỤ ID USER HIỆN TẠI = 10
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

        // Xóa bài viết đã được like khỏi danh sách likedPosts
        const updatedLikedPosts = likedPosts.filter(
          (post) => post.postId !== postId
        );
        setLikedPosts(updatedLikedPosts);
      } else {
        // Like the post
        const likeData = {
          date: moment().format("DD-MM-YYYY HH:mm:ss"),
        };
        await set(ref(database, `like/${postId}/${userId}/0`), likeData);

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

  if (!fontLoaded) {
    return null; // hoặc hiển thị một spinner để hiển thị khi đang tải font
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
                    userName: post.userName,
                    userAvatar: post.userAvatar,
                    content: post.content,
                    media: post.media,
                    formattedDate: post.formattedDate,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                    isLiked: isLiked,
                  })
                }
              >
                <View style={styles.row}>
                  <View style={styles.row2}>
                    <TouchableOpacity>
                      {/* Ảnh đại diện người đăng */}
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
                <TouchableOpacity>
                  <Image
                    style={styles.status_image}
                    source={{ uri: post.media }}
                  />
                </TouchableOpacity>

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
