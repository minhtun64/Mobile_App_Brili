import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import FirstOwnerInfoScreen from "../screens/FirstOwnerInfoScreen";
import FirstPetInfoScreen from "../screens/FirstPetInfoScreen";
import C_HomeScreen from "../screens/CommunityScreens/C_HomeScreen";
import H_NoteScreen from "../screens/HealthScreens/H_NoteScreen";
import V_LocationScreen from "../screens/VeterinarianScreens/V_LocationScreen";
import M_ListScreen from "../screens/MessageScreens/M_ListScreen";
import N_ListScreen from "../screens/NotificationScreens/N_ListScreen";
import S_OptionScreen from "../screens/SettingScreens/S_OptionScreen";

const Stack = createStackNavigator();
function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="FirstOwnerInfo" component={FirstOwnerInfoScreen} />
      <Stack.Screen name="FirstPetInfo" component={FirstPetInfoScreen} />
      <Stack.Screen name="HomeTabs" component={MyTabs} />
    </Stack.Navigator>
  );
}

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator></StackNavigator>
    </NavigationContainer>
  );
};

const CommunityStack = createStackNavigator();
function CommunityStackNavigator() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="C_Home" component={C_HomeScreen} />
    </CommunityStack.Navigator>
  );
}

const HealthStack = createStackNavigator();
function HealthStackNavigator() {
  return (
    <HealthStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthStack.Screen name="H_Note" component={H_NoteScreen} />
    </HealthStack.Navigator>
  );
}

const VeterinarianStack = createStackNavigator();
function VeterinarianStackNavigator() {
  return (
    <VeterinarianStack.Navigator screenOptions={{ headerShown: false }}>
      <VeterinarianStack.Screen
        name="V_Location"
        component={V_LocationScreen}
      />
    </VeterinarianStack.Navigator>
  );
}

const MessageStack = createStackNavigator();
function MessageStackNavigator() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false }}>
      <MessageStack.Screen name="M_List" component={M_ListScreen} />
    </MessageStack.Navigator>
  );
}

const NotificationStack = createStackNavigator();
function NotificationStackNavigator() {
  return (
    <NotificationStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationStack.Screen name="N_List" component={N_ListScreen} />
    </NotificationStack.Navigator>
  );
}

const SettingStack = createStackNavigator();
function SettingStackNavigator() {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name="S_Option" component={S_OptionScreen} />
    </SettingStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarLabelStyle: [
        //   {
        //     fontSize: 12,
        //     marginBottom: 6,
        //   },
        // ],
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          {
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: "#ffffff",
            borderRadius: 0,
            height: Dimensions.get("window").height * 0.1,
            ...styles.shadow,
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{
          tabBarLabel: "Cộng đồng",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/community-active.png")}
                ></Image>
              )}
              {!focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/community-inactive.png")}
                ></Image>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="HealthStack"
        component={HealthStackNavigator}
        options={{
          tabBarLabel: "Sức khỏe",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/health-active.png")}
                ></Image>
              )}
              {!focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/health-inactive.png")}
                ></Image>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="VeterinarianStack"
        component={VeterinarianStackNavigator}
        options={{
          tabBarLabel: "Thú y",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/veterinarian-active.png")}
                ></Image>
              )}
              {!focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/veterinarian-inactive.png")}
                ></Image>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MessageStack"
        component={MessageStackNavigator}
        options={{
          tabBarLabel: "Tin nhắn",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/message-active.png")}
                ></Image>
              )}
              {!focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/message-inactive.png")}
                ></Image>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NotificationStack"
        component={NotificationStackNavigator}
        options={{
          tabBarLabel: "Thông báo",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/notification-active.png")}
                ></Image>
              )}
              {!focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/notification-inactive.png")}
                ></Image>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingStackNavigator}
        options={{
          tabBarLabel: "Cài đặt",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/setting-active.png")}
                ></Image>
              )}
              {!focused && (
                <Image
                  style={styles.tabIcon}
                  resizeMode="contain"
                  source={require("../assets/icons/setting-inactive.png")}
                ></Image>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainNavigator;

const styles = StyleSheet.create({
  tabIcon: {
    width: Dimensions.get("window").width * 0.08,
    height: Dimensions.get("window").height * 0.08,
  },
});