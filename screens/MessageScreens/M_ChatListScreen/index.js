import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { database } from "../../../firebase";
import { ref, get } from "firebase/database";

import { UserContext } from "../../../UserIdContext";
import ChatListHeader from "./ChatListHeader";
import CardItem from "./CardItem";
import LoadingView from "../LoadingView";

function M_ChatListScreen({ navigation }) {
  let myUserId = useContext(UserContext).userId;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [myUserId]);

  const fetchData = async () => {
    try {
      let itemList = [];
      let userIdList = [];

      let chatListRef = ref(database, `chatList`);
      const snapshot = await get(chatListRef);
      snapshot.forEach((childSnapshot) => {
        let nodeValue = childSnapshot.val();
        let participants = nodeValue.participants;
        let messages = Object.values(nodeValue.messages);

        if (Object.values(participants).includes(myUserId)) {
          let otherUserId =
            myUserId !== participants.user1
              ? participants.user1
              : participants.user2;

          // Lay tin nhan moi nhat cuoi cung
          let lastMessageKey = Object.keys(messages).pop();
          let lastMessage = messages[lastMessageKey];

          itemList.push({
            idChatBox: childSnapshot.key,
            ...lastMessage,
          });

          userIdList.push(otherUserId);
        }
      });

      let arrLength = userIdList.length;
      for (let i = 0; i < arrLength; i++) {
        let userId = userIdList[i];
        let userRef = ref(database, `user/${userId}`);
        let userSnapshot = await get(userRef);
        let userData = userSnapshot.val();

        // thêm thuộc tính vào từng phần tử trong itemList
        itemList[i].userId = userId;
        itemList[i].name = userData.name;
        itemList[i].avatar = userData.avatar;
      }

      setMessages(itemList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (loading) {
    // Show the loading screen
    return <LoadingView />;
  }

  return (
    <View style={styles.container}>
      <ChatListHeader />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.idChatBox}
        renderItem={({ item }) => (
          <CardItem navigation={navigation} data={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  row: {
    flexDirection: "row",
  },
  content: {
    width: "100%",
    backgroundColor: "#ffffff",
  },
  loadingView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBDCE2",
  },
  loadingImg: {
    width: "100%",
    aspectRatio: 1,
  },
});

export default M_ChatListScreen;
