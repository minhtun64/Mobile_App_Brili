import { TouchableOpacity, Text, StyleSheet, View, Image, ScrollView } from "react-native";
import moment from "moment";
import { useEffect, useState, React, useContext } from "react";
import { database } from "../../firebase";
import { formatDate } from "../../components/utils";
import { onValue, ref, get, set, push, off, update } from "firebase/database";
import { UserContext } from "../../UserIdContext";
export default function N_ListScreen({ navigation }) {
    const [userID, setUserID] = useState(useContext(UserContext).userId);
    const [sortedNotis, setSortedNotis] = useState();
    const [finalNotis, setFinalNotis] = useState();
    const [userNames, setUserNames] = useState(null);

    const getNotificationsByReceiver = async (receiver) => {
        const notiRef = ref(database, "notification");
        onValue(notiRef, (snapshot) => {
            const notisData = snapshot.val();
            if (notisData) {
                const notis = Object.entries(notisData)
                    .map(([notiID, noti]) => {
                        if (noti.receiver == receiver) {
                            return { notiID, ...noti };
                        }
                    })
                    .filter((noti) => noti); // Lọc bỏ các giá trị undefined

                const sortedNotis = notis.sort((a, b) => {
                    const dateA = moment(a.datetime, "DD-MM-YYYY HH:mm:ss");
                    const dateB = moment(b.datetime, "DD-MM-YYYY HH:mm:ss");
                    return dateB - dateA;
                });

                setSortedNotis(sortedNotis);
                // console.log(sortedNotis);
                const listUser = [...new Set(sortedNotis.map((noti) => noti.sender))];
                console.log(listUser);
                if (listUser.length > 0) {
                    const userRef = ref(database, `user`);
                    onValue(userRef, (snapshot) => {
                        const userData = snapshot.val();
                        // console.log(userData);
                        if (userData) {
                            const names = {};
                            listUser.forEach((sender) => {
                                // console.log(userData[sender]);
                                const name = userData[sender]?.name;
                                const avatar = userData[sender]?.avatar;
                                if (name && avatar) {
                                    names[sender] = { name, avatar };
                                }
                            });
                            // console.log(names);
                            setUserNames(names);
                        }
                    });
                }
            }
        });
    };

    const updateNotificationSeen = (notiId) => {
        const notiRef = ref(database, `notification/${notiId}/seen`);
        const newdata = 1;
        if (set(notiRef, newdata)) {
            return 1;
        }
    };

    useEffect(() => {
        if (userNames) {
            const updatedSortedNotis = sortedNotis.map((noti) => {
                const sender = noti.sender.toString();
                if (userNames.hasOwnProperty(sender)) {
                    return {
                        ...noti,
                        name: userNames[sender].name,
                        avatar: userNames[sender].avatar,
                    };
                }
                return noti;
            });
            setFinalNotis(updatedSortedNotis);
        }
    }, [userNames, sortedNotis]);

    // Gọi hàm getNotificationsByReceiver khi component được render
    useEffect(() => {
        getNotificationsByReceiver(userID);
    }, []);

    return (
        <View style={styles.containerAll}>
            <View style={styles.containerHeader}>
                <Text style={styles.textHeader}>Thông báo</Text>
            </View>
            <View style={styles.containerList}>
                <ScrollView contentContainerStyle={styles.containerListTask}>
                    {finalNotis &&
                        finalNotis.map((noti, index) => {
                            const { type, name, datetime, seen, avatar, notiID } = noti;

                            // Kiểm tra giá trị của trường `type` và `seen` để render giao diện tương ứng
                            switch (type) {
                                case "repcmt":
                                    return (
                                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("C_Home", { postid: noti.postid })} key={index}>
                                            <View style={[styles.containerItem, seen == 0 ? styles.seenColor : null]}>
                                                <View style={styles.containerAvt}>
                                                    <Image style={styles.avatar} source={{ uri: avatar }} />
                                                    <Image style={styles.checkbox} source={require("../../assets/icons/messages-3.png")} />
                                                </View>
                                                <View style={styles.containerContent}>
                                                    <View style={styles.containerDes}>
                                                        <Text>
                                                            <Text style={styles.textName}>{name}</Text>
                                                            <Text style={styles.textDes}>{} đã trả lời bình luận của bạn.</Text>
                                                        </Text>
                                                    </View>
                                                    <View style={styles.containerTime}>
                                                        <Text style={styles.textTime}>{formatDate(datetime)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );

                                case "follow":
                                    return (
                                        <TouchableOpacity style={styles.btn} key={index}>
                                            <View style={[styles.containerItem, seen == 0 ? styles.seenColor : null]}>
                                                <View style={styles.containerAvt}>
                                                    <Image style={styles.avatar} source={{ uri: avatar }} />
                                                    <Image style={styles.checkbox} source={require("../../assets/icons/profile-2user.png")} />
                                                </View>
                                                <View style={styles.containerContent}>
                                                    <View style={styles.containerDes}>
                                                        <Text>
                                                            <Text style={styles.textName}>{name}</Text>
                                                            <Text style={styles.textDes}>{} đã ấn theo dõi bạn.</Text>
                                                        </Text>
                                                    </View>
                                                    <View style={styles.containerTime}>
                                                        <Text style={styles.textTime}>{formatDate(datetime)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );

                                case "like":
                                    return (
                                        <TouchableOpacity style={styles.btn} onPress={() => updateNotificationSeen(notiID) && navigation.navigate("C_Home", { postid: noti.postid })} key={index}>
                                            <View style={[styles.containerItem, seen == 0 ? styles.seenColor : null]}>
                                                <View style={styles.containerAvt}>
                                                    <Image style={styles.avatar} source={{ uri: avatar }} />
                                                    <Image style={styles.checkbox} source={require("../../assets/icons/Like_Icon.png")} />
                                                </View>
                                                <View style={styles.containerContent}>
                                                    <View style={styles.containerDes}>
                                                        <Text>
                                                            <Text style={styles.textName}>{name}</Text>
                                                            <Text style={styles.textDes}>{} đã thích bài viết của bạn.</Text>
                                                        </Text>
                                                    </View>
                                                    <View style={styles.containerTime}>
                                                        <Text style={styles.textTime}>{formatDate(datetime)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                case "cmt":
                                    return (
                                        <TouchableOpacity style={styles.btn} onPress={() => updateNotificationSeen(notiID) && navigation.navigate("C_Home", { postid: noti.postid })} key={index}>
                                            <View style={[styles.containerItem, seen == 0 ? styles.seenColor : null]}>
                                                <View style={styles.containerAvt}>
                                                    <Image style={styles.avatar} source={{ uri: avatar }} />
                                                    <Image style={styles.checkbox} source={require("../../assets/icons/messages-3.png")} />
                                                </View>
                                                <View style={styles.containerContent}>
                                                    <View style={styles.containerDes}>
                                                        <Text>
                                                            <Text style={styles.textName}>{name}</Text>
                                                            <Text style={styles.textDes}>{} đã bình luận về bài viết của bạn.</Text>
                                                        </Text>
                                                    </View>
                                                    <View style={styles.containerTime}>
                                                        <Text style={styles.textTime}>{formatDate(datetime)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                default:
                                    return null;
                            }
                        })}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerAll: {
        height: "100%",
        width: "100%",
    },
    containerHeader: {
        height: "15%",
        paddingTop: "20%",
        backgroundColor: "#FDDAD4",
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    containerContent: {
        paddingLeft: 8,
    },
    containerList: {
        height: "100%",
        width: "100%",
        paddingRight: "4%",
        paddingLeft: "4%",
    },
    containerDes: {
        width: "87.5%",
    },
    // btn:{
    //   flexDirection:"row",
    //   backgroundColor:"#FFF6F6",
    //   marginTop:"2%",
    //   minHeight:"10.5%",
    //   alignItems:"center",
    //   borderRadius: 14,
    // },
    containerItem: {
        flexDirection: "row",
        backgroundColor: "rgba(244, 175, 174, 0.15)",
        marginTop: 6,
        minHeight: 88,
        alignItems: "center",
        borderRadius: 14,
    },
    textHeader: {
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
        width: 30,
        height: 30,
        borderColor: "#A51A29",
    },
    textName: {
        fontFamily: "lexend-medium",
        fontSize: 13,
        fontWeight: "bold",
    },
    textDes: {
        fontFamily: "lexend-regular",
        fontSize: 13,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.7)",
    },
    containerTime: {
        paddingTop: 4,
    },
    textTime: {
        fontFamily: "lexend-regular",
        fontSize: 13,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.4)",
    },
    seenColor: {
        backgroundColor: "rgba(244, 175, 174, 0.60)",
    },
    containerListTask: {
        paddingBottom: 200,
    },
});
