import {
  TouchableOpacity,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import * as Font from "expo-font";
import {LocaleConfig} from 'react-native-calendars';
import React, { Component , useCallback, useEffect, useState } from "react";
import { useSwipe } from "../../hooks/useSwipe";
import { Calendar } from 'react-native-calendars';
const NOTEBOOK = "NOTEBOOK";
const HANDBOOK = "HANDBOOK";
export default function H_NoteScreen({ navigation }) {
  const [gender, setstatebtn] = useState(NOTEBOOK);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    // Ẩn popup calendar sau khi chọn ngày
    setShowCalendar(false);
  };
  const handlePressOutsidePopup = useCallback(() => {
    setShowCalendar(false);
  }, []);
  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  function onSwipeLeft() {
    //navigation.goBack();
  }
  function onSwipeRight() {
    navigation.goBack();
  }

  const customTheme = {
    arrowColor: '#F5817E',
    selectedDayBackgroundColor: '#F5817E',
  
  };

  
  LocaleConfig.locales[LocaleConfig.defaultLocale].dayNamesShort = ['CN','T2','T3','T4','T5','T6','T7'];
  LocaleConfig.locales[LocaleConfig.defaultLocale].monthNames = ['Tháng 1,','Tháng 2,','Tháng 3,','Tháng 4,','Tháng 5,','Tháng 6,','Tháng 7,','Tháng 8,','Tháng 9,','Tháng 10,','Tháng 11,','Tháng 12,'];
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

  if (!fontLoaded) {
    return null; // or a loading spinner
  }
  return (
    <View style={styles.container} >
     
      <ImageBackground source={require('../../assets/imagesHealthScreen/imageBackground7.png')} style={styles.image}>     
        <View style={styles.toggleBtn}>
          <TouchableOpacity onPress={() => setstatebtn(NOTEBOOK)} style={[styles.OptionTab, gender == NOTEBOOK ? styles.GenderActive : null]}>
            <Text style={styles.TextOptionTab}>Sổ tay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setstatebtn(HANDBOOK)} style={[styles.noneOptionTab, gender == HANDBOOK ? styles.GenderActive : null]}>
            <Text style={styles.noneActive}>Cẩm Nang</Text>
          </TouchableOpacity>
          
        </View>
        <View style={styles.containerCalendar}>
          <View style={styles.displayCalendar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={styles.back}
                source={require("../../assets/icons/back.png")}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity >
              {/* <Image
                style={styles.arrowCalendarIcon}
                source={require("../../assets/icons/arrow-left.png")}
              ></Image> */}
            </TouchableOpacity>
            <TouchableOpacity >
              <Text style={styles.textCalendar}>
                Thứ tư 29/3/2023
              </Text>
            </TouchableOpacity>  
            
            <TouchableOpacity >
              {/* <Image
                style={styles.arrowCalendarIcon}
                source={require("../../assets/icons/arrow-right.png")}
              ></Image> */}
            </TouchableOpacity>
          
          </View>
          <View style={styles.lineCalendar}></View>
          <ScrollView style={styles.content}  showsVerticalScrollIndicator={false}  >
            <View style={styles.containerDetailTask}>
              <View style={styles.containerComponent}>
                <View style={styles.title}>
                    <Text style={styles.titleTask}>
                      Tên công việc
                    </Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptionTask}>
                    Tiêm ngừa dại
                    </Text>
                </View>
              </View>
              <View style={styles.containerComponent}>
                <View style={styles.title}>
                    <Text style={styles.titleTask}>
                      Mô tả chi tiết
                    </Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptionTask}>
                      Tiêm ngừa dại cho Mỹ Diệu ở phòng khám A cơ
                      sở 1. Đem theo giấy tiêm trước đó để bác sĩ ghi 
                      chú số liều và lịch tiêm cho đúng.
                    </Text>
                </View>
              </View>  

                <View style={styles.containerTimeDetail}>
                  <View style={styles.containerComponent}>
                    <View style={styles.title}>
                        <Text style={styles.titleTask}>
                          Ngày
                        </Text>
                    </View>
                    <View style={styles.description}>
                        <Text style={styles.descriptionTask}>
                          29/3/2022
                        </Text>
                    </View>
                  </View>
                  <View style={styles.containerComponent}>
                    <View style={styles.title}>
                        <Text style={styles.titleTask}>
                          Giờ
                        </Text>
                    </View>
                    <View style={styles.description}>
                        <Text style={styles.descriptionTask}>
                          10:30
                        </Text>
                    </View>
                  </View>  
                </View>
            </View>
            <View style={styles.containerListAvt}>
              <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
                <View style={styles.containerAvt}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/images/myavatar.png")}
                  ></Image>
                </View>
                <View style={styles.containerAvt}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/images/myavatar.png")}
                  ></Image>
                </View>
                <View style={styles.containerAvt}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/images/myavatar.png")}
                  ></Image>
                </View>
                {/* <View style={styles.containerAvt}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/images/myavatar.png")}
                  ></Image>
                </View>
                <View style={styles.containerAvt}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/images/myavatar.png")}
                  ></Image>
                </View> */}
              </ScrollView>
            </View>
            <View style={styles.containerBtn}>
              <TouchableOpacity style={styles.btnDelete}>
                <Text style={styles.textDelete}>
                  Xóa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnUpdate} onPress={() => navigation.navigate("H_UpdateNote")}>
                <Text style={styles.textUpdate}>
                  Chỉnh sửa
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>    
          

        </View> 
        
      </ImageBackground>  
     
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    alignItems: 'center',
  //  justifyContent: 'center',
  },
  back: {
    width: 34,
    height: 30,
    marginLeft: -30,
    marginTop: 8,
  },
  toggleBtn:{
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row' ,
  height: '6%',
  width: '80%',
  marginTop:'18%',
  paddingRight:'14%',
  paddingLeft:'14%',
  backgroundColor:'#ffffff',
  borderRadius: 20,
  },
  OptionTab:{
    borderRadius: 20,
    backgroundColor:'#FDDAD4',
    height:'100%',
    width: '80%',
    textAlign:"center",
    justifyContent:"center"
  },
  noneOptionTab:{
    borderRadius: 20,
    backgroundColor:'#ffffff',
    height:'100%',
    width: '80%',
    textAlign:"center",
    justifyContent:"center"
  },
  noneActive:{
    fontFamily: "lexend-medium",
    fontSize:18,
    fontWeight:'bold',
    color:'rgba(165, 26, 41, 0.3)',
    textAlign:"center"
  },
  TextOptionTab:{
    fontFamily: "lexend-medium",
    fontSize:18,
    fontWeight:'bold',
    color:'#A51A29',
    textAlign:"center"
  },
  containerCalendar:{
    backgroundColor:"#FFFFFF",
    width:'100%',
    height:'90%',
    marginTop: '10%',
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    alignItems:'center',
  },
  displayCalendar:{
    
    flexDirection: 'row' ,
    width:'80%',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems:'center',
    marginTop: '4%',
    
  },
  arrowCalendarIcon:{
    // width:30,
    // height:30,
    display:"none"
  },
  textCalendar:{
    fontFamily: "lexend-medium",
    fontSize:18,
    fontWeight:'bold',
    color:'#A51A29',
    marginRight:"12%"
  },
  lineCalendar:{
    backgroundColor:'#FCAC9E',
    height:1,
    width:'65%'
  },

  content:{
    width:'100%',
  },

  containerDetailTask:{
    width:'100%',

  },

  titleTask:{
    fontFamily: "lexend-medium",
    color:'background: rgba(165, 26, 41, 1)',
    fontSize:16,

  },
  descriptionTask:{
    fontFamily: "lexend-medium",
    fontSize:14,
  },
  title:{
    marginLeft:'12%',
    marginRight:'12%',
    marginTop:35
  },
  description:{
    marginLeft:'12%',
    marginRight:'12%',
    marginTop:10
  },
  containerTimeDetail:{
    flexDirection: 'row' ,
    marginLeft:'7%',
    marginRight:'10%',
  },

  containerBtn:{
    flexDirection: 'row' ,
    textAlign:"center",
    alignItems: "center",
    justifyContent:"space-evenly",
    width:"100%",
    marginTop:10
  },
  textDelete:{
    fontFamily: "lexend-medium",
    fontSize:16,
    fontWeight: "700",
    color:"rgba(165, 26, 41, 1)"
  },
  btnDelete:{
    borderWidth: 2,
    borderColor: 'rgba(165, 26, 41, 1)',
    borderStyle: 'solid',
    width:"35%",
    height:"50%",
    borderRadius:8,
    textAlign:"center",
    alignItems: "center",
    justifyContent:"center"
  },
  textUpdate:{
    fontFamily: "lexend-medium",
    fontSize:16,
    fontWeight: "700",
    color:"#ffffff",
  },
  btnUpdate:{

    backgroundColor: 'rgba(165, 26, 41, 1)',
    borderStyle: 'solid',
    width:"35%",
    height:"50%",
    borderRadius:8,
    textAlign:"center",
    alignItems: "center",
    justifyContent:"center"
  },
  avatar:{
    width: 60,
    height: 60,
  },
  containerAvt:{
    marginLeft:10,
    marginRight:10
  },
  containerListAvt:{
    marginTop:30,
    marginLeft:'12%',
    marginRight:'12%',
    textAlign:"center",
    alignItems: "center",
    justifyContent:"center"
  }

});