import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { releaseSecureAccess } from "react-native-document-picker";
import { isWhiteSpaceLike } from "typescript";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

export default function SignInScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "lexend-black": require("../assets/fonts/Lexend/static/Lexend-Black.ttf"),
        "lexend-bold": require("../assets/fonts/Lexend/static/Lexend-Bold.ttf"),
        "lexend-extrabold": require("../assets/fonts/Lexend/static/Lexend-ExtraBold.ttf"),
        "lexend-extralight": require("../assets/fonts/Lexend/static/Lexend-ExtraLight.ttf"),
        "lexend-light": require("../assets/fonts/Lexend/static/Lexend-Light.ttf"),
        "lexend-medium": require("../assets/fonts/Lexend/static/Lexend-Medium.ttf"),
        "lexend-regular": require("../assets/fonts/Lexend/static/Lexend-Regular.ttf"),
        "lexend-semibold": require("../assets/fonts/Lexend/static/Lexend-SemiBold.ttf"),
        "lexend-thin": require("../assets/fonts/Lexend/static/Lexend-Thin.ttf"),
        "SF-Pro-Display": require("../assets/fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);
  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.login_img}
        source={require("../assets/images/login.png")}
      ></Image>
      <View style={styles.login_area}>
        <View style={styles.logo_area}>
          <Text style={styles.login_area_logo}>Chào mừng đến với</Text>
          <Image
            style={styles.logo_img}
            source={require("../assets/images/logo.png")}
          ></Image>
          <Text style={styles.login_area_logo}>Cộng đồng yêu thú cưng</Text>
        </View>
        <View style={styles.login_area_text}>
          <View style={styles.login_area_text_label}>
            <Image source={require("../assets/icons/sms1.png")}></Image>
            <Text> Nhập email</Text>
          </View>
          <TextInput
            style={styles.login_area_text_input}
            placeholder="petcare@gmail.com"
          ></TextInput>

          <View style={styles.login_area_text_label}>
            <Image source={require("../assets/icons/lock.png")}></Image>
            <Text> Mật khẩu</Text>
          </View>
          <View style={styles.login_area_text_label}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.login_area_text_input}
            ></TextInput>
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.icon_password}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#ccc"
                //style={styles.icon_password}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.forget_pass}>
            <TouchableOpacity>
              <Text style={styles.opt}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.login_btn}>
            {/* <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate("HomeTabs")}
            >
              <Text style={styles.opt}>Đăng nhập</Text>
            </TouchableOpacity> */}

            <Text>Hoặc tiếp tục với</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCAC9E",
    position: "relative",
  },

  login_img: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    height: height * 0.8,
    resizeMode: "contain",
    position: "absolute",
    top: -height * 0.2,
    zIndex: 1,
  },

  login_area: {
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 69,
    borderTopRightRadius: 69,
    height: height,
    width: width,
    position: "relative",
    top: height * 0.25,
  },

  logo_area: {
    alignItems: "center",
    justifyContent: "center",
    top: height * 0.12,
    position: "relative",
  },

  logo_img: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode: "contain",
  },

  login_area_logo: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "lexend-black",
    color: "#FCAC9E",
  },

  login_area_text: {
    left: width * 0.1,
    paddingRight: width * 0.2,
    top: height * 0.12,
    position: "relative",
    width: "100%",
  },

  login_area_text_label: {
    flexDirection: "row",
    position: "relative",
  },

  login_area_text_input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    paddingRight: 20,
  },
  icon_password: {
    //right: 0,
    flexDirection: "row-reverse",
    //justifyContent: 'flex-end',
    //position: "relative",
  },

  opt: {
    fontSize: 14,
    fontWeight: "medium",
    fontFamily: "lexend-medium",
    color: "black",
  },

  forget_pass: {
    alignItems: "flex-end",
  },

  btn: {
    width: "100%",
    height: 55,
    backgroundColor: "#195ABB",
    // marginTop: 400,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  login_btn:{
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
  },
});
