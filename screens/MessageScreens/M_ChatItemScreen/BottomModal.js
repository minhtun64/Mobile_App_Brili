import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const BottomModal = ({ visible, setVisible, setDeleteModalVisible }) => {
  const handleDeleteMessage = () => {
    setVisible(false);
    setDeleteModalVisible(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setVisible(false)}
      >
        <View style={styles.modalOptionBackground}>
          <View style={styles.line2}></View>
          <TouchableOpacity
            style={styles.modalOption}
            // onPress={handleEditPost}
          >
            <View style={styles.row8}>
              <Image
                style={styles.modalOptionIcon}
                source={require("../../../assets/icons/copy-clipboard.png")}
              />
              <Text style={styles.modalOptionText}>Sao chép</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={handleDeleteMessage}
          >
            <View style={styles.row8}>
              <Image
                style={styles.modalOptionIcon2}
                source={require("../../../assets/icons/delete-message.png")}
              />
              <Text style={styles.modalOptionText}>Xóa tin nhắn</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOptionBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#FCAC9E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 6,
  },
  line: {
    width: 360,
    height: 1,
    backgroundColor: "#FCAC9E",
    marginLeft: "auto",
    marginRight: "auto",
  },
  line2: {
    width: 54,
    height: 5,
    backgroundColor: "#F5817E",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 0.5,
    marginTop: 8,
  },
  modalOptionIcon: {
    width: 26,
    height: 26,
    marginLeft: 40,
    marginRight: 20,
  },
  modalOptionIcon2: {
    width: 20,
    height: 20,
    marginLeft: 42,
    marginRight: 26,
  },
  modalOptionText: {
    color: "#A51A29",
    fontFamily: "lexend-regular",
    fontSize: 16,
  },
  row8: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: "center",
  },
});

export default BottomModal;
