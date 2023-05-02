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
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const { width, height } = layout;
  const calHeight = width / 2.32;

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
      <View style={styles.listAppointment}>
        <View style={styles.heading}>
          <Text style={styles.title}>Danh sách lịch hẹn</Text>
        </View>
        <View style={styles.emptyList}>
          <Image style={styles.emptyImage} source={require('../../assets/icons/V_calendar.png')}></Image>
          <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào!</Text>
        </View>
      </View>

      {/* add new appointment button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("V_Location")}>
        <Image style={styles.btnImg} source={require('../../assets/icons/V_footprint.png')}></Image>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: '#FFF6F6',
  },
  seperation: {
    width: '100%',
    height: 12,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    backgroundColor: '#E02D33',
    paddingHorizontal: 40,
    paddingVertical: 6,
    alignSelf: 'center',
    borderRadius: 32,
    marginTop: 12,
  },
  title: {
    fontFamily: 'lexend-bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  listAppointment: {
    width: '100%',
    height: '62%',
  },
  emptyList: {
    height: '68%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: '44%',
    height: '44%',
    resizeMode: 'contain',
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'lexend-regular',
    marginTop: 4,
  },
  addBtn: {
    width: '12%',
    height: '12%',
    position: 'absolute',
    right: 20,
    bottom: Dimensions.get("window").height * 0.1 + 8,
  },
  btnImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
