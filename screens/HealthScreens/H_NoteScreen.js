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
    TextInput,
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
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
            <TouchableOpacity onPress={() =>navigation.navigate("H_HandBook")} style={styles.noneOptionTab}>
              <Text style={styles.noneActive}>Cẩm Nang</Text>
            </TouchableOpacity>
            
          </View>
          <TouchableWithoutFeedback onPress={handlePressOutsidePopup}>
            <View style={[styles.overlay, showCalendar == true ? styles.showPopUp : null]} > 
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.containerCalendar}>
            <View style={styles.displayCalendar}>
              <TouchableOpacity >
                <Image
                  style={styles.arrowCalendarIcon}
                  source={require("../../assets/icons/arrow-left.png")}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShowCalendar}>
                <Text style={styles.textCalendar}>
                  Thứ tư 29/3/2023
                </Text>
              </TouchableOpacity>  
              
              <TouchableOpacity >
                <Image
                  style={styles.arrowCalendarIcon}
                  source={require("../../assets/icons/arrow-right.png")}
                ></Image>
              </TouchableOpacity>
            
            </View>
            <View style={styles.lineCalendar}></View>
            <ScrollView style={styles.content}  showsVerticalScrollIndicator={false}  contentContainerStyle={styles.containerListTask}>
              <View style = {styles.containerListTask}>
                <TouchableOpacity onPress={() => navigation.navigate("H_DetailNote")}>
                <View style = {styles.taskItem} >
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("H_UpdateNote")}>
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                </TouchableOpacity>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style = {styles.taskItem}>
                  <Text style={styles.taskTitle}>
                    Tiêm ngừa dại
                  </Text>
                  <Text style={styles.taskTime}>
                    10:30
                  </Text>
                  <TouchableOpacity >
                    <Image
                      style={styles.taskEditIcon}
                      source={require("../../assets/icons/editIcon.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>    
            <TouchableOpacity style={styles.containerAddBtn} onPress={() => navigation.navigate("H_AddNote")}>
              <Image
                style={styles.addButton}
                source={require("../../assets/icons/addNewHandBook.png")}
              ></Image>
            </TouchableOpacity>  
  
          </View> 
          
        </ImageBackground>  
       
        {showCalendar && (
            <View style={styles.popUpCalendar}>
                <Calendar style={{ borderRadius: 10 }}
                  onDayPress={handleDayPress}
                  current={selectedDate || undefined}
                  hideExtraDays={true}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: 'orange',
                    },
                  }}
                  theme={customTheme}
                  
                />
                </View> 
              )}
        
        {/* jkdashaskdhakdhasjkd */}

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
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1,
      display: 'none',
    },
    showPopUp:{
      display: 'inline-block',
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      width: '100%',
      alignItems: 'center',
    //  justifyContent: 'center',
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
      width:30,
      height:30,
    },
    textCalendar:{
      fontFamily: "lexend-medium",
      fontSize:18,
      fontWeight:'bold',
      color:'#A51A29'
    },
    lineCalendar:{
      backgroundColor:'#FCAC9E',
      height:1,
      width:'65%'
    },
    containerListTask:{
      width:'100%',
      marginBottom:"50%",
      alignItems:'center',
    }
    ,
    taskItem:{
      flexDirection: 'row' ,
      alignItems:'center',
      justifyContent:"space-evenly",
      width:'88%',
      backgroundColor:'rgba(255, 225, 239, 0.7)',
      height:66,
      borderRadius:16,
      marginTop: 20
    },
    taskTitle:{
      fontFamily: "lexend-medium",
      fontSize:16,
      fontWeight:'400',
      
    },
    taskTime:{
      fontFamily: "lexend-medium",
      fontSize:16,
      fontWeight:'400',
      color:'rgba(0, 0, 0, 0.3)'
    },
    taskEditIcon:{
      width:30,
      height:30,
    },
    content:{
      height:30,
    },
    containerAddBtn:{
      width:50,
      height:50,
      marginBottom:200,
      position: 'absolute',
      top:'70%',
      right:10,
      zIndex:10
    },
    addButton:{
      width:50,
      height:50,
    },
    popUpCalendar:{
      backgroundColor:"white",
      position: 'absolute',
      top:'20%',
      width:"90%",
      borderRadius:8,
    },
    handlePressOutsidePopup:{
      width:"100%" ,
      height:"100%" , 
      position: 'absolute',
      zIndex:1000
    }
  });