import { View, Text, StyleSheet, Image } from "react-native";

const Receiver = (props) => {
  let content = props.message[0];
  let timestamp = props.message[1];
  let userAvatar = props.message[2];

  let time = new Date(timestamp);
  timestamp = `${time.getHours()}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <Image style={styles.userAvatar} source={{ uri: userAvatar }} />
      <View style={styles.textView}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
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

export default Receiver;
