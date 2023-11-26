import { Text, StyleSheet, View, Image } from "react-native";

export default function V_OriginScreen() {
  return (
    <View style={styles.listAppointment}>
      <View style={styles.heading}>
        <Text style={styles.title}>Danh sách lịch hẹn</Text>
      </View>
      <View style={styles.emptyList}>
        <Image
          style={styles.emptyImage}
          source={require("../../assets/icons/V_calendar.png")}
        ></Image>
        <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listAppointment: {
    width: "100%",
    height: "62%",
  },
  heading: {
    backgroundColor: "#E02D33",
    paddingHorizontal: 40,
    paddingVertical: 6,
    alignSelf: "center",
    borderRadius: 32,
    marginTop: 12,
  },
  title: {
    fontFamily: "lexend-bold",
    color: "#FFFFFF",
    fontSize: 18,
  },
  emptyList: {
    height: "68%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImage: {
    width: "44%",
    height: "44%",
    resizeMode: "contain",
  },
  emptyText: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "lexend-regular",
    marginTop: 4,
  },
});
