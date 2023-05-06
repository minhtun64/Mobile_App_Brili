import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Dimensions,
  Keyboard,
  Animated,
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
//import { isWhiteSpaceLike } from "typescript";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

export default function SignInScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const imageOpacity = useRef(new Animated.Value(1)).current;

  // const [text, setText] = useState('');
  // const [showImage, setShowImage] = useState(true);
  // const handleFocus = () => {
  //   setShowImage(false);
  // };

  // const handleBlur = () => {
  //   setShowImage(true);
  // };

  // const handleInputChange = (inputText) => {
  //   setText(inputText);
  // };

  // const handleInputFocus = () => {
  //   Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
  //   Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
  //   setShowImage(false);
  // };

  // const handleInputBlur = () => {
  //   Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
  //   Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
  //   setShowImage(true);
  // };

  // const handleKeyboardShow = () => {
  //   setShowImage(false);
  // };

  // const handleKeyboardHide = () => {
  //   setShowImage(true);
  // };

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

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        Animated.timing(imageOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };

    // return () => {
    //   Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
    //   Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    // };
  }, []);
  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {/* {showImage && ( */}
      <Animated.Image
        style={[styles.login_img, { opacity: imageOpacity }]}
        source={require("../assets/images/login.png")}
      />
      {/* )} */}

      <View style={styles.login_area}>
        <View style={styles.logo_area}>
          <Text style={styles.login_area_logo}>Chào mừng đến với</Text>
          <Image
            style={styles.logo_img}
            source={require("../assets/images/logo.png")}
          />
          <Text style={styles.login_area_logo}>Cộng đồng yêu thú cưng</Text>
        </View>
        <View style={styles.login_area_text}>
          <View style={styles.login_area_text_label}>
            <Image source={require("../assets/icons/sms1.png")} style={styles.icon}></Image>
            <Text style={styles.font}> Nhập email</Text>
          </View>
          <View style={styles.login_area_text_label}>
            <TextInput
              style={styles.login_area_text_input}
              placeholder="petcare@gmail.com"
              // onFocus={handleFocus}
              // onBlur={handleBlur}
            ></TextInput>
          </View>

          <View style={styles.login_area_text_label}>
            <Image
              source={require("../assets/icons/lock.png")}
              style={styles.icon}
            ></Image>
            <Text style={styles.font}> Mật khẩu</Text>
          </View>
          <View style={styles.login_area_text_label}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.login_area_text_input}
              // onFocus={handleFocus}
              // onBlur={handleBlur}
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
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate("HomeTabs")}
            >
              <Text style={styles.opt_login}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.login_area_text_label_signup}>
            <Text style={styles.font}> Tham gia cùng chúng tôi </Text>
            <TouchableOpacity>
              <Text style={styles.opt}>ngay tại đây!</Text>
            </TouchableOpacity>
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
    top: height * 0.25,
  },

  logo_area: {
    alignItems: "center",
    justifyContent: "center",
    top: height * 0.12,
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
    width: "100%",
  },

  login_area_text_label: {
    flexDirection: "row",
    paddingTop: 13,

  },

  font: {
    fontSize: 14,
    fontWeight: "light",
    fontFamily: "lexend-light",
    color: "black",
  },

  icon: {
    height: 24,
    width: 24,
  },

  login_area_text_input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    width: "100%",
    fontSize: 14,
    fontWeight: "light",
    fontFamily: "lexend-light",
    color: "black",
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

  opt_login: {
    fontSize: 14,
    fontWeight: "medium",
    fontFamily: "lexend-extrabold",
    color: "white",
  },

  forget_pass: {
    alignItems: "flex-end",
    paddingTop: 15,
  },

  btn: {
    width: "100%",
    height: 55,
    backgroundColor: "#F5817E",
    // marginTop: 400,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  login_btn: {
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    paddingTop: 15,
  },

  login_area_text_label_signup: {
    flexDirection: "row",
    paddingTop: 13,
    alignItems: "center",
    justifyContent: "center",
  },
});
