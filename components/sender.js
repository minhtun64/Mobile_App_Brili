import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

const Sender = (props) => {
  let [content, timestamp, userAvatar] = props.message;
  let formattedTime = moment(timestamp, "DD-MM-YYYY hh:mm:ss").format("hh:mm");

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    width: "100%",
    marginTop: 4,
  },
  textView: {
    backgroundColor: "rgba(253, 218, 212, 0.5)",
    justifyContent: "center",
    paddingTop: "1.5%",
    paddingBottom: "0.8%",
    paddingHorizontal: "3%",
    marginRight: "4%",
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    width: "100%",
    fontSize: 15,
    textAlign: "right",
    marginBottom: "6%",
  },
  timestamp: {
    width: "100%",
    textAlign: "right",
    fontSize: 10.5,
    color: "#969191",
  },
});

export default React.memo(Sender);
