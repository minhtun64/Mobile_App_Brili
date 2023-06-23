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
  useFocusEffect,
} from "@react-navigation/native";
import * as Font from "expo-font";

import { useSwipe } from "../../hooks/useSwipe";
import { AntDesign } from "@expo/vector-icons";

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
import getStatusInfo from "../../firebase_functions/getStatusInfo";
import moment from "moment";
import { Audio } from "expo-av";

export default function C_ProfileScreen({ navigation }) {
  const myUserId = "10"; // VÍ DỤ

  // LẤY THAM SỐ ĐƯỢC TRUYỀN TỪ MÀN HÌNH TRƯỚC
  const route = useRoute();
  const userId = route?.params?.userId;
  console.log(userId);
  // console.log(userId);

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
      set(ref(database, `follow/${myUserId}/${userId}`), followData);
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
          <TouchableOpacity style={styles.chat_border}>
            <Image
              style={styles.chat}
              source={require("../../assets/icons/chat.png")}
            ></Image>
          </TouchableOpacity>
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
            <View style={styles.row3}>
              {pets.map((pet, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={{
                      marginRight: 8,
                      marginLeft: 8,
                    }}
                    onPress={() => openPetInfo(index)}
                  >
                    {pet.avatar && (
                      <Image
                        style={styles.pet_img}
                        source={{ uri: pet.avatar }}
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
                        {pet.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

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
                  onPress={closePetInfo}
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
                          <Text style={styles.pet_pro_val}>{pet.type}</Text>
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
