import {
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
} from "react-native";
import React, { Component, useState, useEffect } from "react";
import * as Font from "expo-font";
import { database } from "../../firebase";
import { onValue, ref, get, set, push, query, orderByChild, equalTo } from "firebase/database";

export default function M_MessagesScreen({ navigation }) {
  const myUserId = 10; // VÍ DỤ
  let [usersData, receivedMessages] = [[], [], []];
  // let filterArray = [];

  //Load danh sách tin nhắn
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  const fetchRecentMessages = async () => {
    let senderIDs = [];

    const messagesRef = ref(database, 'message');
    const queryRef = query(messagesRef, orderByChild("receiver_id"), equalTo(myUserId));

    get(queryRef)
      .then((snapshot) => {
        let i = 1;
        snapshot.forEach((childSnapshot) => {
          const msContent = childSnapshot.child("content").val();
          const msTimestamp = childSnapshot.child("timestamp").val();
          const msSenderID = childSnapshot.child("sender_id").val();
          const nodeValue = {
            id: i++,
            content: msContent,
            timestamp: msTimestamp,
            sender_id: msSenderID,
          };
          receivedMessages.push(nodeValue);
          senderIDs.push(msSenderID);
        });

        // Lay thong tin cua cac user
        const userPromises = senderIDs.map((senderid) => {
          const userRef = ref(database, `user/${senderid}`);
          return get(userRef)
            .then((userSnapshot) => {
              const userName = userSnapshot.child("name").val();
              const userAvatar = userSnapshot.child("avatar").val();
              const nodeValue = {
                id: senderid,
                name: userName,
                avatar: userAvatar,
              };
              usersData.push(nodeValue);
            })
            .catch((error) => {
              console.error("Lỗi:", error);
            });
        });

        Promise.all(userPromises)
          .then(() => {
            // Tao mot mang chua cac phan tu la su ket hop giua object messags va user co message.sender_id=user.id
            mergedArray = receivedMessages.map((message) => {
              const user = usersData.find((user) => user.id === message.sender_id);
              return Object.assign({}, message, user);
            });
            setMessages(mergedArray);
          })
          .catch((error) => {
            console.error("Lỗi:", error);
          });
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }

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


  if (!fontLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={[styles.heading]}>
        <View style={[styles.titleContainer, styles.row]}>
          <Text style={styles.title}>Tin nhắn</Text>
          <Image
            style={styles.titleIcon}
            source={require("../../assets/icons/mess-title-icon.png")} />
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Image
            style={styles.searchIcon}
            source={require("../../assets/icons/search.png")} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatCard} onPress={() => navigation.navigate('M_Chat', { userName: item.sender_id })}>
            <View style={[styles.wrapping, styles.row]}>
              <View style={styles.userImgWrapper}>
                <Image style={styles.userImg} source={{ uri: item.avatar }} />
              </View>
              <View style={styles.textSection}>
                <View style={styles.userInfoText}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.previousChatTime}>{item.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '90%',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  heading: {
    width: "100%",
    height: "8%",
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffe5f2',
    backgroundColor: '#ffe5f2',
  },
  titleContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    fontSize: 20,
    fontFamily: "lexend-medium",
    color: "#A51A29",
    marginTop: 16,
  },
  titleIcon:{
    width: 44,
    height: 44,
    marginTop: 8,
  },
  searchBtn: {
    position: 'absolute',
    top: 16,
    right: 10,
  },
  searchIcon: {
    width: 32,
    height: 32,
  },
  content: {
    width: '100%',
    backgroundColor: "#ffffff",
  },
  chatCard: {
    width: '100%',
  },
  wrapping: {
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  },
  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 4,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textSection: {
    width: '83%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9bebf',
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: {
    fontSize: 15,
    fontFamily: "lexend-regular",
  },
  previousChatTime: {
    fontSize: 12,
    color: '#666',
    fontFamily: "lexend-regular",
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: "lexend-light",
  },
});
