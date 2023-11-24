import { FlatList, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState, useRef, useContext } from "react";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";
import { UserContext } from "../../../UserIdContext";
import ChatItemHeader from "./ChatItemHeader";
import Sender from "../../../components/sender";
import Receiver from "../../../components/receiver";
import TextInputBox from "./TextInputBox";

export default function M_ChatItemScreen({ navigation, route }) {
  const { idChatBox, userId, userName, userAvatar } = route.params;
  const myUserId = useContext(UserContext).userId;
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Hide bottom tabbar
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });

    // Get data of chatbox from firebase
    let chatListRef = ref(database, `chatList/${idChatBox}/messages`);
    onValue(chatListRef, (snapshot) => {
      let messageList = [];
      snapshot.forEach((childSnapshot) => {
        messageList.push({
          idMessage: childSnapshot.key,
          ...childSnapshot.val(),
        })
      });
      setMessages(messageList);
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: messages.length - 1 });
    }
  }, [messages]);

  const getItemLayout = (_, index) => ({
    length: 60, // Set the height of chat message item
    offset: 60 * index,
    index,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ChatItemHeader data={{ userName, userAvatar }} />
      <View style={{ flex: 1, paddingTop: 12, paddingBottom: 14 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.idMessage}
          renderItem={({ item }) =>
            item.sender === myUserId ? (
              <Sender message={[item.content, item.timestamp, userAvatar]} />
            ) : (
              <Receiver message={[item.content, item.timestamp, userAvatar]} />
            )
          }
          getItemLayout={getItemLayout}
        />
      </View>
      <TextInputBox idChatBox={idChatBox} />
    </KeyboardAvoidingView>
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
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    borderTopWidth: 0.2,
    borderTopColor: "#333",
  },
  btnMessageSend: {
    backgroundColor: "#A51A29",
    paddingHorizontal: 9,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  btnMessageUnSend: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#A51A29",
    paddingHorizontal: 9,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
