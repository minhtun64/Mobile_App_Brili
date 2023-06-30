import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PopupModal = ({ visible, type, title,   message, onClose, onPrimaryButtonPress, primaryButtonText  }) => {
  // Định nghĩa các kiểu thông báo và màu sắc tương ứng
  const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
     },
     modalContainer: {
       backgroundColor: '#fff',
       borderRadius: 8,
       width:"90%",
       height:"25%",
       padding: 16,
       alignItems: 'center',
       justifyContent:'space-around'
     },
     successText: {
       fontFamily: "lexend-medium",
       fontSize: 18,
       fontWeight: "bold",
       color: "#A51A29",
       fontWeight: 'bold',
       marginBottom: 8,
     },
     warningText: {
       color: 'orange',
       fontSize: 18,
       fontWeight: 'bold',
       marginBottom: 8,
     },
     errorText: {
       color: 'red',
       fontSize: 18,
       fontWeight: 'bold',
       marginBottom: 8,
     },
     closeButton: {
       marginTop: 16,
       paddingTop: 10,
       paddingBottom:10,
      //  paddingRight: 20,
      //  paddingLeft: 20,
       borderRadius: 4,
       backgroundColor: '#eee',
       width: 100,
     },
     closeButtonText: {
          fontFamily: "lexend-medium",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
     },
     primaryButtonText:{
      fontFamily: "lexend-medium",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
     },
     primaryButton:{
      //  marginTop: 16,
      //  paddingTop: 10,
      //  paddingBottom:10,
      //  paddingRight: 20,
      //  paddingLeft: 20,
      //  borderRadius: 4,
      //  backgroundColor: '#eee',
      //  width: 120,
      //  textAlign: 'center',
      //  justifyContent: 'center',
     },
     textMess:{
       fontFamily: "lexend-medium",
       fontSize: 14,
       fontWeight: "bold",  
     },
     containerBtn:{
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
     },
     containerText:{
      justifyContent: "center",
     }
   });

  // Chọn màu sắc và văn bản dựa trên kiểu thông báo
  let textColor = '';
  let textStyle = '';
  switch (type) {
    case 'success':
      textColor = styles.successText;
      textStyle = styles.successTextStyle;
      break;
    case 'warning':
      textColor = styles.warningText;
      textStyle = styles.warningTextStyle;
      break;
    case 'error':
      textColor = styles.errorText;
      textStyle = styles.errorTextStyle;
      break;
    default:
      textColor = styles.errorText;
      textStyle = styles.errorTextStyle;
      break;
  }

  return (
    // <Modal
    //   visible={visible}
    //   transparent={true}
    //   animationType="fade"
    //   onRequestClose={onClose}
    // >
    //   <View style={styles.container}>
    //     <View style={styles.modalContainer}>
    //       <Text style={[textColor, textStyle]}>{title}</Text>
    //       <Text style={styles.textMess}>{message}</Text>
    //       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
    //         <Text style={styles.closeButtonText}>Đóng</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </Modal>
    <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={[textColor, textStyle]}>{title}</Text>
        <Text style={styles.textMess}>{message}</Text>
        <View style={styles.containerBtn}>
        {onPrimaryButtonPress && (
          <TouchableOpacity style={styles.closeButton} onPress={onPrimaryButtonPress}>
            <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.containerText}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  );
};

export default PopupModal;