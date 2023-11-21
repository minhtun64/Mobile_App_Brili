import { View, Text, StyleSheet } from "react-native";

const Sender = (props) => {
  const content = props.message[0];
  let timestamp = props.message[1];

  const time = new Date(timestamp);
  timestamp = `${time.getHours()}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
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

export default Sender;
