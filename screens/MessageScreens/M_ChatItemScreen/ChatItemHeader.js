import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

function ChatItemHeader({ data }) {
  const navigation = useNavigation();
  const { userName, userAvatar } = data;

  return (
    <View style={[styles.header, styles.row]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.backIcon}
            source={require("../../../assets/icons/V_backIconMain.png")}
          ></Image>
        </TouchableOpacity>
        <Image style={styles.userImg} source={{ uri: userAvatar }}></Image>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.callBtn} onPress={() => {}}>
          <Image
            style={styles.callIcon}
            source={require("../../../assets/icons/call.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.videoBtn, styles.callBtn]}
          onPress={() => {}}
        >
          <Image
            style={styles.callIcon}
            source={require("../../../assets/icons/video.png")}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    paddingTop: "8%",
    paddingBottom: "2%",
    alignItems: "center",
    borderWidth: 0.8,
    borderColor: "#F9BEBF",
  },
  backBtn: {
    resizeMode: "contain",
    padding: 16,
    marginHorizontal: "2%",
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: "4%",
    marginTop: "0.8%",
  },
  userName: {
    fontSize: 17,
    fontFamily: "lexend-regular",
    color: "#A51A29",
    textAlign: "center",
    alignSelf: "center",
  },
  callBtn: {
    resizeMode: "contain",
    paddingHorizontal: 12,
  },
  callIcon: {
    width: 24,
    resizeMode: "contain",
  },
  videoBtn: {
    marginRight: 10,
  },
});

export default ChatItemHeader;
