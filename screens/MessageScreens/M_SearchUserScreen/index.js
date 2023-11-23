import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextInput,
} from "react-native";

function M_SearchUserScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.backIcon}
            source={require("../../../assets/icons/back.png")}
          ></Image>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#8C8C8C"
            // autoCapitalize="none"
            returnKeyType="search"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
            }}
            autoFocus={true}
          ></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: "6%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(252, 172, 158, 0.5)",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    marginHorizontal: "2%",
  },
  backIcon: {
    width: 36,
    height: 30,
  },
  searchBox: {
    width: "100%",
    paddingVertical: "3%",
    paddingRight: 16,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "lexend-regular",
  },
});

export default M_SearchUserScreen;
