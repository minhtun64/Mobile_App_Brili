import {
    TouchableOpacity,
    FlatList,
    Text,
    StyleSheet,
    View,
    Image,
    TextInput,
  } from "react-native";
  import React, { useState, useEffect, useContext } from "react";
  import { database } from "../../firebase";
  import { onValue, ref } from "firebase/database";
  import { formatTime } from "../../components/TimeMessagesUtils";
  import { UserContext } from "../../UserIdContext";
  
  export default function M_ChatListScreen({ navigation }) {
    const myUserIdStr = useContext(UserContext).userId;
    const myUserId = 3; // VÍ DỤ
  
    //Load danh sách tin nhắn
    const [messages, setMessages] = useState([]);
    const [userIDs, setUserIDs] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    var mainUser = {}
  
    useEffect(() => {
      fetchDataFromFirebase();
    }, []);
  
    const fetchDataFromFirebase = async () => {
  
      const userRef = ref(database, `user/${myUserIdStr}`);
  
      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        const myUserIdNo = data.id;
        const senderName = data.name;
        const senderAvatar = data.avatar;
        mainUser = {
          id: myUserIdNo,
          name: senderName,
          avatar: senderAvatar,
        };
  
    })
  
  
  
    const reference = ref(database, '/message');
  
    onValue(reference, async (snapshot) => {
      const data = snapshot.val();
      const filteredMessages = Object.values(data).filter(
        (message) => message.sender_id === myUserId || message.receiver_id === myUserId
      );
  
      const latestMessages = {};
      const userIDs = [];
      const usersArr = [];
  
      try {
        const userRef = ref(database, '/user');
  
        for (const message of filteredMessages) {
          // hien thi tin nhan moi nhat va dinh dang lai thoi gian
          const participants = [message.sender_id, message.receiver_id].sort().join('_');
          if (!latestMessages[participants] || message.timestamp > latestMessages[participants].timestamp) {
            const formattedTime = formatTime(message.timestamp);
            message.formattedTime = formattedTime;
            latestMessages[participants] = message;
          }
  
          // lay thong tin cac doi tuong chat
          const userID = parseInt(participants.replace(new RegExp(`_|${myUserId}`, 'g'), ''));
          if (!userIDs.includes(userID)) {
            userIDs.push(userID);
            onValue(userRef, (snapshot) => {
              const data = snapshot.val();
              const foundUser = Object.values(data).find(user => user.id === userID);
              const senderName = foundUser.name;
              const senderAvatar = foundUser.avatar;
              const newUser = {
                id: userID,
                name: senderName,
                avatar: senderAvatar,
              };
              usersArr[userID] = newUser;
            });
  
          }
        }
        // sap xep tin nhắn theo timestamp moi nhat den cu nhat
        const sortedMessages = Object.values(latestMessages).sort((a, b) => {
          const timestampA = new Date(a.timestamp).getTime();
          const timestampB = new Date(b.timestamp).getTime();
          return timestampB - timestampA;
        });
  
  
        setMessages(sortedMessages);
        setUserIDs(userIDs);
        setUsersData(usersArr);
  
        setLoading(false);
      } catch (error) {
        console.log('Error:', error);
      }
    });
  };
  
  if (loading) {
    return <Text style={{ marginTop: '12%', marginLeft: '4%' }}>Loading...</Text>;
  }
  
  return (
    <View style={styles.container}>
      <View style={[styles.heading]}>
        <View style={[styles.titleRow, styles.row]}>
          <View style={styles.userAvatarContainer}>
            <Image
              style={styles.userAvatar}
              source={{ uri: mainUser.avatar }}
            />
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>Tin nhắn</Text>
            <Image
              style={styles.titleIcon}
              source={require("../../assets/icons/mess-title-icon.png")}
            />
          </View>
        </View>
  
        <TouchableOpacity style={[styles.searchBtn, styles.row]}>
          <Image
            style={styles.searchIcon}
            source={require("../../assets/icons/search.png")} />
          <TextInput style={styles.searchTextInput} placeholder="Tìm kiếm"></TextInput>
        </TouchableOpacity>
  
      </View>
  
  
      <FlatList
        data={messages}
        keyExtractor={item => item.sender_id !== myUserId ? item.sender_id : item.receiver_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            onPress={() =>
              navigation.navigate('M_Chat', {
                propId: usersData[item.sender_id !== myUserId ? item.sender_id : item.receiver_id]?.id,
                propName: usersData[item.sender_id !== myUserId ? item.sender_id : item.receiver_id]?.name,
                propAvatar: usersData[item.sender_id !== myUserId ? item.sender_id : item.receiver_id]?.avatar
              })
            }
          >
            <View style={[styles.wrapping, styles.row]}>
              <View style={styles.userImgWrapper}>
                <Image style={styles.userImg} source={{ uri: usersData[item.sender_id !== myUserId ? item.sender_id : item.receiver_id]?.avatar }} />
              </View>
              <View style={styles.textSection}>
                <View style={styles.userInfoText}>
                  <Text style={styles.userName}>{usersData[item.sender_id !== myUserId ? item.sender_id : item.receiver_id]?.name}</Text>
                  <Text style={styles.previousChatTime}>{item.formattedTime}</Text>
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.messageText}
                >
                  {item.sender_id === myUserId ? `Bạn: ${item.content}` : item.content}
                </Text>
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
    heading: {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: '#ffe5f2',
      backgroundColor: '#FFECF5',
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
    },
    userAvatarContainer: {
      position: 'absolute',
      bottom: 0,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: '9%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    title: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      marginLeft: 10,
      fontSize: 20,
      fontFamily: 'lexend-medium',
      color: '#A51A29',
      marginTop: 16,
    },
    titleIcon: {
      width: 40,
      height: 40,
      marginTop: 8,
    },
    groupchatIconContainer: {
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    groupchatIcon: {
      width: 32,
      height: 32,
    },
    searchBtn: {
      width: '100%',
      height: 32,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      paddingHorizontal: 8,
      paddingVertical: 6,
      paddingVertical: 2,
      marginTop: 18,
      marginBottom: 16,
    },
    searchIcon: {
      width: 32,
      height: 32,
    },
    searchTextInput: {
      fontSize: 14,
      color: '#ccc',
      marginLeft: 4,
    },
  
    // list chat
    content: {
      width: '100%',
      backgroundColor: "#ffffff",
    },
    chatCard: {
      width: '100%',
    },
    wrapping: {
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    userImgWrapper: {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    userImg: {
      width: 50,
      height: 50,
      borderRadius: 26,
    },
    textSection: {
      width: '80%',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 10,
      borderBottomWidth: 0.8,
      borderBottomColor: '#f9bebf',
      paddingTop: '4%',
      paddingBottom: '4%',
    },
    userInfoText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '2.5%',
    },
    userName: {
      fontSize: 15,
      fontFamily: "lexend-light",
    },
    previousChatTime: {
      fontSize: 12,
      color: '#666',
      fontFamily: "lexend-light",
    },
    messageText: {
      width: '94%',
      fontSize: 14,
      color: '#333333',
      fontFamily: "lexend-light",
    },
  });