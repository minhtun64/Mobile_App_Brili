import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, {
  Component,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import * as Font from "expo-font";

import { useSwipe } from "../../hooks/useSwipe";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function C_SearchResultScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    //navigation.goBack();
  }

  function onSwipeRight() {
    navigation.goBack();
  }

  function AllScreen() {
    return (
      <View style={styles.tabContainer}>
        <Text>All Tab</Text>
      </View>
    );
  }

  function PostScreen() {
    return (
      <View style={styles.tabContainer}>
        <Text>Post Tab</Text>
      </View>
    );
  }

  function UserScreen() {
    return (
      <View style={styles.tabContainer}>
        <Text>User Tab</Text>
      </View>
    );
  }

  function ClinicScreen() {
    return (
      <View style={styles.tabContainer}>
        <Text>Clinic Tab</Text>
      </View>
    );
  }

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

  //Lưu ảnh

  const handleSearch = () => {
    // Handle search logic
  };

  const renderTabNavigator = () => {
    if (!searchInput) {
      return null;
    }

    return (
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 14,
            fontFamily: "lexend-regular",
          },
          activeTintColor: "#8F1928",
          inactiveTintColor: "#A5A5A5",
          indicatorStyle: {
            backgroundColor: "#8F1928",
          },
        }}
      >
        <Tab.Screen name="Tất cả" component={AllScreen} />
        <Tab.Screen name="Bài viết" component={PostScreen} />
        <Tab.Screen name="Người" component={UserScreen} />
        <Tab.Screen name="Phòng khám" component={ClinicScreen} />
      </Tab.Navigator>
    );
  };

  if (!fontLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container}>
      {/* heading */}
      <View style={styles.heading}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.back}
              source={require("../../assets/icons/chevron-left.png")}
            ></Image>
          </TouchableOpacity>
          <View style={styles.search_box}>
            <TextInput
              style={styles.search_input}
              placeholder="Tìm kiếm trên PetCare"
              placeholderTextColor="#ffffff"
              autoCapitalize="none"
              returnKeyType="search"
              value={searchInput}
              //   onChangeText={(text) => setSearchInput(text)}
              //   onSubmitEditing={handleSearch}
              onSubmitEditing={(text) => setSearchInput(text)}
            ></TextInput>
          </View>
        </View>
      </View>
      {renderTabNavigator()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "90%",
    backgroundColor: "#ffffff",
  },
  heading: {
    width: "100%",
    height: "14%",
    // backgroundColor: "red",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#FFF6F6",
  },
  content: {
    flex: 1,
    // backgroundColor: "red",
  },
  posting_content: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "black",
  },
  back: {
    width: 24,
    height: 24,
    marginLeft: 4,
    // marginTop: 4,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingLeft: 16,
    paddingRight: 16,
    position: "absolute",
    bottom: "10%",
    // backgroundColor: "white",
  },
  row2: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row3: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: "center",
  },
  avatar40: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginLeft: 16,
  },
  post: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "lexend-medium",
  },
  search_box: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FCAC9E",
    borderRadius: 12,
    width: "90%",
    justifyContent: "center", // căn giữa theo chiều dọc
    // alignItems: "center", // căn giữa theo chiều ngang
  },
  search_input: {
    fontSize: 16,
    fontFamily: "lexend-regular",
  },
  account_name: {
    fontSize: 16,
    color: "#8F1928",
    fontFamily: "lexend-semibold",
  },

  status_input: {
    fontSize: 18,
    padding: 16,
    marginTop: 8,
    fontFamily: "lexend-regular",
  },
});
