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
  Picker,
  KeyboardAvoidingView,
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
import DatePicker from "react-native-datepicker";
import { RadioButton } from "react-native-paper";
import { CheckBox } from "react-native-elements";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

export default function SignInScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const [checked, setChecked] = useState(false);
  const [gender, setGender] = useState("male");
  const handleGenderChange = (value) => {
    setGender(value);
  };

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
  }, []);
  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.login_img]}
        source={require("../assets/images/signup3.png")}
      />
      <View style={styles.signup_area}>
        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label}>
            <Image
              source={require("../assets/icons/sms.png")}
              style={styles.icon}
            ></Image>
            <TextInput
              style={styles.login_area_text_input}
              placeholder="Nhập email"
            ></TextInput>
          </View>
        </View>

        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label}>
            <Image
              source={require("../assets/icons/icons8-user-48.png")}
              style={styles.icon}
            ></Image>
            <TextInput
              style={styles.login_area_text_input}
              placeholder="Nhập họ tên"
              // onFocus={handleFocus}
              // onBlur={handleBlur}
            ></TextInput>
          </View>
        </View>

        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label_lock}>
            <Image
              source={require("../assets/icons/lock.png")}
              style={styles.icon}
            ></Image>
            <View style={styles.login_area_text_label}>
              <TextInput
                placeholder="Nhập mật khẩu"
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
                  color="#fff"
                  //style={styles.icon_password}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label_lock}>
            <Image
              source={require("../assets/icons/lock-circle.png")}
              style={styles.icon}
            ></Image>
            <View style={styles.login_area_text_label}>
              <TextInput
                placeholder="Nhập lại mật khẩu lần nữa"
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
                  color="#fff"
                  //style={styles.icon_password}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label}>
            <Image
              source={require("../assets/icons/cake.png")}
              style={styles.icon}
            ></Image>
            <DatePicker
              style={styles.datePicker}
              // date={addPetBirthdate}
              mode="date"
              format="DD-MM-YYYY"
              placeholder="Chọn ngày sinh"
              confirmBtnText="Xác nhận"
              cancelBtnText="Hủy"
              customStyles={{
                dateInput: {
                  borderWidth: 0,
                  alignItems: "flex-start",
                },
                dateText: {
                  fontFamily: "lexend-light",
                },
                placeholderText: {
                  fontFamily: "lexend-light",
                  color: "#888888",
                },
              }}
              // onDateChange={(date) => setAddPetBirthdate(date)}
              useNativeDriver
            />
          </View>
        </View>

        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label}>
            <Image
              source={require("../assets/icons/gender.png")}
              style={styles.icon}
            ></Image>
            <View style={styles.radioButtonsContainer}>
              <View style={styles.radioButton}>
                <RadioButton
                  value="female"
                  status={gender === "female" ? "checked" : "unchecked"}
                  onPress={() => handleGenderChange("female")}
                />
                <Text>Nữ</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton
                  value="male"
                  status={gender === "male" ? "checked" : "unchecked"}
                  onPress={() => handleGenderChange("male")}
                />
                <Text>Nam</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton
                  value="other"
                  status={gender === "other" ? "checked" : "unchecked"}
                  onPress={() => handleGenderChange("other")}
                />
                <Text>Khác</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.signup_input_button}>
          <View style={styles.login_area_text_label}>
            <CheckBox checked={checked} onPress={() => setChecked(!checked)} />

            <View style={styles.login_area_text_label_signup_policy}>
              <Text style={styles.font}> Đồng ý với </Text>
              <TouchableOpacity>
                <Text style={styles.opt}>chính sách của Brili</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("HomeTabs")}
          >
            <Text style={styles.opt_login}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signup_input}>
          <View style={styles.login_area_text_label_signup}>
            <Text style={styles.font}> Đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.opt}> Đăng nhập ngay</Text>
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
    width: width,
    height: height,
    resizeMode: "contain",
    position: "absolute",
    top: -height * 0.3,
  },

  signup_area: {
    // top: -height * 0.06,
    top: 340,
    // paddingRight: width * 0.03,
    // paddingLeft: width * 0.17,
    width: "100%",
    position: "absolute",
    // backgroundColor : "#ffff",
  },

  signup_input: {
    paddingRight: width * 0.13,
    paddingBottom: 20,
    //  left: 20,
    paddingLeft: 40,
    // backgroundColor : "#ffff",
  },

  signup_input_button: {
    paddingRight: width * 0.13,
    paddingBottom: 20,
    //  left: 20,
    paddingLeft: 40,
    // backgroundColor : "#ffff",
    alignItems: "center",
    justifyContent: "center",
  },

  radioButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 50,
  },

  login_area: {
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#FCAC9E",
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
    zIndex: 2,
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
    zIndex: 2,
  },

  login_area_text: {
    left: width * 0.1,
    paddingRight: width * 0.2,
    top: height * 0.12,
    width: "100%",
  },

  login_area_text_label: {
    flexDirection: "row",
    // paddingLeft: width * 0.1,
  },

  login_area_text_label_lock: {
    flexDirection: "row",
    paddingRight: width * 0.06,
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
    right: 10,
  },

  login_area_text_input: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    paddingLeft: 10,
    width: "100%",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: "light",
    fontFamily: "lexend-light",
    color: "black",
    borderWidth: 1,
    backgroundColor: "#fff",
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
    //paddingTop: 5,
  },

  login_area_text_label_signup: {
    flexDirection: "row",
    // paddingLeft: -60,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  login_area_text_label_signup_policy: {
    flexDirection: "row",
    // paddingLeft: -60,
    left: -15,
    alignItems: "center",
    justifyContent: "center",
  },
});
