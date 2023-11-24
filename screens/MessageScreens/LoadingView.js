import { StyleSheet, View, Image } from "react-native";

function LoadingView() {
  return (
    <View style={styles.loadingView}>
      <Image
        source={require("../../assets/images/loading.png")}
        style={styles.loadingImg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBDCE2",
  },
  loadingImg: {
    width: "100%",
    aspectRatio: 1,
  },
});

export default LoadingView;
