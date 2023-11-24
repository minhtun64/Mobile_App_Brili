import React, { useState, useContext } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import moment from "moment";
import { database } from "../../../firebase";
import { ref, push } from "firebase/database";
import { UserContext } from "../../../UserIdContext";

function TextInputBox({ idChatBox }) {
  const myUserId = useContext(UserContext).userId;
  const [message, setMessage] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);

  const sendMessage = () => {
    const newRecord = {
      content: message,
      sender: myUserId,
      status: "sent",
      timestamp: moment().format("DD-MM-YYYY HH:mm:ss"),
    };
    let messagesRef = ref(database, `chatList/${idChatBox}/messages/`);
    push(messagesRef, newRecord)
      .then(() => {
        console.log("New record added successfully!");
      })
      .catch((error) => {
        console.log("Error adding new record:", error);
      });

    setMessage("");
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(message) => setMessage(message)}
        value={message}
        placeholder="Nhắn tin"
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      ></TextInput>
      <TouchableOpacity
        style={isInputFocused ? styles.btnMessageSend : styles.btnMessageUnSend}
        onPress={sendMessage}
      >
        <Fontisto
          name="paper-plane"
          size={18}
          color={isInputFocused ? "white" : "#A51A29"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    borderTopWidth: 0.2,
    borderTopColor: "#333",
  },
  input: {
    width: "87%",
    height: 36,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
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

export default TextInputBox;
