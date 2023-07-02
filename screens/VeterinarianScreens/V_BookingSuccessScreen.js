import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function V_BookingSuccessScreen({ navigation }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      navigation.navigate('V_ListAppointment'); // Chuyển sang màn hình khác
    } else {
      setTimeout(() => setCountdown(countdown - 1), 1000); // Giảm giá trị countdown sau mỗi giây
    }
  }, [countdown, navigation]);

  return (
    <View style={styles.wrapping}>
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require("../../assets/icons/V_backIconMain.png")}
          ></Image>
        </TouchableOpacity>
        <View style={[styles.headerTitle, styles.row]}>
          <Text style={styles.headerText}>Đặt lịch hẹn</Text>
          {/* <Image style={styles.headerImg} source={require('../../assets/icons/V_bookingVetHeader.png')}></Image> */}
        </View>
      </View>

      <View style={styles.body}>
        <Image style={styles.memeCat} source={require('../../assets/images/V_bookingSuccess.png')} />
        <Text style={styles.text}>Đặt lịch thành công!</Text>
        <Text style={styles.moveToList}>Chuyển đến danh sách lịch hẹn trong {countdown}s ...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapping: {
    backgroundColor: '#FFF6F6',
    height: Dimensions.get("window").height,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    width: '100%',
    marginTop: '10%',
  },
  backBtn: {
    resizeMode: 'contain',
    padding: 16,
    marginHorizontal: '3%',
  },
  title: {
    backgroundColor: '#FFF6F6',
  },
  titleImg: {
    width: 28,
    height: 28,
    marginLeft: 24,
    marginRight: 4,
  },
  titleText: {
    width: '72%',
    fontSize: 15,
    fontFamily: 'lexend-semibold',
    color: '#FFFFFF',
    backgroundColor: '#F5817E',
    borderRadius: 12,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  headerTitle: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    marginRight: '12%',
    marginTop: 8,
  },
  headerText: {
    color: '#A51A29',
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: 'lexend-bold',
    paddingBottom: 8,
  },
  headerImg: {
    width: '6%',
    marginLeft: 6,
    resizeMode: 'contain',
    justifyContent: 'flex-start',
  },
  container: {
    width: '94%',
    height: '100%',
    alignSelf: 'center',
    marginTop: '10%',
  },
  headingModal: {
    fontSize: 18,
    fontFamily: 'lexend-medium',
    marginBottom: '4%',
    paddingLeft: '4%',
  },
  titleSelect: {
    fontSize: 14,
    fontFamily: 'lexend-medium',
    marginBottom: '1%',
    marginTop: '3%',
  },

  // body
  body: {
    width: '100%',
    paddingTop: '6%',
    alignItems: 'center',
  },
  memeCat: {
    marginTop: '4%',
    resizeMode: "contain",
  },
  text: {
    fontSize: 22,
    fontFamily: 'lexend-regular',
    marginTop: '3%',
  },
  moveToList: {
    fontSize: 16,
    fontFamily: 'lexend-regular',
    color: '#A51A29',
    marginTop: '20%',
  },
});
