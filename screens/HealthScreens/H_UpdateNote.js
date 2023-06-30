
import {
  useNavigation,
  useScrollToTop,
  useRoute,
} from "@react-navigation/native";



import { TouchableOpacity, ScrollView, Text, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, View, Image, ImageBackground, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import * as Font from "expo-font";
import { LocaleConfig } from "react-native-calendars";
import { Calendar } from "react-native-calendars";
import React, { Component, useCallback, useEffect, useState, useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { database } from "../../firebase";
import { onValue, ref, get, update, push, off,set } from "firebase/database";
import moment from "moment";

import PopupModal from '../../components/PopupModal';
const NOTEBOOK = "NOTEBOOK";
const HANDBOOK = "HANDBOOK";
export default function H_UpdateNote({ navigation }) {
    //Ví dụ userid
    const myUserId = "10"; 
    const userId = 1;
    const [gender, setstatebtn] = useState(NOTEBOOK);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [value, setValue] = useState();
    const [value2, setValue2] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [currentDate, setCurrentDate] = useState();
    const [currentDateDay, setCurrentDateDay] = useState();
    const [listNoteId, setListNoteId] = useState([])
    
    const [modalVisible, setModalVisible] = useState(false);
    const [popupType, setPopupType] = useState('');
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupprimaryButtonText, setPopupprimaryButtonText] = useState('');
    const openModal = (type, title, message, popupprimaryButtonText) => {
        setPopupType(type);
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupprimaryButtonText(popupprimaryButtonText)
        setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      navigation.navigate("H_Note");
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        // console.log(day.dateString)
        // Ẩn popup calendar sau khi chọn ngày
        setCurrentDate(moment(day.dateString).format("DD/MM/YYYY"))
        setCurrentDateDay(moment(day.dateString).format("dddd"))
        setShowCalendar(false);
        console.log(currentDate)
    };
    const handlePressOutsidePopup = useCallback(() => {
        setShowCalendar(false);
    }, []);
    const handleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    };
    const customTheme = {
        arrowColor: "#F5817E",
        selectedDayBackgroundColor: "#F5817E",
    };

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState();

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        setSelectedTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        hideTimePicker();
      };
    const [petImages, setPetImages] = useState([]);

    // useEffect(() => {
    //     const petImagesRef = ref(database, `pet/${userId}`);     
    //     onValue(petImagesRef, (snapshot) => {
    //         const petImagesData = snapshot.val();
    //         if (petImagesData) {
    //             const petImagesArray = Object.entries(petImagesData).map(([petId, petData]) => ({
    //                 petId: petId,
    //                 avatar: petData.avatar,
    //                 isChecked: false,
    //             }));
    //             setPetImages(petImagesArray);           
    //         }         
    //     }); 
    //     return () => {
    //         off(petImagesRef);
    //     };
    // }, [userId]);
  

    // PetImages(1);

    const handleCheck = (petId) => {
        const updatedPetImages = petImages.map((petImage) => (petImage.petId === petId ? { ...petImage, isChecked: !petImage.isChecked } : petImage));
        // console.log(updatedPetImages)
        setPetImages(updatedPetImages);
    };
  

   // Thêm một node mới
      const userID = 1;
      const route = useRoute();
      const noteId = route?.params?.noteID;
      
    //Lấy danh nội dung của note
    const [noteData, setNoteData] = useState(null);
  

    const getNoteData = async () => {
        if (noteId != null) {
          const noteDataRef = ref(database, `note/${userID}/${noteId}`);
          onValue(noteDataRef, (snapshot) => {
            if (snapshot.exists()) {
              const noteData = snapshot.val();
              // Lấy các pet được chọn
              const petSelectedRef = ref(database, `note/${userID}/${noteId}/pet`);
              onValue(petSelectedRef, (snapshot) => {
                const petselectedData = snapshot.val();
                if (petselectedData) { // Kiểm tra petselectedData không phải là null
                  const petKeys = Object.keys(petselectedData);
      
                  // Lấy các pet của người dùng
                  const petImagesRef = ref(database, `pet/${userID}`);
                  onValue(petImagesRef, (snapshot) => {
                    const petImagesData = snapshot.val();
                    if (petImagesData) { // Kiểm tra petImagesData không phải là null
                      const petImagesArray = Object.entries(petImagesData).map(([petId, petData]) => ({
                        petId: petId,
                        avatar: petData.avatar,
                        isChecked: false,
                      }));
                      petImagesArray.forEach((pet) => {
                        if (petKeys.includes(pet.petId)) {
                          pet.isChecked = true;
                        }
                      });
      
                      setPetImages(petImagesArray);
                    }
                  });
                }
              });
              // Lấy dữ liệu từ firebase và đặt giá trị cho các biến để có thể xem thông tin
              if (noteData) {
                setValue(noteData.description);
                setValue2(noteData.title);
                setCurrentDate(moment(noteData.date, "DD-MM-YYYY").format("DD/MM/YYYY"));
                setCurrentDateDay(moment(noteData.date, "DD-MM-YYYY").format("dddd"));
                setSelectedDate(moment(noteData.date, "DD-MM-YYYY").format("YYYY-MM-DD"));
                setSelectedTime(noteData.time);
              }
            }
          });
        }
      };

  const handleContinue =()=>{}
  const handleUpdateNote = () => {
    const noteDataRef = ref(database, `note/${userID}/${noteId}`);
    const newNoteData = petImages
        .filter(image => image.isChecked)
        .reduce((acc, image) => {
            acc.pet[image.petId] = "";
            return acc;
        }, {
            date: moment(currentDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
            description: value,
            pet: {},
            time: selectedTime,
            title: value2,
        });
        console.log(newNoteData)
        if(set(noteDataRef, newNoteData)){
            openModal('success', 'Thành công', 'Đây là thông báo thành công','Tiếp Tục')
        }
        console.log(selectedDate)
  };

    useEffect(() => {
      getNoteData();
    }, []);


    LocaleConfig.locales[LocaleConfig.defaultLocale].dayNamesShort = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    LocaleConfig.locales[LocaleConfig.defaultLocale].monthNames = [
        "Tháng 1,",
        "Tháng 2,",
        "Tháng 3,",
        "Tháng 4,",
        "Tháng 5,",
        "Tháng 6,",
        "Tháng 7,",
        "Tháng 8,",
        "Tháng 9,",
        "Tháng 10,",
        "Tháng 11,",
        "Tháng 12,",
    ];
    return (
        <View style={styles.container}>
             <PopupModal
                visible={modalVisible}
                type={popupType}
                title={popupTitle}
                message={popupMessage}
                onClose={closeModal}
                onPrimaryButtonPress={handleContinue}
                primaryButtonText={popupprimaryButtonText}
            />
            <ImageBackground source={require("../../assets/imagesHealthScreen/imageBackground7.png")} style={styles.image}>
                <View style={styles.toggleBtn}>
                    <TouchableOpacity onPress={() => setstatebtn(NOTEBOOK)} style={[styles.OptionTab, gender == NOTEBOOK ? styles.GenderActive : null]}>
                        <Text style={styles.TextOptionTab}>Sổ tay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setstatebtn(HANDBOOK)} style={[styles.noneOptionTab, gender == HANDBOOK ? styles.GenderActive : null]}>
                        <Text style={styles.noneActive}>Cẩm Nang</Text>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={handlePressOutsidePopup}>
                    <View style={[styles.overlay, showCalendar == true ? styles.showPopUp : null]}></View>
                </TouchableWithoutFeedback>
                <View style={styles.containerCalendar}>
                    <View style={styles.displayCalendar}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image style={styles.back} source={require("../../assets/icons/back.png")}></Image>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={styles.textCalendar}>  {currentDateDay} ,{currentDate}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.textCalendar2}></TouchableOpacity>
                    </View>
                    <View style={styles.lineCalendar}></View>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} enabled keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
                        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                            <View style={styles.containerDetailTask}>
                                <View style={styles.containerComponent}>
                                    <View style={styles.title}>
                                        <Text style={styles.titleTask}>Tên công việc</Text>
                                    </View>
                                    <View style={styles.description}>
                                        <TextInput
                                            placeholder="Nhập tên công việc . . ."
                                            style={styles.comment_textinput}
                                            value={value2}
                                            onChangeText={setValue2}
                                            multiline={true}
                                            scrollEnabled={true}
                                            caretHidden={false}
                                            autoFocus={true}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        ></TextInput>
                                    </View>
                                </View>
                                <View style={styles.containerComponent}>
                                    <View style={styles.title}>
                                        <Text style={styles.titleTask}>Mô tả chi tiết</Text>
                                    </View>
                                    <View style={[styles.description, { minHeight: 100, justifyContent: "flex-start" }]}>
                                        <TextInput
                                            placeholder="Nhập mô tả . . ."
                                            style={styles.comment_textinput}
                                            value={value}
                                            onChangeText={setValue}
                                            multiline={true}
                                            scrollEnabled={true}
                                            caretHidden={false}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        ></TextInput>
                                    </View>
                                </View>

                                <View style={styles.containerTimeDetail}>
                                    <View style={styles.containerComponent}>
                                        <View style={styles.title}>
                                            <Text style={styles.titleTask}>Ngày</Text>
                                        </View>
                                        <View style={[styles.description, styles.btnIcon]}>
                                            <TouchableOpacity onPress={handleShowCalendar}>
                                                <Image style={styles.iconCalendar} source={require("../../assets/icons/calendar-search.png")}></Image>
                                            </TouchableOpacity>

                                            <Text style={styles.descriptionTask}>{currentDate}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.containerComponent}>
                                        <View style={styles.title}>
                                            <Text style={styles.titleTask}>Giờ</Text>
                                        </View>
                                        <View style={[styles.description, styles.btnIcon]}>
                                            <TouchableOpacity onPress={showTimePicker}>
                                                <Image style={styles.iconCalendar} source={require("../../assets/icons/clock.png")}></Image>
                                            </TouchableOpacity>
                                            <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleTimeConfirm} onCancel={hideTimePicker} />
                                            {selectedTime ? <Text style={styles.descriptionTask}>{selectedTime}</Text> : null}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.containerListAvt}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {petImages.map((petImage) => (
                                        <View style={styles.containerAvt} key={petImage.petId}>
                                            <Image style={styles.avatar} source={{ uri: petImage.avatar }} />
                                            <Checkbox style={styles.checkbox} value={petImage.isChecked} onValueChange={() => handleCheck(petImage.petId)} />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.containerBtn}>
                                <TouchableOpacity style={styles.btnDelete} >
                                    <Text style={styles.textDelete}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnUpdate} onPress={handleUpdateNote}>
                                    <Text style={styles.textUpdate}>Cập nhật</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </ImageBackground>
            {showCalendar && (
                <View style={styles.popUpCalendar}>
                    <Calendar
                        style={{ borderRadius: 10 }}
                        onDayPress={handleDayPress}
                        current={moment(selectedDate, "YYYY-MM-DD").format("YYYY-MM-DD")}
                        hideExtraDays={true}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                disableTouchEvent: true,
                                selectedDotColor: "orange",
                            },
                        }}
                        theme={customTheme}
                        onDateChange={(date) => setSelectedDate(moment(date).format("YYYY-MM-DD"))}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        alignItems: "center",
        //  justifyContent: 'center',
    },
    back: {
        width: 34,
        height: 30,
        marginLeft: -30,
        marginTop: 8,
    },
    toggleBtn: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: "6%",
        width: "80%",
        marginTop: "18%",
        paddingRight: "14%",
        paddingLeft: "14%",
        backgroundColor: "#ffffff",
        borderRadius: 20,
    },
    OptionTab: {
        borderRadius: 20,
        backgroundColor: "#FDDAD4",
        height: "100%",
        width: "80%",
        textAlign: "center",
        justifyContent: "center",
    },
    noneOptionTab: {
        borderRadius: 20,
        backgroundColor: "#ffffff",
        height: "100%",
        width: "80%",
        textAlign: "center",
        justifyContent: "center",
    },
    noneActive: {
        fontFamily: "lexend-medium",
        fontSize: 18,
        fontWeight: "bold",
        color: "rgba(165, 26, 41, 0.3)",
        textAlign: "center",
    },
    TextOptionTab: {
        fontFamily: "lexend-medium",
        fontSize: 18,
        fontWeight: "bold",
        color: "#A51A29",
        textAlign: "center",
    },
    containerCalendar: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: "100%",
        marginTop: "10%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        alignItems: "center",
    },
    displayCalendar: {
        flexDirection: "row",
        width: "80%",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        marginTop: "4%",
    },
    arrowCalendarIcon: {
        // width:30,
        // height:30,
        display: "none",
    },
    textCalendar: {
        fontFamily: "lexend-medium",
        fontSize: 18,
        fontWeight: "bold",
        color: "#A51A29",
        marginRight: "12%",
        textAlign: "center",
    },
    lineCalendar: {
        backgroundColor: "#FCAC9E",
        height: 1,
        width: "65%",
    },

    content: {
        width: "100%",
    },

    containerDetailTask: {
        width: "100%",
    },

    titleTask: {
        fontFamily: "lexend-medium",
        color: "background: rgba(165, 26, 41, 1)",
        fontSize: 16,
    },
    descriptionTask: {
        fontFamily: "lexend-medium",
        fontSize: 14,
    },
    title: {
        marginLeft: "12%",
        marginRight: "12%",
        marginTop: 35,
    },
    description: {
        marginLeft: "12%",
        marginRight: "12%",
        marginTop: 10,
        backgroundColor: "rgba(217, 217, 217, 0.5)",
        borderRadius: 8,
        minHeight: 44,
        justifyContent: "center",
        paddingRight: 10,
        paddingLeft: 10,
    },
    containerTimeDetail: {
        flexDirection: "row",
        marginLeft: "7%",
        marginRight: "10%",
    },

    containerBtn: {
        flexDirection: "row",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
        marginTop: 10,
        marginBottom: "80%",
    },
    textDelete: {
        fontFamily: "lexend-medium",
        fontSize: 16,
        fontWeight: "700",
        color: "rgba(165, 26, 41, 1)",
    },
    btnDelete: {
        borderWidth: 2,
        borderColor: "rgba(165, 26, 41, 1)",
        borderStyle: "solid",
        width: "35%",
        height: "40%",
        borderRadius: 8,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    textUpdate: {
        fontFamily: "lexend-medium",
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },
    btnUpdate: {
        backgroundColor: "rgba(165, 26, 41, 1)",
        borderStyle: "solid",
        width: "35%",
        height: "40%",
        borderRadius: 8,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    containerAvt: {
        marginLeft: 10,
        marginRight: 10,
        position: "relative",
    },
    checkbox: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 18,
        height: 18,
        backgroundColor: "#ffffff",
        borderColor: "#A51A29",
    },
    containerListAvt: {
        marginTop: 30,
        marginLeft: "12%",
        marginRight: "12%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    comment_textinput: {
        //width: "72%",
        fontSize: 16,
        fontFamily: "lexend-regular",
        // backgroundColor: "black",
    },
    containerTextInput: {
        flex: 1,
        height: 100,
        backgroundColor: "rgba(217, 217, 217, 0.5)",
        borderRadius: 8,
    },
    iconCalendar: {
        width: 20,
        height: 20,
        marginLeft: -10,
    },
    btnIcon: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        minWidth: 90,
    },
    popUpCalendar: {
        backgroundColor: "white",
        position: "absolute",
        top: "20%",
        width: "90%",
        borderRadius: 8,
        zIndex: 1000000000000,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
        display: "none",
    },
    showPopUp: {
        display: "inline-block",
    },
});
