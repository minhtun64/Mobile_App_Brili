import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";

export default function V_ListAppointmentScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState({});

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
      status: 'Đã đặt',
      petName: 'Mỹ Diệu',
      description: 'Cái nết đào cát quá chừng chừng',
    },
    {
      id: 2,
      avatar: '',
      name: 'Phòng khám Pet Hospital Cơ sở 2',
      address: '53 Thạch Thị Thanh, Quận 1, Thành phố Hồ Chí Minh',
      createDate: '14/03/2023',
      date: '16/03/2023',
      startTime: '16:30',
      endTime: '18:00',
      status: 'Đã xong',
      petName: 'Bé Dâu',
      description: 'Ăn tròn lăn quay',
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
      petName: 'Mâu Ghẻ',
      description: 'Cắn phá rụng răng',
    },
  ];

  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const { width, height } = layout;
  const calHeight = width / 2.32;

  return (
    <View style={styles.container}>
      {/* banner */}
      <Image
          style={{
            width: '90%',
            height: calHeight,
            resizeMode: 'contain',
            marginRight: 'auto',
            marginLeft: 'auto',
            marginTop: 48,
            marginBottom: 12,
            borderRadius: 12,
          }}
          source={require('../../assets/images/V_banner.png')}
          onLayout={onLayout} />

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
              <AppointmentCard
                key={item.id}
                {...item}
                backgroundColor={bgrColor}
                onPress={() => {
                  setModalVisible(true);
                  setDataModal(item);
                }}
              />
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



      {/* ========================================================================================================= */}
      {/* Modal contains information of appointment */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(false) }}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Image style={styles.closeModal} source={require('../../assets/icons/V_closeModal.png')} />
            </TouchableOpacity>
            <Text style={styles.headingModal}>Thông tin lịch hẹn</Text>

            <View style={[styles.clinic, styles.row]}>
              <View style={styles.clinicImgView}>
                <Image style={styles.clinicImgModal} source={require('../../assets/images/V_clinicAvatar2.png')}></Image>
              </View>
              <View style={styles.clinicInfo}>
                <Text style={styles.name}>{dataModal.name}</Text>
                {/* <Text style={styles.branch}>Cơ sở 1</Text> */}
                <View style={[styles.address, styles.row]}>
                  <Image style={styles.iconAddress} source={require('../../assets/icons/V_clinic-location.png')}></Image>
                  <Text style={styles.textAddress}>{dataModal.address}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.subHeading}>Thông tin chi tiết</Text>
            {/* information appt */}
            <View style={[styles.card, styles.row]}>
              <View style={styles.info}>
                <Text style={styles.label}>Tên thú cưng</Text>
                <Text style={styles.content}>{dataModal.petName}</Text>
              </View>
              <Image style={styles.petImg} source={require('../../assets/images/V_MyDieu-avatar.png')}></Image>
            </View>
            <View style={[styles.card, styles.row]}>
              <View style={styles.info}>
                <Text style={styles.label}>Ngày đặt</Text>
                <Text style={styles.content}>{dataModal.createDate}</Text>
              </View>
            </View>
            <View style={[styles.card, styles.row]}>
              <View style={styles.info}>
                <Text style={styles.label}>Ngày hẹn</Text>
                <Text style={styles.content}>{dataModal.date}</Text>
              </View>
            </View>
            <View style={[styles.card, styles.row]}>
              <View style={styles.info}>
                <Text style={styles.label}>Thời gian bắt đầu</Text>
                <Text style={styles.content}>{dataModal.startTime}</Text>
              </View>
            </View>
            <View style={[styles.card, styles.row]}>
              <View style={styles.info}>
                <Text style={styles.label}>Thời gian kết thúc</Text>
                <Text style={styles.content}>{dataModal.endTime}</Text>
              </View>
            </View>
            <View style={[styles.desCard, styles.row]}>
              <View style={styles.info}>
                <Text style={styles.label}>Mô tả</Text>
                <Text style={styles.content}>{dataModal.description}</Text>
              </View>
            </View>

            {dataModal.status === 'Đã đặt' && <CancelBtn onPress={() => {
              Alert.alert('Hủy lịch hẹn', 'Bạn chắc chắn muốn hủy lịch hẹn này?', [
                {
                  text: 'Đóng',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => /* cap nhat lai status thanh da huy */ console.log('OK Pressed')},
              ]);          
            }}
            />}

          </View>
        </View>
      </Modal>
    </View>
  );
}

// Appointment Card Element
const AppointmentCard = (prop) => {
  return (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={prop.onPress}
    >
      <View style={[styles.appointmentHeader, styles.row]}>
        <Text style={styles.appointmentNum}>{prop.id}</Text>
        <Text style={[styles.status, { backgroundColor: prop.backgroundColor }]}>{prop.status}</Text>
      </View>

      <View style={[styles.appointmentInfo, styles.row]}>
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
      </View>
    </TouchableOpacity>
  );
}

const CancelBtn = (prop) => {
  return (
    <TouchableOpacity
      style={styles.cancelBtn}
      onPress={prop.onPress}>
      <Text style={styles.textCancelBtn}>Hủy lịch hẹn</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    backgroundColor: '#FFF6F6',
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
    maxWidth: '76%',
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
    width: '12%',
    height: '12%',
    position: 'absolute',
    right: 12,
    bottom: Dimensions.get("window").height * 0.1 + 8,
  },
  imgBtn: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // ==================================================== Info Modal
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '91%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FFF6F6',
  },
  closeModal: {
    position: 'absolute',
    top: 8,
    right: -8,
    padding: 8,
    resizeMode: 'cover',
  },
  headingModal: {
    color: '#A51A29',
    fontSize: 18,
    fontFamily: 'lexend-semibold',
    alignSelf: 'center',
    marginVertical: '4%',
  },
  clinic: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9bebf',
    borderRadius: 8,
  },
  clinicImgView: {
    elevation: 6,

    // add shadows for iOS only
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,

    // fitting view with image
    width: 66,
    maxHeight: 66,
    borderRadius: 32,
    marginRight: 16,
  },
  clinicImgModal: {
    width: 66,
    maxHeight: 66,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  clinicInfo: {
    width: '76%',
    minHeight: 72,
    paddingVertical: 2,
    paddingLeft: 6,
    marginLeft: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  name: {
    width: '92%',
    color: '#39A3C0',
    fontSize: 16,
    fontFamily: 'lexend-regular',
  },
  branch: {
    color: '#39A3C0',
    fontSize: 15,
    fontFamily: 'lexend-light',
  },
  address: {
    width: '92%',
    marginTop: 2,
  },
  iconAddress: {
    width: 18,
    height: 18,
    marginRight: 2,
  },
  textAddress: {
    fontSize: 13,
    lineHeight: 18,
  },
  subHeading: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'lexend-medium',
    marginTop: 16,
  },
  card: {
    width: '100%',
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#f9bebf',
  },
  desCard: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#f9bebf',
  },
  info: {
    justifyContent: 'space-between',
  },
  label: {
    color: '#A51A29',
    fontSize: 14,
    fontFamily: 'lexend-medium',
  },
  content: {
    fontSize: 14,
    fontFamily: 'lexend-light',
  },
  petImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f9bebf',
    alignSelf: 'center',
  },
  cancelBtn: {
    width: '72%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#A51A29',
    marginTop: '4%',
  },
  textCancelBtn: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'lexend-medium',
  }
});
