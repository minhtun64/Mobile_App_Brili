import { useRoute } from "@react-navigation/native";
import { TouchableOpacity, ScrollView, Text, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, View, Image, ImageBackground } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import { Calendar } from "react-native-calendars";
import React, { Component, useCallback, useEffect, useState, useContext } from "react";
import { database } from "../../firebase";
import { onValue, ref, remove } from "firebase/database";
import moment from "moment";
import PopupModal from "../../components/PopupModal";

import { UserContext } from "../../UserIdContext";
const NOTEBOOK = "NOTEBOOK";
const HANDBOOK = "HANDBOOK";
export default function H_DetailNote({ navigation }) {
    //Ví dụ userid
    const [gender, setstatebtn] = useState(NOTEBOOK);
    const [showCalendar, setShowCalendar] = useState(false);
    const [value, setValue] = useState();
    const [value2, setValue2] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [currentDate, setCurrentDate] = useState();
    const [currentDateDay, setCurrentDateDay] = useState();

    //pop up thông báo
    const [modalVisible, setModalVisible] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupprimaryButtonText, setPopupprimaryButtonText] = useState("");
    const openModal = (type, title, message, popupprimaryButtonText) => {
        setPopupType(type);
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupprimaryButtonText(popupprimaryButtonText);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    const handlePressOutsidePopup = useCallback(() => {
        setShowCalendar(false);
    }, []);

    const [selectedTime, setSelectedTime] = useState();
    const [petImages, setPetImages] = useState([]);
    // NoteId được chọn từ màn hình trước
    const route = useRoute();
    const [noteId, setNoteId] = useState(route?.params?.noteID);
    const userID = useContext(UserContext).userId;

    const [noteData, setNoteData] = useState(null);
    const getNoteData = async () => {
        if (noteId != null) {
            const noteDataRef = ref(database, `note/${userID}/${noteId}`);
            onValue(noteDataRef, (snapshot) => {
                if (snapshot.exists()) {
                    const noteData = snapshot.val();
                    //Lấy các pet được chọn
                    const petSelectedRef = ref(database, `note/${userID}/${noteId}/pet`);
                    onValue(petSelectedRef, (snapshot) => {
                        const petselectedData = snapshot.val();
                        if (petselectedData) {
                            // Kiểm tra petselectedData không phải là null
                            const petKeys = Object.keys(petselectedData);

                            //lấy các pet user
                            const petImagesRef = ref(database, `pet/${userID}`);
                            onValue(petImagesRef, (snapshot) => {
                                const petImagesData = snapshot.val();
                                if (petImagesData) {
                                    // Kiểm tra petImagesData không phải là null
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
                    //Lấy dữ liệu từ firebase và set giá trị cho các biến để có thể xem thông tin
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

    //Xử lý nếu chọn tiếp tục thì sẽ xóa
    const handleContinue = () => {
        try {
            const noteDataRef = ref(database, `note/${userID}/${noteId}`);
            if (noteDataRef) {
                remove(noteDataRef);
                console.log(noteId);
                navigation.navigate("H_Note");
            }
        } catch (error) {
            console.error("Lỗi khi tiếp tục sau khi xóa note:", error);
        }
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
                            <Text style={styles.textCalendar}>
                                {" "}
                                {currentDateDay},{currentDate}
                            </Text>
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
                                        <Text style={styles.descriptionTask}>{value2}</Text>
                                    </View>
                                </View>
                                <View style={styles.containerComponent}>
                                    <View style={styles.title}>
                                        <Text style={styles.titleTask}>Mô tả chi tiết</Text>
                                    </View>
                                    <View style={[styles.description, { minHeight: 100, justifyContent: "flex-start" }]}>
                                        <Text style={styles.descriptionTask}>{value}</Text>
                                    </View>
                                </View>

                                <View style={styles.containerTimeDetail}>
                                    <View style={styles.containerComponent}>
                                        <View style={styles.title}>
                                            <Text style={styles.titleTask}>Ngày</Text>
                                        </View>
                                        <View style={[styles.description, styles.btnIcon]}>
                                            <TouchableOpacity>
                                                <Image style={styles.iconCalendar} source={require("../../assets/icons/calendar-search.png")}></Image>
                                            </TouchableOpacity>

                                            <Text style={styles.descriptionTask}>{currentDate}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.containerComponent, styles.icontime]}>
                                        <View style={styles.title}>
                                            <Text style={styles.titleTask}>Giờ</Text>
                                        </View>
                                        <View style={[styles.description, styles.btnIcon]}>
                                            <TouchableOpacity>
                                                <Image style={styles.iconCalendar} source={require("../../assets/icons/clock.png")}></Image>
                                            </TouchableOpacity>
                                            <Text style={[styles.descriptionTask, styles.icontime]}>{selectedTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.containerListAvt}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {petImages
                                        .filter((petImage) => petImage.isChecked) // Lọc chỉ những petImage có isChecked = true
                                        .map((petImage) => (
                                            <View style={styles.containerAvt} key={petImage.petId}>
                                                <Image style={styles.avatar} source={{ uri: petImage.avatar }} />
                                            </View>
                                        ))}
                                </ScrollView>
                            </View>
                            <View style={styles.containerBtn}>
                                <TouchableOpacity style={styles.btnDelete} onPress={handleContinue}>
                                    <Text style={styles.textDelete}>Xóa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnUpdate} onPress={() => navigation.navigate("H_UpdateNote", { noteID: noteId })}>
                                    <Text style={styles.textUpdate}>Cập nhật</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </ImageBackground>
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
        // backgroundColor: "rgba(217, 217, 217, 0.5)",
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
        marginLeft: -25,
    },
    btnIcon: {
        flexDirection: "row",
        // justifyContent: "space-evenly",
        alignItems: "center",
        minWidth: 80,
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
    titleTask: {
        fontFamily: "lexend-medium",
        color: "background: rgba(165, 26, 41, 1)",
        fontSize: 16,
    },
    icontime: {
        marginRight: 20,
    },
});
