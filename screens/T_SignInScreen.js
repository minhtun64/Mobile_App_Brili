import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { releaseSecureAccess } from "react-native-document-picker";
import { auth } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../UserIdContext";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

export default function T_SignInScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const { setUserId } = useContext(UserContext);
  const handleSignIn = async () => {
    console.log("Đăng nhập");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Đăng nhập thành công, bạn có thể lấy thông tin userId từ user.uid
        const myUserId = userCredential.user.uid;
        // Chuyển hướng đến màn hình HomeTabs và truyền userId qua navigation
        console.log(myUserId);
        setUserId(myUserId);
        navigation.navigate("HomeTabs");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 20, android: 200 })}
    >
      {/* <View style={styles.container}> */}
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

        <ScrollView style={styles.login_area_text}>
          <View style={styles.login_area_text_label}>
            <Image
              style={styles.login_icon}
              source={require("../assets/icons/sms-login.png")}
            ></Image>
            <Text style={styles.login_text}>Email</Text>
          </View>
          <TextInput
            style={styles.login_area_text_input}
            returnKeyType="next"
            placeholder="petcare@gmail.com"
            keyboardType="email-address"
            autoCorrect={false}
            spellCheck={false}
            value={email}
            onChangeText={setEmail}
          ></TextInput>

          <View style={styles.login_area_text_label}>
            <Image
              style={styles.login_icon}
              source={require("../assets/icons/lock-login.png")}
            ></Image>
            <Text style={styles.login_text}>Mật khẩu</Text>
          </View>
          <View style={styles.login_area_text_label}>
            <TextInput
              placeholder="**********"
              secureTextEntry={showPassword}
              style={styles.login_area_text_input2}
              autoCorrect={false}
              spellCheck={false}
              value={password}
              onChangeText={setPassword}
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
              <Text style={styles.opt1}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.login_btn}>
            <TouchableOpacity style={styles.btn} onPress={handleSignIn}>
              <Text style={styles.opt2}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* <Text style={styles.opt3}>Hoặc tiếp tục với</Text> */}
            <View style={styles.formControl3}>
              <Text style={styles.ask}>Chưa có tài khoản?</Text>
              <TouchableOpacity>
                <Text
                  style={styles.signUp}
                  // onPress={() => navigation.navigate("SignUp")}
                >
                  Đăng ký ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  ask: {
    color: "black",
    fontFamily: "lexend-light",
  },
  signUp: {
    color: "#1868DF",
    marginLeft: 4,
    fontFamily: "lexend-medium",
  },
  formControl3: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 60,
    //alignItems: "center",
  },
  login_icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  login_text: {
    fontSize: 16,
    fontFamily: "lexend-medium",
  },
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
    marginTop: 30,
  },

  login_area_text_label: {
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
  },

  login_area_text_input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    paddingBottom: 5,
    marginBottom: 16,
    marginTop: 8,
    fontSize: 18,
  },
  login_area_text_input2: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "92%",
    paddingBottom: 5,
    marginBottom: 16,
    marginTop: 8,
    fontSize: 18,
  },
  icon_password: {
    //right: 0,
    flexDirection: "row-reverse",
    marginTop: -16,
    //justifyContent: 'flex-end',
    //position: "relative",
  },

  opt1: {
    fontSize: 14,
    fontWeight: "medium",
    fontFamily: "lexend-medium",
    color: "black",
  },
  opt2: {
    fontSize: 18,
    fontWeight: "medium",
    fontFamily: "lexend-medium",
    color: "white",
  },
  opt3: {
    fontSize: 14,
    fontFamily: "lexend-light",
    color: "black",
  },

  forget_pass: {
    alignItems: "flex-end",
    marginBottom: 12,
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

    marginBottom: 4,
  },

  login_btn: {
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
  },
});
