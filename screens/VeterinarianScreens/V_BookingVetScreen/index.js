import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import CalendarStrip from "react-native-calendar-strip";
import { database } from "../../../firebase";
import { ref, get, push, update } from "firebase/database";
import { UserContext } from "../../../UserIdContext";
import moment from "moment";
import TimeCard from "./TimeCard";
import PetCard from "./PetCard";

export default function V_BookingVetScreen({ navigation, route }) {
  const { clinicId, clinicName, clinicAgency, clinicAddress, clinicAvatar } =
    route.params;
  const myUserId = useContext(UserContext).userId;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeList, setTimeList] = useState([]);
  const [petList, setPetList] = useState([]);
  const [timeId, setTimeId] = useState(null);
  const [petId, setPetId] = useState(null);

  useEffect(() => {
    // lay danh sach gio kham
    fetchDataFromFirebase();
  }, [selectedDate]);

  // load data thoi gian kham va list thu cung cua user
  const fetchDataFromFirebase = async () => {
    // get time list according to date
    let currentDate = moment(selectedDate).format("DD-MM-YYYY");
    let scheduleRef = ref(
      database,
      `clinicSchedule/${clinicId}/${currentDate}`
    );
    let timeData = [];
    let scheduleSnapshot = await get(scheduleRef);
    scheduleSnapshot.forEach((childSnapshot) => {
      let scheduleNode = childSnapshot.val();
      timeData.push({
        id: childSnapshot.key,
        startTime: scheduleNode.startTime,
        endTime: scheduleNode.endTime,
        slot: scheduleNode.slot,
        booked: scheduleNode.booked,
      });
    });
    setTimeList(timeData);

    // get pet list of user
    let petRef = ref(database, `pet/${myUserId}`);
    let petSnapshot = await get(petRef);
    let petData = petSnapshot.val();
    let petArr = [];
    Object.keys(petData).forEach((key) => {
      let item = petData[key];
      petArr.push({
        id: key, // Lay key cua nut du lieu lam ID
        name: item.name,
        avatar: item.avatar,
      });
    });
    setPetList(petArr);
  };

  // them lich hen vao database
  const submitBooking = async () => {
    let newRecord = {
      clinicName: clinicName,
      clinicAddress: clinicAddress,
      clinicAgency: clinicAgency,
      petName: petList.find((element) => element.id === petId).name,
      petAvatar: petList.find((element) => element.id === petId).avatar,
      createdDate: moment().format("DD-MM-YYYY HH:mm:ss"),
      scheduleDate: moment(selectedDate).format("DD-MM-YYYY"),
      startTime: timeList.find((element) => element.id === timeId).startTime,
      endTime: timeList.find((element) => element.id === timeId).endTime,
      status: "Đã đặt",
      description: "",
    };

    let currentDate = moment(selectedDate).format("DD-MM-YYYY");
    let appointmentRef = ref(database, `appointment/${clinicId}/${myUserId}`);
    push(appointmentRef, newRecord)
      .then(() => {
        console.log("New appointment added successfully!");
        let scheduleRef = ref(
          database,
          `clinicSchedule/${clinicId}/${currentDate}/${timeId}`
        );
        get(scheduleRef)
        .then (scheduleSnapshot => {
          bookedSlot = scheduleSnapshot.val().booked;
          let bookedUpdate = {
            booked: parseInt(bookedSlot, 10) + 1,
          };
          if (update(scheduleRef, bookedUpdate)) {
            console.log("booked+1");
          }
        });
      })
      .catch((error) => {
        console.log("Error adding new record:", error);
      });
  };

  // cap nhat khi nguoi dung thay doi ngay tren lich
  const handleDateSelected = (date) => {
    const selectedDate = new Date(date);
    setSelectedDate(selectedDate);
  };

  // render giao dien nguoi dung
  return (
    <View style={styles.wrapping}>
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.backIcon}
            source={require("../../../assets/icons/V_backIconMain.png")}
          ></Image>
        </TouchableOpacity>
        <View style={[styles.headerTitle, styles.row]}>
          <Text style={styles.headerText}>Đặt lịch hẹn</Text>
        </View>
      </View>

      {/* Hien thi thong tin phong kham, ngay gio, thu cung */}
      <View style={styles.body}>
        {/* Clinic info */}
        <View style={[styles.clinic, styles.row]}>
          <View style={styles.clinicImgView}>
            <Image
              style={styles.clinicImg}
              source={{ uri: clinicAvatar }}
            ></Image>
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.name}>{clinicName}</Text>
            <Text style={styles.agency}>Cơ sở {clinicAgency}</Text>
            <View style={[styles.address, styles.row]}>
              <Image
                style={styles.iconAddress}
                source={require("../../../assets/icons/V_clinic-location.png")}
              ></Image>
              <Text style={styles.textAddress}>{clinicAddress}</Text>
            </View>
          </View>
        </View>
        {/* pickup date */}
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 30 }}
          daySelectionAnimation={{
            type: "border",
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: "#7e9da2",
          }}
          style={{
            width: "88%",
            height: 96,
            paddingTop: 12,
            marginTop: 16,
            paddingBottom: 10,
            borderRadius: 24,
          }}
          calendarHeaderStyle={{ fontSize: 15, color: "#7e9da2" }}
          calendarColor={"#f9bebf"}
          dateNumberStyle={{ color: "#FFFFFF" }}
          dateNameStyle={{ color: "#FFFFFF" }}
          highlightDateNumberStyle={{ color: "#7e9da2" }}
          highlightDateNameStyle={{ color: "#7e9da2" }}
          disabledDateNameStyle={{ color: "grey" }}
          disabledDateNumberStyle={{ color: "grey" }}
          iconContainer={{ flex: 0.1 }}
          selectedDate={selectedDate}
          onDateSelected={handleDateSelected}
        />
        {/* pickup time */}
        <Text style={[styles.subTitle, styles.marginLeft6]}>Thời gian</Text>
        <ScrollView horizontal={true} style={styles.listTimeOptions}>
          {timeList &&
            timeList.map((item) => {
              const bgrColor = item.id === timeId ? "#b0dbe2" : "#f9bebf";
              const color = item.id === timeId ? "#4d5f62" : "#ffffff";

              return (
                <TimeCard
                  key={item.id}
                  {...item}
                  onPress={() => setTimeId(item.id)}
                  backgroundColor={bgrColor}
                  textColor={color}
                />
              );
            })}
        </ScrollView>
        {/* pickup pet */}
        <Text style={[styles.subTitle, styles.marginLeft6]}>Thú cưng</Text>
        <ScrollView horizontal={true} style={styles.listPetOptions}>
          {petList &&
            petList.map((item) => {
              const bgrColor = item.id === petId ? "#b0dbe2" : "#f9bebf";
              const color = item.id === petId ? "#4d5f62" : "#ffffff";

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
      </View>

      {/* schedule button */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[
            styles.btnBackground,
            {
              backgroundColor:
                petId != null && timeId != null ? "#A51A29" : "#DFDFDF",
            },
          ]}
          onPress={() => {
            if (petId != null && timeId != null) {
              submitBooking();
              navigation.navigate("V_BookingSuccess");
            }
          }}
        >
          <Text
            style={[
              styles.btnText,
              {
                color: petId != null && timeId != null ? "#FFFFFF" : "#8C8C8C",
              },
            ]}
          >
            xác nhận đặt lịch
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapping: {
    backgroundColor: "#FFFFFF",
    height: Dimensions.get("window").height,
  },
  row: {
    flexDirection: "row",
  },
  header: {
    width: "100%",
    marginTop: "10%",
  },
  backBtn: {
    resizeMode: "contain",
    padding: 16,
    marginHorizontal: "3%",
  },
  title: {
    backgroundColor: "#FFF6F6",
  },
  titleImg: {
    width: 28,
    height: 28,
    marginLeft: 24,
    marginRight: 4,
  },
  titleText: {
    width: "72%",
    fontSize: 15,
    fontFamily: "lexend-semibold",
    color: "#FFFFFF",
    backgroundColor: "#F5817E",
    borderRadius: 12,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  headerTitle: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    marginRight: "12%",
    marginTop: 8,
  },
  headerText: {
    color: "#A51A29",
    fontSize: 18,
    alignSelf: "center",
    fontFamily: "lexend-bold",
    paddingBottom: 8,
  },
  headerImg: {
    width: "6%",
    marginLeft: 6,
    resizeMode: "contain",
    justifyContent: "flex-start",
  },

  // body
  body: {
    width: "100%",
    alignItems: "center",
  },
  clinic: {
    width: "88%",
    height: 120,
    paddingHorizontal: 12,
    alignItems: "center",
    backgroundColor: "#f9bebf",
    borderRadius: 8,
  },
  clinicImgView: {
    elevation: 6,

    // add shadows for iOS only
    shadowColor: "black",
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
    borderColor: "#FFFFFF",
    resizeMode: "contain",
  },
  clinicInfo: {
    width: "76%",
    height: 100,
    paddingVertical: "1%",
    paddingHorizontal: "1%",
    marginLeft: -6,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  name: {
    color: "#39A3C0",
    fontSize: 19,
    fontFamily: "lexend-regular",
  },
  agency: {
    color: "#39A3C0",
    fontSize: 16,
    fontFamily: "lexend-light",
  },
  address: {
    width: "94%",
    marginTop: "2%",
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
    marginLeft: "6%",
  },
  listTimeOptions: {
    width: "88%",
  },
  subTitle: {
    alignSelf: "flex-start",
    color: "#A51A29",
    fontSize: 16,
    fontFamily: "lexend-semibold",
    marginTop: "4%",
    marginBottom: "2%",
  },
  //pet pickup
  listPetOptions: {
    width: "88%",
  },
  // schedule button
  btnContainer: {
    width: "100%",
    position: "absolute",
    bottom: "12%",
  },
  btnBackground: {
    width: "72%",
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  btnText: {
    fontSize: 14.5,
    fontFamily: "lexend-medium",
    textTransform: "uppercase",
  },
});
