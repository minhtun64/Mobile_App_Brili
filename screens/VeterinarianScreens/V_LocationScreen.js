import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Font from "expo-font";
import SearchableDropdown from 'react-native-searchable-dropdown';
import axios from 'axios';

export default function V_LocationScreen({ navigation }) {
  //Data Source for the SearchableDropdown
  const apiUrl = 'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json';
  const [fontLoaded, setFontLoaded] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const { width, height } = layout;
  const halfHeight = height * 1.5;

  useEffect(() => {
    axios.get(`${apiUrl}`)
      .then(res => {
        setProvinces(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "lexend-black": require("../../assets/fonts/Lexend/static/Lexend-Black.ttf"),
        "lexend-bold": require("../../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
        "lexend-extrabold": require("../../assets/fonts/Lexend/static/Lexend-ExtraBold.ttf"),
        "lexend-extralight": require("../../assets/fonts/Lexend/static/Lexend-ExtraLight.ttf"),
        "lexend-light": require("../../assets/fonts/Lexend/static/Lexend-Light.ttf"),
        "lexend-medium": require("../../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
        "lexend-regular": require("../../assets/fonts/Lexend/static/Lexend-Regular.ttf"),
        "lexend-semibold": require("../../assets/fonts/Lexend/static/Lexend-SemiBold.ttf"),
        "lexend-thin": require("../../assets/fonts/Lexend/static/Lexend-Thin.ttf"),
        "SF-Pro-Display": require("../../assets/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  if (!fontLoaded) {
    return null; // or a loading spinner
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


      <SafeAreaView style={styles.container}>
        <Text style={styles.headingModal}>Chọn vị trí của bạn</Text>
        <View style={styles.provincesContainer}>
          <Text style={styles.addressLabel}>
            Tỉnh/Thành phố:
          </Text>
          <SearchableDropdown
            keyboardDismissMode="interactive"
            onTextChange={(text) => console.log(text)}
            //On text change listner on the searchable input
            onItemSelect={(item) => {
              setSelectedProvince(item.name)
              setDistricts(item.districts)
            }}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              height: 44,
              width: '84%',
              alignSelf: 'center',
              padding: 12,
              borderWidth: 1,
              borderColor: '#887E7E',
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
            }}
            itemStyle={{
              //single dropdown item style
              width: '84%',
              padding: 10,
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
              fontSize: 13,
              color: '#222',
            }}
            itemsContainerStyle={{
              //items container style you can pass maxHeight
              //to restrict the items dropdown hieght
              maxHeight: '60%',
            }}
            items={provinces.map((city, index) => ({
              id: index,
              name: city.Name,
              districts: city.Districts
            }))}
            //mapping of item array
            defaultIndex={2}
            //default selected item index
            placeholder="Tìm Thành phố ..."
            //place holder for the search input
            resetValue={false}
            //reset textInput Value with true and false state
            underlineColorAndroid="transparent"
          //To remove the underline from the android input
          />
        </View>

        {/*
          Quận/Huyện dropdown
        */}
        <View style={styles.districtsContainer}>
          <Text style={styles.addressLabel}>
            Quận/Huyện:
          </Text>
          <SearchableDropdown
            keyboardDismissMode="interactive"
            onTextChange={(item) => console.log(item)}
            //On text change listner on the searchable input
            onItemSelect={(item) => {
              setSelectedDistrict(item.name)
              setWards(item.wardsArr)
            }}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              height: 44,
              width: '84%',
              alignSelf: 'center',
              padding: 12,
              borderWidth: 1,
              borderColor: '#887E7E',
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
            }}
            itemStyle={{
              //single dropdown item style
              width: '84%',
              padding: 10,
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
              fontSize: 13,
              color: '#222',
            }}
            itemsContainerStyle={{
              //items container style you can pass maxHeight
              //to restrict the items dropdown hieght
              maxHeight: '60%',
            }}
            items={districts.map((district, index) => ({
              id: district.Id,
              name: district.Name,
              wardsArr: district.Wards,
            }))}
            //mapping of item array
            defaultIndex={2}
            //default selected item index
            placeholder="Tìm Quận/Huyện ..."
            //place holder for the search input
            resetValue={false}
            //reset textInput Value with true and false state
            underlineColorAndroid="transparent"
            //To remove the underline from the android input
            disabled={true}
          />
        </View>

        {/*
          Phường/Xã dropdown 
          */}
        <View style={styles.wardsContainer}>
          <Text style={styles.addressLabel}>
            Phường/Xã:
          </Text>
          <SearchableDropdown
            onTextChange={(item) => console.log(item)}
            //On text change listner on the searchable input
            onItemSelect={(item) => {
              setSelectedWard(item.name)  
              if (selectedProvince !== null && selectedDistrict !== null && selectedWard !== null) 
                setIsButtonDisabled(false);
            }}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              height: 44,
              width: '84%',
              alignSelf: 'center',
              padding: 12,
              borderWidth: 1,
              borderColor: '#887E7E',
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
            }}
            itemStyle={{
              //single dropdown item style
              width: '84%',
              padding: 10,
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
              fontSize: 13,
              color: '#222',
            }}
            itemsContainerStyle={{
              //items container style you can pass maxHeight
              //to restrict the items dropdown hieght
              maxHeight: '60%',
            }}
            items={wards.map((ward, index) => ({
              id: ward.Id,
              name: ward.Name
            }))}
            //mapping of item array
            defaultIndex={2}
            //default selected item index
            placeholder="Tìm Phường/Xã ..."
            //place holder for the search input
            resetValue={false}
            //reset textInput Value with true and false state
            underlineColorAndroid="transparent"
          //To remove the underline from the android input
          />
        </View>
      </SafeAreaView>
      <Image
        style={{
          width: halfHeight,
          height: '28%',
          resizeMode: 'cover',
          alignSelf: 'center',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
        source={require('../../assets/images/V_bookingVet.png')}
        onLayout={onLayout}>
      </Image>
      <TouchableOpacity
        style={[
          styles.submitBtn, 
          { backgroundColor: isButtonDisabled ? '#CCCCCC' : '#A51A29' }
        ]}
        disabled={isButtonDisabled}
        onPress={() => navigation.navigate("V_ListVetClinic")}
      >
        <Text style={styles.textBtn}>Tìm phòng khám</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapping: {
    height: Dimensions.get("window").height * 0.95,
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
  container: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFF6F6',
    paddingTop: '2%',
    paddingBottom: '4%',
    borderRadius: 36,
    borderWidth: 0.5,
    borderColor: '#F5817E',
  },
  headingModal: {
    fontSize: 18,
    fontFamily: 'lexend-medium',
    marginLeft: 20,
    marginBottom: 2,
  },
  addressLabel: {
    marginLeft: 24,
    marginTop: 2,
    fontSize: 13,
    fontFamily: 'lexend-semibold',
  },
  submitBtn: {
    width: '80%',
    borderRadius: 8,
    padding: 12,
    marginBottom: Dimensions.get("window").height * 0.05 + 16,
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: 16,
    fontFamily: 'lexend-bold',
    color: '#FFFFFF',
    alignSelf: 'center',
  }
});


