import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { Component } from "react";

export default function V_ListVetClinicScreen({ navigation }) {
  const clinicArr = [
    {
      id: 1,
      avatar: '',
      name: 'Phòng khám Mon',
      address: '178 Trần Hưng Đạo, Quận 1, Thành phố Hồ Chí Minh',
      followers: '1.141.655'
    },
    {
      id: 2,
      avatar: '',
      name: 'Phòng khám Pet Hospital',
      address: '53 Thạch Thị Thanh, Quận 1, Thành phố Hồ Chí Minh',
      followers: '1.030.111'
    },
    {
      id: 3,
      avatar: '',
      name: 'Phòng Khám Thú Y Belwee',
      address: '160 Xô Viết Nghệ Tĩnh, Phường 24, Bình Thạnh, Thành phố Hồ Chí Minh',
      followers: '1.141.655'
    },
    {
      id: 4,
      avatar: '',
      name: 'Phòng khám New Pet',
      address: '651/4 Điện Biên Phủ, Phường 1, Quận 3, Thành phố Hồ Chí Minh',
      followers: '1.030.111'
    },
  ];

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
          <Image style={styles.headerImg} source={require('../../assets/icons/V_bookingVetHeader.png')}></Image>
        </View>
      </View>
      <View style={[styles.title, styles.row]}>
        <Image style={styles.titleImg} source={require('../../assets/icons/V_VetClinicLocation.png')}></Image>
        <Text style={styles.titleText}>Các phòng khám ở gần bạn</Text>
      </View>
      <ScrollView style={styles.listClinicCard}>
        {clinicArr.map(item => <ClinicCard key={item.id} {...item} navigation={navigation} />)}
      </ScrollView>
    </View>
  );
}

const ClinicCard = (prop) => {
  return (
    <View style={[styles.clinicCard, styles.row]}>
      <View style={{
        // add shadows for Android only
        elevation: 6,

        // add shadows for iOS only
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,

        // fitting view with image
        width: 68,
        height: 68,
        borderRadius: 40,
        marginRight: 8,
      }}>
        <Image style={styles.clinicImg} source={require('../../assets/images/V_clinicAvatar.png')}></Image>
      </View>
      {/* 
        Clinic Info
        */}
      <View style={styles.clinicInfo}>
        <Text style={styles.name}>{prop.name}</Text>
        <View style={[styles.address, styles.row]}>
          <Image style={styles.addressIcon} source={require('../../assets/icons/V_clinic-location.png')}></Image>
          <Text style={styles.addressText}>{prop.address}</Text>
        </View>
        <View style={[styles.numOfFollowers, styles.row]}>
          <Image style={styles.followerIcon} source={require('../../assets/icons/V_followers.png')}></Image>
          <Text style={styles.followerNumber}>{prop.followers}</Text>
          <Text style={styles.followerText}> Người theo dõi</Text>
        </View>
        <View style={styles.row}>
          {/* chat with clinic button */}
          <TouchableOpacity style={[styles.chatBtn, styles.row]}>
            <Image style={styles.iconBtn} source={require('../../assets/icons/V_message-icon.png')}></Image>
          </TouchableOpacity>
          {/* booking vet button */}
          <TouchableOpacity
            style={[styles.bookingBtn, styles.row]}
            onPress={() => prop.navigation.navigate("V_BookingVet")}>
            <Text style={styles.textBookingBtn}>Đặt lịch khám</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapping: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    width: '100%',
    marginTop: '2%',
  },
  backBtn: {
    position: 'absolute',
    left: 8,
    resizeMode: 'contain',
    marginTop: 32,
    marginLeft: 12,
  },
  title: {
    backgroundColor: '#FFF6F6',
    paddingVertical: 12,
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
    width: '100%',
    justifyContent: 'center',
    marginTop: 8,
  },
  headerText: {
    color: '#A51A29',
    fontSize: 16,
    verticalAlign: 'middle',
    fontFamily: 'lexend-bold',
  },
  headerImg: {
    width: '6%',
    marginLeft: 6,
    resizeMode: 'contain',
  },
  listClinicCard: {
    marginTop: 8,
    marginBottom: Dimensions.get("window").height * 0.1,
  },
  clinicCard: {
    width: '84%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F5817E',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 8,

    // add shadows for Android only
    elevation: 8,
    // add shadows for iOS only
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  clinicImg: {
    width: 68,
    height: 68,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    color: '#39A3C0',
    fontSize: 16,
    fontFamily: 'lexend-regular',
    marginBottom: 4,
  },
  address: {
    width: '80%',
  },
  addressIcon: {
    width: 18,
    height: 18,
    marginTop: 4,
    resizeMode: 'contain',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'lexend-regular',
    color: '#3b3b3b',
    marginLeft: 6,
  },
  numOfFollowers: {
    width: '80%',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  followerIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    marginBottom: 3,
  },
  followerNumber: {
    fontSize: 14,
    fontFamily: 'lexend-regular',
    color: '#3b3b3b',
    marginLeft: 6,
    marginBottom: 0,
  },
  followerText: {
    color: '#3b3b3b',
    marginBottom: 0,
  },
  chatBtn: {
    borderColor: '#A51A29',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  bookingBtn: {
    width: '68%',
    justifyContent: 'center',
    backgroundColor: '#A51A29',
    borderColor: '#E02D33',
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },
  iconBtn: {
    width: 24,
    height: 18,
  },
  textBookingBtn: {
    fontSize: 13,
    fontFamily: 'lexend-semibold',
    color: '#FFFFFF',
    marginLeft: 6,
  }
});
