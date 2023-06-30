import {
  TouchableOpacity,
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { Component } from "react";

export default function N_ListScreen({ navigation }) {
  return (
    <View style={styles.containerAll}>
      <View style={styles.containerHeader}>
        <Text style={styles.textHeader}> 
            Thông báo
        </Text>
      </View>
      <View style={styles.containerList}>
        <ScrollView contentContainerStyle={styles.containerListTask}>
          <View style={styles.containerItem}>
            <View style={styles.containerAvt}>
              <Image style={styles.avatar} source={require("../../assets/images/avatar-11.png")} />
              <Image style={styles.checkbox} source={require("../../assets/icons/messages-3.png")} />
              
            </View>
            <View style={styles.containerContent}>
                <View style={styles.containerDes}>
                  <Text>
                  Đỗ Quỳnh Chi vừa bình luận về bài viết mà bạn vừa đăng.
                  </Text>
                </View>
                <View style={styles.containerTime}>

                </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerAll:{
    height: '100%',
    width: '100%',
  },
  containerHeader: {
    height:"15%",
    paddingTop: '20%',
    backgroundColor:"#FDDAD4",
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30,
  },
  containerList:{
    height:"100%",
    width:"95%",
  },
  containerItem:{
    flexDirection:"row"
    
  },
  textHeader:{
    fontFamily: "lexend-medium",
    fontSize: 20,
    fontWeight: "bold",
    color: "#A51A29",
    textAlign: "center",
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 50,
  },
  containerAvt: {
      marginLeft: 10,
      marginRight: 10,
      position: "relative",
      width: 64,
      height: 64,
  },
  checkbox: {
    position: "absolute",
    bottom: -6,
    right: -14,
    width: 35,
    height: 35,
    borderColor: "#A51A29",
},
//   containerListTask: {
//     width: "100%",
//     // marginBottom: "50%",
// },
});
