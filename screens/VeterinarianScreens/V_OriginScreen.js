import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";


export default function V_OriginScreen({ navigation }) {
const [fontLoaded, setFontLoaded] = useState(false);

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
  <View>
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image style={styles.banner} source={require('../../assets/images/V_banner.png')}></Image>
      </View>
      <View style={styles.seperation}></View>
      <View style={styles.listAppointment}>
        <View style={styles.heading}>
          <Text style={styles.title}>Danh sách lịch hẹn</Text>
        </View>
        <Image style={styles.emptyImage} source={require('../../assets/icons/V_calendar.png')}></Image>
        <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào!</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate("V_Location")}>
            <Image source={require('../../assets/icons/V_footprint.png')}></Image>
        </TouchableOpacity>
      </View>    
    </View>
  </View>
);
}


const styles = StyleSheet.create({
container:{
  width: "100%",
  height: '100%',  
  backgroundColor: '#FFF6F6',
},
bannerContainer:{
  width: '100%',
  marginTop: 64,
},
banner:{
  width: '90%',
  resizeMode: 'cover',
  marginRight: 'auto',
  marginLeft: 'auto',
  marginBottom: 24,
  borderRadius: 12,
},
seperation:{
  width: '100%',
  height: 12,
  backgroundColor: '#FFFFFF',
},
listAppointment:{
  width: '100%',
  padding: 16,  
  bottom: 0,
  backgroundColor: '#FFF6F6',
  flex: 1,
  alignContent: 'space-between',
},
heading:{
  backgroundColor: '#E02D33',
  paddingHorizontal: 40,
  paddingVertical: 6,
  alignSelf: 'center',
  borderRadius: 32,
  position: 'absolute',
  top: 16,
},
title:{
  fontFamily: 'lexend-bold',
  color: '#FFFFFF',
  fontSize: 18,
}, 
emptyImage:{
  width: '40%',
  resizeMode: 'contain',
  alignSelf: 'center',
  marginTop: 'auto',
  marginBottom: 8,
}, 
emptyText:{
  fontFamily: 'lexend-regular',
  fontSize: 16,
  alignSelf: 'center',
  marginBottom: 'auto',
},
addBtn:{
  alignSelf: 'flex-end',
  width: '12%',
  marginRight: 16,
  marginBottom: Dimensions.get("window").height * 0.1 + 16,
},
});
