import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import moment from "moment";

const Receiver = (props) => {
  let [content, timestamp, userAvatar] = props.message;
  let formattedTime = moment(timestamp, "DD-MM-YYYY hh:mm:ss").format("hh:mm");

  return (
    <View style={styles.container}>
      <Image style={styles.userAvatar} source={{ uri: userAvatar }} />
      <View style={styles.textView}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 4,
  },
  textView: {
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    paddingTop: "1.5%",
    paddingBottom: "0.8%",
    paddingHorizontal: "3%",
    marginLeft: "2%",
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 16,
    alignSelf: "flex-end",
    marginLeft: "4%",
  },
  content: {
    width: "100%",
    fontSize: 15,
    textAlign: "left",
    marginBottom: "6%",
  },
  timestamp: {
    width: "100%",
    textAlign: "left",
    fontSize: 10,
    color: "#969191",
  },
});

export default React.memo(Receiver);
