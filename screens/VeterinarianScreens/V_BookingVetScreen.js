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
import React, { useEffect, useState, useContext } from "react";
import CalendarStrip from 'react-native-calendar-strip';
import { database } from "../../firebase";
import { ref, get, push, update } from "firebase/database";
import { UserContext } from "../../UserIdContext";

export default function V_BookingVetScreen({ navigation, route }) {
  const { clinicId, clinicName, clinicAgency, clinicAddress, clinicAvatar } = route.params;
  const myUserId = useContext(UserContext).userId;

  const [timeId, setTimeId] = useState(null);
  const [petId, setPetId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeList, setTimeList] = useState([]);
  const [petList, setPetList] = useState([]);

  const handleDateSelected = (date) => {
    const selectedDate = new Date(date);
    setSelectedDate(selectedDate);
  };

  useEffect(() => {
    // Truy van du lieu tu Firebase Realtime Database
    fetchDataFromFirebase();
  }, [selectedDate]);

  const fetchDataFromFirebase = async () => {
    const appoinmtRef = ref(database, `appointment_schedule/${clinicId}`);
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
          disabled: item.booked == item.slot,
        })
      }

    })
    setTimeList(timeData);

    const petRef = ref(database, `pet/${myUserId}`);
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
  }

  const appointmentRef = ref(database, `/appointment/${clinicId}/${timeId}`);

  const submitBooking = async () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedTimestamp = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    const newRecord = {
      id: Math.floor(Math.random() * 1000000) + 1,
      appointment_schedule_id: timeId,
      clinic_id: clinicId,
      pet_id: petId,
      description: '',
      status: 1,
      booking_date: formattedTimestamp,
    };

    const apmtScheduleRef = ref(database, `appointment_schedule/${clinicId}/${timeId}`);
    const apmtScheduleSnapshot = await get(apmtScheduleRef);
    const apmtScheduleData = apmtScheduleSnapshot.val();

    let bookedSlot = apmtScheduleData.booked;

    push(appointmentRef, newRecord)
      .then(() => {
        console.log('New appointment added successfully!');
        const newScheduleUpdate = {
          booked: bookedSlot + 1,
        };

        if (update(apmtScheduleRef, newScheduleUpdate)) {
          console.log('booked+1 & slot-1');
        }
      })
      .catch((error) => {
        console.log('Error adding new record:', error);
      });
  };


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


      {/* Hien thi thong tin phong kham, ngay gio, thu cung */}
      <View style={styles.body}>
        {/* Clinic info */}
        <View style={[styles.clinic, styles.row]}>
          <View style={styles.clinicImgView}>
            <Image style={styles.clinicImg} source={{ uri: clinicAvatar }}></Image>
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.name}>{clinicName}</Text>
            <Text style={styles.agency}>Cơ sở {clinicAgency}</Text>
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
          {timeList && timeList.map(item => {
            const bgrColor = item.id === timeId ? '#b0dbe2' : '#f9bebf';
            const color = item.id === timeId ? '#4d5f62' : '#ffffff';

            return (
              <TimeCard
                key={item.id}
                {...item}
                onPress={() => setTimeId(item.id)}
                backgroundColor={bgrColor}
                textColor={color}
                disabled={item.disabled}   //disabled TimeCard khi het lich kham nay het slot 
              />);
          }
          )}
        </ScrollView>
        {/* pickup pet */}
        <Text style={[styles.subTitle, styles.marginLeft6]}>Thú cưng</Text>
        <ScrollView horizontal={true} style={styles.listPetOptions}>
          {petList && petList.map(item => {
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
            if (petId != null && timeId != null) {
              submitBooking();
              navigation.navigate('V_BookingSuccess');
            }
          }}
        >
          <Text style={styles.textBtn}>Xác nhận đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const TimeCard = (prop) => {
  const backgroundColor = prop.disabled ? '#ccc' : prop.backgroundColor;
  const textColor = prop.disabled ? '#ffffff' : prop.textColor;

  return (
    <TouchableOpacity
      style={[styles.timeCard, { backgroundColor }]}
      onPress={prop.onPress}
      disabled={prop.disabled}
    >
      <Text style={[styles.hours, { color: textColor }]}>{prop.startTime + ' - ' + prop.endTime}</Text>
    </TouchableOpacity>
  )
}

const PetCard = (prop) => {
  return (
    <TouchableOpacity
      style={[styles.petCard, styles.row, { backgroundColor: prop.backgroundColor }]}
      onPress={prop.onPress}
    >
      <Image style={styles.petImg} source={{ uri: prop.avatar }}></Image>
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
    paddingVertical: '1%',
    paddingHorizontal: '1%',
    marginLeft: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  name: {
    color: '#39A3C0',
    fontSize: 19,
    fontFamily: 'lexend-regular',
  },
  agency: {
    color: '#39A3C0',
    fontSize: 16,
    fontFamily: 'lexend-light',
  },
  address: {
    width: '94%',
    marginTop: '2%',
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
