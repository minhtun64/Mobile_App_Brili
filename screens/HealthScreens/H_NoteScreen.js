import { TouchableOpacity, Button, ScrollView, Text, StyleSheet, TouchableWithoutFeedback, View, Image, ImageBackground, TextInput } from "react-native";
import * as Font from "expo-font";
import { LocaleConfig } from "react-native-calendars";
import React, { Component, useCallback, useEffect, useState } from "react";
import { database } from "../../firebase";
import { onValue, ref, get, set, push, off } from "firebase/database";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import "moment/locale/vi";
const NOTEBOOK = "NOTEBOOK";
const HANDBOOK = "HANDBOOK";
moment.locale("vi");
export default function H_NoteScreen({ navigation }) {
    const [gender, setstatebtn] = useState(NOTEBOOK);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [showCalendar, setShowCalendar] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDate, setCurrentDate] = useState(moment().format("dddd DD/MM/YYYY"));

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);  
        setCurrentDate(moment(day.dateString).format("dddd DD/MM/YYYY"));
        setShowCalendar(false);
    };
    const handlePressOutsidePopup = useCallback(() => {
        setShowCalendar(false);
    }, []);
    const handleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handlePrevDay = () => {
        const newDate = moment(currentDate, "dddd, DD/MM/YYYY").subtract(1, "days").format("dddd, DD/MM/YYYY");
        const newDate2 = moment(currentDate, "dddd, DD/MM/YYYY").subtract(1, "days").format("YYYY-MM-DD");
        setSelectedDate(newDate2)
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = moment(currentDate, "dddd, DD/MM/YYYY").add(1, "days").format("dddd, DD/MM/YYYY");
        const newDate2 = moment(currentDate, "dddd, DD/MM/YYYY").add(1, "days").format("YYYY-MM-DD");
        setSelectedDate(newDate2)
        setCurrentDate(newDate);
    };
    const customTheme = {
        arrowColor: "#F5817E",
        selectedDayBackgroundColor: "#F5817E",
    };

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const userID = 1;
        const notesRef = ref(database, `note/${userID}`);
        onValue(notesRef, (snapshot) => {
            const notesData = snapshot.val();
            if (notesData !== null) {
                const filteredNotes = Object.entries(notesData).map(([noteID, note]) => {
                  // Gán ID cho mỗi ghi chú
                  note.noteID = noteID;
                  return note;
                }).filter((note) => moment(note.date, "DD-MM-YYYY").isSame(selectedDate, "day"));
                setNotes(filteredNotes);
              } else {
                setNotes([]); // Không có ghi chú, đặt mảng rỗng cho setNotes
              }
            console.log(notes);
        });

        return () => {
            // Unsubscribe from the notesRef when the component unmounts
            off(notesRef);
        };
    }, [selectedDate]);
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
        <View style={styles.container}>
            <ImageBackground source={require("../../assets/imagesHealthScreen/imageBackground7.png")} style={styles.image}>
                <View style={styles.toggleBtn}>
                    <TouchableOpacity onPress={() => setstatebtn(NOTEBOOK)} style={[styles.OptionTab, gender == NOTEBOOK ? styles.GenderActive : null]}>
                        <Text style={styles.TextOptionTab}>Sổ tay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("H_HandBook")} style={styles.noneOptionTab}>
                        <Text style={styles.noneActive}>Cẩm Nang</Text>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={handlePressOutsidePopup}>
                    <View style={[styles.overlay, showCalendar == true ? styles.showPopUp : null]}></View>
                </TouchableWithoutFeedback>
                <View style={styles.containerCalendar}>
                    <View style={styles.displayCalendar}>
                        <TouchableOpacity onPress={handlePrevDay}>
                            <Image style={styles.arrowCalendarIcon} source={require("../../assets/icons/arrow-left.png")}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShowCalendar}>
                            <Text style={styles.textCalendar}>{currentDate}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextDay}>
                            <Image style={styles.arrowCalendarIcon} source={require("../../assets/icons/arrow-right.png")}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lineCalendar}></View>
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerListTask}>
                        {notes.map((note) => (
                          
                            <TouchableOpacity key={note.noteID}  onPress={() => navigation.navigate("H_DetailNote",{ noteID: note.noteID})}>
                                <View style={styles.taskItem}>
                                    <View style={styles.containertaskTitle}>
                                        <Text style={styles.taskTitle}>{note.title}</Text>
                                    </View>
                                    <View style={styles.containertaskTime}>
                                        <Text style={styles.taskTime}>{note.time}</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => navigation.navigate("H_UpdateNote",{ noteID: note.noteID})}>
                                        <Image style={styles.taskEditIcon} source={require("../../assets/icons/editIcon.png")} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.containerAddBtn} onPress={() => navigation.navigate("H_AddNote")}>
                        <Image style={styles.addButton} source={require("../../assets/icons/addNewHandBook.png")}></Image>
                    </TouchableOpacity>
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
    image: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        alignItems: "center",
        //  justifyContent: 'center',
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
        height: "90%",
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
        width: 30,
        height: 30,
    },
    textCalendar: {
        fontFamily: "lexend-medium",
        fontSize: 18,
        fontWeight: "bold",
        color: "#A51A29",
    },
    lineCalendar: {
        backgroundColor: "#FCAC9E",
        height: 1,
        width: "65%",
    },
    containerListTask: {
        width: "100%",
        marginBottom: "50%",
        alignItems: "center",
    },
    taskItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "88%",
        backgroundColor: "rgba(255, 225, 239, 0.7)",
        height: 66,
        borderRadius: 16,
        marginTop: 20,
    },
    taskTitle: {
        fontFamily: "lexend-medium",
        fontSize: 16,
        fontWeight: "400",
    },
    taskTime: {
        fontFamily: "lexend-medium",
        fontSize: 16,
        fontWeight: "400",
        color: "rgba(0, 0, 0, 0.3)",
    },
    containertaskTime: {
        width: "20%",
    },
    containertaskTitle: {
        width: "45%",
    },
    taskEditIcon: {
        width: 30,
        height: 30,
    },
    content: {
        height: 30,
    },
    containerAddBtn: {
        width: 50,
        height: 50,
        marginBottom: 200,
        position: "absolute",
        top: "70%",
        right: 10,
        zIndex: 10,
    },
    addButton: {
        width: 50,
        height: 50,
    },
    popUpCalendar: {
        backgroundColor: "white",
        position: "absolute",
        top: "20%",
        width: "90%",
        borderRadius: 8,
    },
    handlePressOutsidePopup: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1000,
    },
});
