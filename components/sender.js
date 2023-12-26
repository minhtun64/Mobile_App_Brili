import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";
import BottomModal from "../screens/MessageScreens/M_ChatItemScreen/BottomModal";
import DeletePopup from "../screens/MessageScreens/M_ChatItemScreen/DetelePopup";
import SucessPopup from "../screens/MessageScreens/M_ChatItemScreen/SucessPopup";

const Sender = (props) => {
  let [content, timestamp, userAvatar] = props.message;
  let formattedTime = moment(timestamp, "DD-MM-YYYY HH:mm:ss").format("HH:mm");

  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={() => setBottomModalVisible(true)}
    >
      <View style={styles.textView}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>

      {bottomModalVisible && (
        <BottomModal
          visible={bottomModalVisible}
          setVisible={setBottomModalVisible}
          setDeleteModalVisible={setDeleteModalVisible}
        />
      )}

      {deleteModalVisible && (
        <DeletePopup
          visible={deleteModalVisible}
          setVisible={setDeleteModalVisible}
          setShowSnackbar={setShowSnackbar}
          chatboxId={props.chatboxId}
          messageId={props.messageId}
        />
      )}

      {showSnackbar && (
        <SucessPopup 
          visible={showSnackbar}
          setVisible={setShowSnackbar}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    marginTop: 6,
  },
  textView: {
    backgroundColor: "rgba(253, 218, 212, 0.5)",
    justifyContent: "center",
    paddingTop: "1.8%",
    paddingBottom: "1.2%",
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
  },
  timestamp: {
    width: "100%",
    textAlign: "right",
    fontSize: 10.5,
    color: "#969191",
    marginTop: 6,
  },
});

export default React.memo(Sender);
