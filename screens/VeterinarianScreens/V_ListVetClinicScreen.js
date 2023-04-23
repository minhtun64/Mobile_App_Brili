import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require("../../assets/icons/V_backIconMain.png")}
          ></Image>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Đặt lịch hẹn</Text>
          <Image style={styles.headerImg} source={require('../../assets/icons/V_bookingVetHeader.png')}></Image>
        </View>
      </View>
      <View style={styles.title}>
        <Image style={styles.titleImg} source={require('../../assets/icons/V_VetClinicLocation.png')}></Image>
        <Text style={styles.titleText}>Các phòng khám ở gần bạn</Text>
      </View>
      <ScrollView style={styles.listClinicCard}>
        {clinicArr.map(item => <ClinicCard key={item.id} {...item} />)}
      </ScrollView>
    </View>
  );
}

const ClinicCard = (prop) => {
  return (
    <View style={styles.clinicCard}>
      <View>
        <Image style={styles.clinicImg} source={require('../../assets/images/V_clinicAvatar.png')}></Image>
      </View>
      {/* 
        Clinic Info
        */}
      <View style={styles.clinicInfo}>
        <Text style={styles.name}>{prop.name}</Text>
        <View style={styles.address}>
          <Image style={styles.addressIcon} source={require('../../assets/icons/V_clinic-location.png')}></Image>
          <Text style={styles.addressText}>{prop.address}</Text>
        </View>
        <View style={styles.numOfFollowers}>
          <Image style={styles.followerIcon} source={require('../../assets/icons/V_followers.png')}></Image>
          <Text style={styles.followerNumber}>{prop.followers}</Text>
          <Text> Người theo dõi</Text>
        </View>
        <View style={styles.row}>
          {/* chat with clinic button */}
          <TouchableOpacity style={[styles.chatBtn, styles.row]}>
            <Image style={styles.iconBtn} source={require('../../assets/icons/V_message-icon.png')}></Image>
            <Text style={styles.textChatBtn}>Hỏi đáp</Text>
          </TouchableOpacity>
          {/* booking vet button */}
          <TouchableOpacity 
            style={[styles.bookingBtn, styles.row]}
            onPress={() => navigation.navigate("V_BookingVet")}>
            <Image style={styles.iconBtn} source={require('../../assets/icons/V_booking-icon.png')}></Image>
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
    backgroundColor: '#FFF6F6',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  backBtn: {
    left: 8,
    position: 'absolute',
    resizeMode: 'contain',
    marginTop: 32,
    marginLeft: 12,
  },
  title: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'lexend-semibold',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F5817E',
  },
  headerTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  headerText: {
    color: '#A51A29',
    fontSize: 18,
    verticalAlign: 'middle',
    fontFamily: 'lexend-bold',
  },
  headerImg: {
    width: '8%',
    marginLeft: 6,
    resizeMode: 'contain',
  },
  clinicCard: {
    width: '88%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#F5817E',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  clinicImg: {
    width: 100,
    height: 100,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: '#DCDCDC',
    marginRight: 8,
  },
  name: {
    color: '#39A3C0',
    fontSize: 18,
    fontFamily: 'lexend-regular',
  },
  address: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressIcon: {
    width: 16,
    height: 18,
    marginTop: 4,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'lexend-light',
    color: '#615D5D',
    marginLeft: 6,
  },
  numOfFollowers: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  followerIcon: {
    width: 16,
    height: 18,
    marginTop: 4,
  },
  followerText: {
    fontSize: 14,
    fontFamily: 'lexend-light',
    color: '#615D5D',
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
  },
  chatBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A51A29',
    borderWidth: 1,
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  bookingBtn: {
    backgroundColor: '#A51A29',
    padding: 8,
    borderRadius: 16,
  },
  iconBtn: {
    width: 16,
    height: 16,
  },
  textChatBtn: {
    fontSize: 12,
  },
  textBookingBtn: {
    fontSize: 12,
    fontFamily: 'lexend-semibold',
    color: '#FFFFFF',
  }
});
