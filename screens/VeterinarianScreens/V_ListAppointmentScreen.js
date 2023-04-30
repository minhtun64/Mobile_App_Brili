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

export default function V_ListAppointmentScreen({ navigation }) {
  const appointmentArr = [
    {
      id: 1,
      avatar: '',
      name: 'Phòng khám Mon',
      address: '178 Trần Hưng Đạo, Quận 1, Thành phố Hồ Chí Minh',
      createDate: '20/04/2023',
      date: '28/04/2023',
      startTime: '09:30',
      endTime: '11:00',
      status: 'Đã đặt'
    },
    {
      id: 2,
      avatar: '',
      name: 'Phòng khám Pet Hospital',
      address: '53 Thạch Thị Thanh, Quận 1, Thành phố Hồ Chí Minh',
      createDate: '14/03/2023',
      date: '16/03/2023',
      startTime: '16:30',
      endTime: '18:00',
      status: 'Đã xong',
    },
    {
      id: 3,
      avatar: '',
      name: 'Phòng Khám Thú Y Belwee',
      address: '160 Xô Viết Nghệ Tĩnh, Phường 24, Bình Thạnh, Thành phố Hồ Chí Minh',
      createDate: '05/12/2022',
      date: '11/12/2022',
      startTime: '15:00',
      endTime: '16:30',
      status: 'Đã hủy',
    },
  ];

  return (
    <View style={styles.container}>
      {/* banner */}
      <View style={styles.bannerContainer}>
        <Image style={styles.banner} source={require('../../assets/images/V_banner.png')}></Image>
      </View>
      <View style={styles.seperation}></View>

      {/* appointment list */}
      <View style={styles.body}>
        {/* header */}
        <View style={styles.heading}>
          <Text style={styles.title}>Danh sách lịch hẹn</Text>
        </View>

        {/* danh sách các lịch hẹn */}
        <ScrollView style={styles.listAppointment}>
          {appointmentArr.map(item => {
            let bgrColor = '';
            if (item.status === 'Đã đặt')
              bgrColor = '#F5817E';
            else if (item.status === 'Đã xong')
              bgrColor = '#AFEF8E';
            else
              bgrColor = '#DCDCDC';

            return (
              <AppointmentCard key={item.id} {...item} backgroundColor={bgrColor} />
            );
          })}
        </ScrollView>

        {/* nút thêm lịch hẹn mới */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("V_Location")}>
          <Image style={styles.imgBtn} source={require('../../assets/icons/V_footprint.png')}></Image>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const AppointmentCard = (prop) => {
  return (
    <View style={styles.appointmentCard}>
      <View style={[styles.appointmentHeader, styles.row]}>
        <Text style={styles.appointmentNum}>{prop.id}</Text>
        <Text style={[styles.status, {backgroundColor: prop.backgroundColor}]}>{prop.status}</Text>
      </View>

      <TouchableOpacity style={[styles.appointmentInfo, styles.row]}>
        <View>
          <Image style={styles.clinicImg} source={require('../../assets/images/V_clinicAvatar2.png')}></Image>
        </View>
        <View style={{ width: '100%' }}>
          <Text style={styles.nameClinic}>{prop.name}</Text>
          <Text style={styles.addressClinic}>{prop.address}</Text>
          <Text style={styles.createDate}>Ngày đặt: {prop.createDate}</Text>
          <View style={[styles.dateTime, styles.row]}>
            <Text style={styles.formatText}>Ngày hẹn: {prop.date}</Text>
            <Text style={styles.formatText}>{prop.startTime} - {prop.endTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    backgroundColor: '#FFF6F6',
  },
  bannerContainer: {
    width: '100%',
    marginTop: 64,
  },
  banner: {
    width: '90%',
    resizeMode: 'cover',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 12,
    borderRadius: 12,
  },
  seperation: {
    width: '100%',
    height: 12,
    backgroundColor: '#FFFFFF',
  },

  // -------------------------------------------------  body
  body: {
    width: '100%',
    flex: 1,
    alignContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  heading: {
    backgroundColor: '#E02D33',
    paddingHorizontal: 40,
    paddingVertical: 6,
    alignSelf: 'center',
    borderRadius: 32,
    margin: 12,
  },
  title: {
    fontFamily: 'lexend-bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  listAppointment: {
    width: '100%',
    marginBottom: Dimensions.get("window").height * 0.1,
  },
  appointmentCard: {
    width: '88%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F5817E',
    borderWidth: 1,
    borderRadius: 16,
    paddingBottom: 4,
    marginBottom: 12,
  },
  appointmentHeader: {
    justifyContent: 'space-between',
  },
  appointmentNum: {
    width: '24%',
    fontSize: 16,
    fontFamily: 'lexend-bold',
    textAlign: 'center',
    color: '#A51A29',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#FEDBD0',
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  status: {
    width: '20%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'lexend-medium',
    borderRadius: 8,
    marginTop: 4,
    marginRight: 8,
  },
  appointmentInfo: {
    padding: 12,
  },
  clinicImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#DCDCDC',
    marginRight: 8,
  },
  nameClinic: {
    width: '88%',
    color: '#442C2E',
    fontSize: 18,
    marginBottom: '2%',
    fontFamily: 'lexend-semibold',
  },
  addressClinic: {
    maxWidth: '78%',
    fontSize: 14,
    fontFamily: 'lexend-light',
  },
  createDate: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'lexend-light',
  },
  dateTime: {
    width: '76%',
    justifyContent: 'space-between',
  },
  formatText: {
    fontSize: 14,
    fontFamily: 'lexend-light',
  },
  addBtn: {
    alignSelf: 'flex-end',
    width: '12%',
    position: 'absolute',
    right: 16,
    bottom: Dimensions.get("window").height * 0.1 + 16,
  },
  imgBtn: {
    resizeMode: 'contain',
  },
});
