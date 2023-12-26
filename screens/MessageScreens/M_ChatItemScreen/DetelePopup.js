import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { database } from "../../../firebase";
import { ref, remove } from "firebase/database";

const DeletePopup = ({
  visible,
  setVisible,
  setShowSnackbar,
  chatboxId,
  messageId,
}) => {
  const handleCancelDelete = () => {
    setVisible(false);
  };

  const handleConfirmDelete = async () => {
    // Xóa tin nhắn khỏi Firebase
    const messageRef = ref(
      database,
      `chatList/${chatboxId}/messages/${messageId}`
    );

    try {
      await remove(messageRef);
      console.log("Delete message successfully!")

      setVisible(false);
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
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
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Xóa tin nhắn</Text>
          <Text style={styles.modalText}>
            Tin nhắn của bạn sẽ được thu hồi với mọi người. Xác nhận xóa?
          </Text>

          <View style={styles.row9}>
            <TouchableOpacity
              onPress={handleCancelDelete}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText1}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText2}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // delete popup
  modalContent: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    borderRadius: 8,
    marginLeft: "8%",
    marginRight: "8%",
  },
  modalTitle: {
    fontSize: 19,
    fontFamily: "lexend-medium",
    textAlign: "center",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "lexend-regular",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 16,
    width: 130,
    height: 40,
    borderRadius: 4,
    borderColor: "#A51A29",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#A51A29",
    width: 132,
    height: 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText1: {
    color: "#A51A29",
    fontSize: 16,
    fontFamily: "lexend-medium",
  },
  buttonText2: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "lexend-medium",
  },
  row9: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
    alignItems: "center",
  },
});

export default DeletePopup;
