import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextInput,
  Text,
  ScrollView,
} from "react-native";
import { UserContext } from "../../../UserIdContext";
import searchUsers from "../../../firebase_functions/searchUsers";

function M_SearchUserScreen({ navigation }) {
  const myUserId = useContext(UserContext).userId;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [hasSubmittedQuery, setHasSubmittedQuery] = useState(false);

  const handleInputSubmit = async (textInput) => {
    try {
      setHasSubmittedQuery(true);
      let usersData = await searchUsers(myUserId, textInput);
      setSearchedUsers(usersData);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* heading */}
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.backIcon}
            source={require("../../../assets/icons/back.png")}
          ></Image>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#8C8C8C"
            returnKeyType="search"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleInputSubmit(text);
            }}
            autoFocus={true}
          ></TextInput>
        </View>
      </View>
      {/* users list */}
      {!hasSubmittedQuery ? (
        <Text style={styles.searchText}>
          Thử tìm kiếm mọi người để tiếp tục hoặc tạo mới cuộc trò chuyện
        </Text>
      ) : (
        // <View></View>
        <View style={styles.container}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {searchedUsers.length > 0 ? (
              <View style={styles.newsfeed}>
                <View style={styles.accountList}>
                  {searchedUsers.map((user) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {}}
                        style={styles.userCard}
                        key={user.userId}
                      >
                        <View style={styles.userInfo}>
                          <View>
                            {/* Ảnh đại diện người dùng */}
                            <Image
                              style={styles.avatar}
                              source={{ uri: user.userAvatar }}
                            ></Image>
                          </View>
                          <View>
                            <TouchableOpacity>
                              {/* Tên người dùng */}
                              <Text style={styles.accountName}>
                                {user.userName}
                              </Text>
                            </TouchableOpacity>
                            {/* Tiểu sử người dùng */}
                            <Text style={styles.accountBio}>
                              {user.userIntro}
                            </Text>
                          </View>
                        </View>
                        {/* Tùy chọn Follow */}
                        {user.userId !== myUserId &&
                          (user.isFollowing ? (
                            <TouchableOpacity
                              style={styles.followingBtn}
                              onPress={() =>
                                handleFollowButton(
                                  user.userId,
                                  user.isFollowing
                                )
                              }
                            >
                              <Text style={styles.followingText}>
                                Đang theo dõi
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View></View>
                          ))}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              <Text style={styles.noResult}>Không có kết quả tìm kiếm</Text>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
  },
  // header
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: "6%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(252, 172, 158, 0.5)",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    marginHorizontal: "2%",
  },
  backIcon: {
    width: 36,
    height: 30,
  },
  searchBox: {
    width: "100%",
    paddingVertical: "3%",
    paddingRight: 16,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "lexend-regular",
  },
  // user list
  searchText: {
    width: "98%",
    position: "absolute",
    top: "24%",
    fontSize: 15,
    textAlign: "center",
    color: "#F5817E",
    fontFamily: "lexend-light",
  },
  content: {
    flex: 1,
  },
  newsfeed: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  accountList: {
    backgroundColor: "#ffffff",
    width: "90%",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  userCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 2,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    marginVertical: 12,
    marginRight: 12,
    borderRadius: 25,
  },
  accountName: {
    fontSize: 14,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },
  accountBio: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "lexend-light",
  },
  followingBtn: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#8F1928",
    borderRadius: 12,
    width: 114,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  followingText: {
    fontSize: 14,
    color: "#8F1928",
    fontFamily: "lexend-medium",
  },
  noResult: {
    fontSize: 14,
    color: "grey",
    fontFamily: "lexend-medium",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },
});

export default M_SearchUserScreen;
