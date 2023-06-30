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
import React, { useState, useEffect } from "react";
import CalendarStrip from 'react-native-calendar-strip';
import { database } from "../../firebase";
import { ref, get } from "firebase/database";

export default function V_BookingVetScreen({ navigation, route }) {
  const { clinicId, clinicName, clinicAddress, clinicAvatar } = route.params;
  const myUserID = 10;

  const [timeId, setTimeId] = useState();
  const [petId, setPetId] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeList, setTimeList] = useState([]);
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDateSelected = (date) => {
    const selectedDate = new Date(date);
    setSelectedDate(selectedDate);
  };

  useEffect(() => {
    // Truy van du lieu tu Firebase Realtime Database
    fetchDataFromFirebase();
  }, [selectedDate]);

  const fetchDataFromFirebase = async () => {
    const appoinmtRef = ref(database, `appointment/${clinicId}`);
    const appoinmtSnapshot = await get(appoinmtRef);
    const data = appoinmtSnapshot.val();

    var timeData = [];

    currentDate = `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`;
    const parsedDateCurrent = new Date(currentDate);

    data.forEach((item) => {
      const parsedDateItem = new Date(item.date);
      if (item !== undefined && parsedDateCurrent.getTime() === parsedDateItem.getTime()) {          
        timeData.push({
          id: item.id,
          startTime: item.start_time,
          endTime: item.end_time,
        })
      }
    })
    setTimeList(timeData);

    const petRef = ref(database, `pet/${myUserID}`);
    const petSnapshot = await get(petRef);
    const petData = petSnapshot.val();
    var petArr = [];

    Object.keys(petData).forEach((key) => {
      const item = petData[key];
      petArr.push({
        id: key,        // Lay key cua nut du lieu lam ID
        name: item.name,
        avatar: item.avatar,
      });
    });
    setPetList(petArr);

    setLoading(false);    
  }

  if (loading) {
    return <Text style={{marginTop: '12%', marginLeft: '4%'}}>Loading...</Text>;
  }

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


      {/* Hien thi thong tin phong kham, ngay gio, thu cung */}
      <View style={styles.body}>
        {/* Clinic info */}
        <View style={[styles.clinic, styles.row]}>
          <View style={styles.clinicImgView}>
            <Image style={styles.clinicImg} source={{ uri: clinicAvatar }}></Image>
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.name}>{clinicName}</Text>
            <View style={[styles.address, styles.row]}>
              <Image style={styles.iconAddress} source={require('../../assets/icons/V_clinic-location.png')}></Image>
              <Text style={styles.textAddress}>{clinicAddress}</Text>
            </View>
          </View>
        </View>
        {/* pickup date */}
        <CalendarStrip
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#7e9da2' }}
          style={{ width: '88%', height: 96, paddingTop: 12, marginTop: 16, paddingBottom: 10, borderRadius: 24 }}
          calendarHeaderStyle={{ fontSize: 15, color: '#7e9da2' }}
          calendarColor={'#f9bebf'}
          dateNumberStyle={{ color: '#FFFFFF' }}
          dateNameStyle={{ color: '#FFFFFF' }}
          highlightDateNumberStyle={{ color: '#7e9da2' }}
          highlightDateNameStyle={{ color: '#7e9da2' }}
          disabledDateNameStyle={{ color: 'grey' }}
          disabledDateNumberStyle={{ color: 'grey' }}
          iconContainer={{ flex: 0.1 }}
          selectedDate={selectedDate}
          onDateSelected={handleDateSelected}
        />
        {/* pickup time */}
        <Text style={[styles.subTitle, styles.marginLeft6]}>Thời gian</Text>
        <ScrollView horizontal={true} style={styles.listTimeOptions}>
          {timeList.map(item => {
            const bgrColor = item.id === timeId ? '#b0dbe2' : '#f9bebf';
            const color = item.id === timeId ? '#4d5f62' : '#ffffff';

            return (
              <TimeCard
                key={item.id}
                {...item}
                onPress={() => setTimeId(item.id)}
                backgroundColor={bgrColor}
                textColor={color}
              />);
          }
          )}
        </ScrollView>
        {/* pickup pet */}
        <Text style={[styles.subTitle, styles.marginLeft6]}>Thú cưng</Text>
        <ScrollView horizontal={true} style={styles.listPetOptions}>
          {petList.map(item => {
            const bgrColor = item.id === petId ? '#b0dbe2' : '#f9bebf';
            const color = item.id === petId ? '#4d5f62' : '#ffffff';

            return (
              <PetCard
                key={item.id}
                {...item}
                onPress={() => setPetId(item.id)}
                backgroundColor={bgrColor}
                textColor={color}
              />
            );
          })}
        </ScrollView>

        {/* schedule button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (petId != null && timeId != null)
              navigation.navigate('V_BookingSuccess')
          }}
        >
          <Text style={styles.textBtn}>Xác nhận đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const TimeCard = (prop) => {
  return (
    <TouchableOpacity
      style={[styles.timeCard, { backgroundColor: prop.backgroundColor }]}
      onPress={prop.onPress}
    >
      <Text style={[styles.hours, { color: prop.textColor }]}>{prop.startTime + ' - ' + prop.endTime}</Text>
    </TouchableOpacity>
  )
}

const PetCard = (prop) => {
  return (
    <TouchableOpacity
      style={[styles.petCard, styles.row, { backgroundColor: prop.backgroundColor }]}
      onPress={prop.onPress}
    >
      <Image style={styles.petImg} source={ {uri: prop.avatar} }></Image>
      <Text style={[styles.petName, { color: prop.textColor }]}>{prop.name}</Text>
    </TouchableOpacity>
  )
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

  // body
  body: {
    width: '100%',
    alignItems: 'center',
  },
  clinic: {
    width: '88%',
    height: 120,
    paddingHorizontal: 12,
    alignItems: 'center',
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
    width: 74.63,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  clinicImg: {
    width: 74.63,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  clinicInfo: {
    width: '76%',
    height: 100,
    paddingVertical: '3%',
    paddingHorizontal: '1%',
    marginLeft: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  name: {
    color: '#39A3C0',
    fontSize: 20,
    fontFamily: 'lexend-regular',
  },
  address: {
    width: '92%',
    marginTop: '4%',
  },
  iconAddress: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  textAddress: {
    fontSize: 14,
    lineHeight: 18,
  },
  // time pickup
  marginLeft6: {
    marginLeft: '6%',
  },
  listTimeOptions: {
    width: '88%',
  },
  subTitle: {
    alignSelf: 'flex-start',
    color: '#A51A29',
    fontSize: 16,
    fontFamily: 'lexend-semibold',
    marginTop: '4%',
    marginBottom: '2%',
  },
  timeCard: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9bebf',
    borderRadius: 20,
    marginRight: 16,
  },
  hours: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  //pet pickup
  listPetOptions: {
    width: '88%',
  },
  petCard: {
    justifyContent: 'space-between',
    backgroundColor: '#ddf7ec',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: '4%',
    marginRight: 16,
  },
  petImg: {
    width: 44,
    height: 44,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  petName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'lexend-regular',
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  // schedule button
  btn: {
    width: '68%',
    paddingVertical: '3%',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#A51A29',
    marginTop: Dimensions.get("window").height * 0.06,
  },
  textBtn: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'lexend-semibold',
  },
});
