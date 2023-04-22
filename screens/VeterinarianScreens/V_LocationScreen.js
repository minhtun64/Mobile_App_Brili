// Example of Searchable Dropdown / Picker in React Native
// https://aboutreact.com/example-of-searchable-dropdown-picker-in-react-native/

import React, { useState, useEffect } from 'react';
import {     
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Font from "expo-font";
import SearchableDropdown from 'react-native-searchable-dropdown';
import axios from 'axios';
import { set } from 'react-hook-form';

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

  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const { width, height } = layout;
  const halfWidth = height;

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
      
      <Image 
        style={{ 
          width: halfWidth, 
          height: '28%',        
          position: 'absolute',
          top: '8%',
          resizeMode: 'cover',
          alignSelf: 'center',
          }} 
          source={require('../../assets/images/V_bookingVet.png')}
          onLayout={onLayout}>
      </Image>

      <SafeAreaView style={styles.container}>
        <Text style={styles.headingModal}>Chọn vị trí của bạn</Text>
        <View style={styles.provincesContainer}>
          <Text style={styles.addressLabel}>
            Tỉnh/Thành phố:
          </Text>
          <SearchableDropdown
            //On text change listner on the searchable input
            onItemSelect={(item) => {
              setSelectedProvince(item.name);
              setDistricts(item.districts)
            }}
            selectedItems={selectedProvince}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              height: 48,
              width: '80%',
              alignSelf: 'center',
              padding: 12,
              borderWidth: 1,
              borderColor: '#887E7E',
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
            }}
            itemStyle={{
              //single dropdown item style
              width: '80%',
              padding: 10,
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
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
            //On text change listner on the searchable input
            onItemSelect={(item) => {
              setSelectedDistrict(item.name)
              setWards(item.wardsArr)
            }}
            selectedItems={selectedDistrict}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              height: 48,
              width: '80%',
              alignSelf: 'center',
              padding: 12,
              borderWidth: 1,
              borderColor: '#887E7E',
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
            }}
            itemStyle={{
              //single dropdown item style
              width: '80%',
              padding: 10,
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
              color: '#222',
            }}
            itemsContainerStyle={{
              //items container style you can pass maxHeight
              //to restrict the items dropdown hieght
              maxHeight: '30%',
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
            //On text change listner on the searchable input
            onItemSelect={(item) => 
              setSelectedWard(item.name)
            }
            selectedItems={selectedWard}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              height: 48,
              width: '80%',
              alignSelf: 'center',
              padding: 12,
              borderWidth: 1,
              borderColor: '#887E7E',
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
            }}
            itemStyle={{
              //single dropdown item style
              width: '80%',
              padding: 10,
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
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
        <TouchableOpacity 
        style={styles.submitBtn}
        onPress={() => navigation.navigate("V_ListVetClinic")}
        >
          <Text style={styles.textBtn}>Tìm phòng khám</Text>
        </TouchableOpacity>
      </SafeAreaView>      
    </View>
  );
};

const styles = StyleSheet.create({
  wrapping: {
    height: '100%',
    backgroundColor: '#FFF6F6',
  },
  header:{
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
  // bookingImg: {
  //   width: '48%',
  //   height: '26%',
  //   position: 'absolute',
  //   top: '8%',
  //   resizeMode: 'cover',
  //   alignSelf: 'center',
  // },
  container: {
    width: '100%',
    height: '54%',
    position: 'absolute',
    bottom: Dimensions.get("window").height * 0.1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,        
  },
  headingModal:{
    alignSelf: 'center',
    color: '#A51A29',
    fontSize: 16,
    fontFamily: 'lexend-semibold',
    marginTop: 12,
  },
  addressLabel: {
    marginLeft:  24,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    fontFamily: 'lexend-semibold',
  },
  submitBtn: {
   width: '80%',
   borderRadius: 8,   
   padding: 12,
   marginTop: '4%',
   marginBottom: 12,
   alignSelf: 'center',
   backgroundColor: '#A51A29',
  },
  textBtn: {
    fontSize: 16,
    fontFamily: 'lexend-bold',
    color: '#FFFFFF',
    alignSelf: 'center',
  }
});
