import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    View,
    Image,
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
    <ImageBackground 
    style={styles.background}
    source={require("../../assets/images/V_background.png")}
    imageStyle={{resizeMode: 'contain'}}>
      <View style={styles.title}>
        <Image source={require("../../assets/icons/V_calendar1.png")} />
        <Text style={styles.textTitle}>Danh sách lịch hẹn</Text>
      </View>
      <View style={styles.content}>
        <Image style={styles.calendarIcon2} source={require("../../assets/icons/V_calendar2.png")}></Image>
        <Text style={styles.textContent}>Bạn chưa có lịch hẹn nào!</Text>
        <TouchableOpacity style={styles.addBtn}>       
            <Image style={styles.addIcon} source={require("../../assets/icons/V_add-icon.png")}></Image>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  title: {
    width: "100%",
    marginTop: "20%",
    flexDirection: "row",
    justifyContent: "center",
  },
  textTitle: {
    fontSize: 18,
    color: "#F5817E",
    fontFamily: "lexend-semibold",
    alignSelf: "center",
    marginLeft: 6,
  },
  content: {
    width: "100%",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  calendarIcon2: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  textContent: {
    fontSize: 16,
    color: "#7C7C7C",
    fontFamily: "lexend-semibold",
    alignSelf: "center",
    marginBottom: "36%",
    marginTop: 8,
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 48,
    backgroundColor: "#F5817E",    
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 2,   
    borderRightColor: "#DDDDDD",
    borderRightWidth: 2,   
    alignSelf: "flex-end",
    justifyContent: "center",
    marginRight: 36,
    marginBottom: 8,
  },
  addIcon: {
    alignSelf: "center",
  },
});
