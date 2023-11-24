import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import * as Font from "expo-font";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

export default function V_LocationScreen({ navigation }) {
  //Data Source for the SearchableDropdown
  const apiUrl =
    "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json";
  var data = [];
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const { width, height } = layout;
  const halfHeight = height * 1.5;

  useEffect(() => {
    axios
      .get(`${apiUrl}`)
      .then((res) => {
        setProvinces(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <View style={styles.wrapping}>
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
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

      <View style={styles.container}>
        <Text style={styles.headingModal}>Chọn vị trí của bạn</Text>
        <KeyboardAwareScrollView style={styles.addressContainer}>
          <Text style={styles.titleSelect}>Tỉnh/ Thành phố:</Text>
          <SelectList
            setSelected={(val) => {
              setSelectedProvince(val);
              setProvinceName(provinces[val].Name);
            }}
            data={provinces.map((city, index) => ({
              key: index,
              value: city.Name,
            }))}
            save="key"
            placeholder="Chọn Thành phố"
            searchPlaceholder="Tìm kiếm"
          />

          {/*
          Quận/Huyện dropdown
          */}
          <Text style={styles.titleSelect}>Quận/ Huyện: </Text>
          <SelectList
            setSelected={(val) => {
              setDistrictName(provinces[selectedProvince].Districts[val].Name);
              setSelectedDistrict(val);
            }}
            data={
              selectedProvince !== ""
                ? provinces[selectedProvince].Districts.map(
                    (district, index) => ({
                      key: index,
                      value: district.Name,
                    })
                  )
                : ""
            }
            save="key"
            placeholder="Chọn Quận huyện"
            searchPlaceholder="Tìm kiếm"
            notFoundText="Vui lòng chọn Tỉnh/Thành phố!"
          />

          {/*
          Phường/Xã dropdown 
          */}
          <Text style={styles.titleSelect}>Phường/ Xã:</Text>
          <SelectList
            setSelected={(val) => {
              setWardName(
                provinces[selectedProvince].Districts[selectedDistrict].Wards[
                  val
                ].Name
              );
              setSelectedWard(val);
              setIsButtonDisabled(false);
            }}
            data={
              selectedProvince !== "" && selectedDistrict !== ""
                ? provinces[selectedProvince].Districts[
                    selectedDistrict
                  ].Wards.map((ward, index) => ({
                    key: index,
                    value: ward.Name,
                  }))
                : ""
            }
            save="key"
            placeholder="Chọn Phường xã"
            searchPlaceholder="Tìm kiếm"
            notFoundText="Vui lòng chọn Tỉnh/Thành phố! và Quận/Huyện!"
          />
        </KeyboardAwareScrollView>
      </View>
      <Image
        style={{
          width: halfHeight,
          height: "18%",
          resizeMode: "cover",
          position: "absolute",
          top: "10%",
          right: 2,
        }}
        source={require("../../assets/images/V_bookingVet.png")}
        onLayout={onLayout}
      ></Image>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[
            styles.btnBackground,
            { backgroundColor: isButtonDisabled ? "#DFDFDF" : "#A51A29" },
          ]}
          disabled={isButtonDisabled}
          onPress={() =>
            navigation.navigate("V_ListVetClinic", {
              provinceName,
              districtName,
              wardName,
            })
          }
        >
          <Text
            style={[
              styles.btnText,
              { color: isButtonDisabled ? "#8C8C8C" : "#FFFFFF" },
            ]}
          >
            Tìm phòng khám
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapping: {
    height: "95%",
    backgroundColor: "#FFFFFF",
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
  container: {
    width: "94%",
    height: "100%",
    alignSelf: "center",
    marginTop: "10%",
  },
  headingModal: {
    fontSize: 18,
    fontFamily: "lexend-medium",
    marginBottom: "4%",
    paddingLeft: "4%",
  },
  titleSelect: {
    fontSize: 14,
    fontFamily: "lexend-medium",
    marginBottom: "1%",
    marginTop: "3%",
  },
  btnContainer: {
    width: "100%",
    position: "absolute",
    bottom: "5.5%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: "3%",
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
  selectListContainer: {
    width: "100%",
    justifyContent: "space-between",
    fontSize: 8,
  },
  addressContainer: {
    flex: 1,
    width: "100%",
    padding: "4%",
    marginBottom: Dimensions.get("window").height * 0.27,
  },
});
