import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { UserContext } from "../../../UserIdContext";

function CardItem({ navigation, data }) {
  let messages = data;
  let myUserId = useContext(UserContext).userId;

  return (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() =>
        navigation.navigate("M_ChatItem", {
          id: messages.id,
          userId: messages.userId,
          userName: messages.name,
          userAvatar: messages.avatar,
        })
      }
    >
      <View style={[styles.wrapping, styles.row]}>
        <View style={styles.userImgWrapper}>
          <Image
            style={styles.userImg}
            source={{
              uri: messages.avatar,
            }}
          />
        </View>
        <View style={styles.textSection}>
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{messages.name}</Text>
            <Text style={styles.timestamp}>
              {messages.timestamp}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.messageText}
          >
            {messages.sender === myUserId
              ? `Bạn: ${messages.content}`
              : messages.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  wrapping: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  userImgWrapper: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textSection: {
    width: "82%",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: "#F9BEBF",
    paddingTop: "5%",
    paddingBottom: "5%",
  },
  userInfoText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "2.5%",
  },
  userName: {
    fontSize: 15,
    fontFamily: "lexend-light",
  },
  timestamp: {
    fontSize: 12,
    fontFamily: "lexend-light",
    marginTop: 2,
  },
  messageText: {
    fontSize: 14,
    fontFamily: "lexend-light",
  },
});

export default CardItem;
