import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { database } from "../../../firebase";
import { ref, get } from "firebase/database";

import { UserContext } from "../../../UserIdContext";
import ChatListHeader from "./ChatListHeader";
import CardItem from "./CardItem";

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
        const nodeValue = childSnapshot.val();
        if (Object.values(nodeValue.participants).includes(myUserId)) {
          if (myUserId !== nodeValue.participants.user1) {
            itemList.push({
              id: childSnapshot.key,
              ...nodeValue.messages.pop(),
            });
            userIdList.push(nodeValue.participants.user1);
          } else {
            itemList.push({
              id: childSnapshot.key,
              ...nodeValue.messages.pop(),
            });
            userIdList.push(nodeValue.participants.user2);
          }
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
    return (
      <Text style={{ marginTop: "12%", marginLeft: "4%" }}>Loading...</Text>
    );
  }

  return (
    <View style={styles.container}>
      <ChatListHeader />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
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
});

export default M_ChatListScreen;
