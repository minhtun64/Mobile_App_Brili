import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

function TimeCard(prop) {
  let enabledCard = prop.slot - prop.booked > 0;
  let backgroundColor = enabledCard ? prop.backgroundColor : "#DFDFDF";
  let textColor = enabledCard ? prop.textColor : "#FFFFFF";

  return (
    <View>
      <TouchableOpacity
        style={[styles.timeCard, { backgroundColor }]}
        onPress={prop.onPress}
        disabled={!enabledCard}
      >
        <Text style={[styles.hours, { color: textColor }]}>
          {prop.startTime + " - " + prop.endTime}
        </Text>
      </TouchableOpacity>
      {enabledCard && (
        <View style={[styles.labelBooking, styles.row]}>
          <View style={styles.row}>
            <Text style={styles.textSlotBooking}>Trống: </Text>
            <Text style={[styles.textSlotBooking, styles.slotBooking]}>
              {prop.slot - prop.booked}
            </Text>
          </View>
          <View style={styles.imgSlotBooking}>
            <Image
              source={require("../../../assets/icons/slot-booking.png")}
              style={styles.img}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  timeCard: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f9bebf",
    borderRadius: 20,
    marginRight: 16,
  },
  hours: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  labelBooking: {
    marginRight: "6%",
    alignSelf: "center",
  },
  textSlotBooking: {
    fontSize: 12,
    fontFamily: "lexend-light",
  },
  slotBooking: {
    fontFamily: "lexend-regular",
  },
  imgSlotBooking: {
    paddingLeft: "2%",
    paddingRight: "3%",
  },
  img: {
    width: 20,
    height: 20,
  },
});

export default TimeCard;
