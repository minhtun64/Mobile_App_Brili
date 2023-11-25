import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

function PetCard(prop) {
  return (
    <TouchableOpacity
      style={[
        styles.petCard,
        styles.row,
        { backgroundColor: prop.backgroundColor },
      ]}
      onPress={prop.onPress}
    >
      <Image style={styles.petImg} source={{ uri: prop.avatar }}></Image>
      <Text style={[styles.petName, { color: prop.textColor }]}>
        {prop.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  petCard: {
    justifyContent: "space-between",
    backgroundColor: "#ddf7ec",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: "4%",
    marginRight: 16,
  },
  petImg: {
    width: 44,
    height: 44,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    resizeMode: "contain",
  },
  petName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "lexend-regular",
    alignSelf: "center",
    paddingHorizontal: 8,
  },
});

export default PetCard;
