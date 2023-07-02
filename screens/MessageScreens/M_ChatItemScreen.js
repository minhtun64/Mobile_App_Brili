import {
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { Fontisto } from '@expo/vector-icons';
import React, { useEffect, useState, useRef, useContext } from "react";
import { database } from "../../firebase";
import { ref, query, onValue, push } from "firebase/database";
import { UserContext } from "../../UserIdContext";
import Sender from "../../components/sender";
import Receiver from "../../components/receiver";

export default function M_ChatListScreen({ navigation, route }) {
  const { propId, propName, propAvatar } = route.params;
  const myUserIdStr = useContext(UserContext).userId;
  const myUserId = 3; // VÍ DỤ
  console.log(myUserIdStr)

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    navigation.getParent().setOptions({ tabBarStyle: { display: 'none' } });

    const reference = query(ref(database, '/message'))

    onValue(reference, (snapshot) => {
      const data = snapshot.val();
      const filteredMessages = Object.values(data).filter(
        (message) =>
          message.sender_id === myUserId && message.receiver_id === propId
          || message.sender_id === propId && message.receiver_id == myUserId
      );

      setMessages(Object.values(filteredMessages));
    });
  }, []);


  const messagesRef = ref(database, '/message');

  const sendText = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedTimestamp = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    const newRecord = {
      content: text,
      id: Math.floor(Math.random() * 1000000) + 1,
      media: '',
      receiver_id: propId,
      sender_id: myUserId,
      timestamp: formattedTimestamp,
    };

    push(messagesRef, newRecord)
      .then(() => {
        console.log('New record added successfully!');
      })
      .catch((error) => {
        console.log('Error adding new record:', error);
      });
    setText("")
  }

  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: messages.length - 1 });
    }
  }, [messages]);

  const getItemLayout = (_, index) => ({
    length: 60, // Set the height of your chat message item
    offset: 60 * index,
    index,
  });

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require("../../assets/icons/V_backIconMain.png")}
          ></Image>
        </TouchableOpacity>

        <Image style={styles.userImg} source={{ uri: propAvatar }}></Image>
        <Text style={styles.userName}>{propName}</Text>
      </View>

      <View style={{ flex: 1, paddingTop: 12, paddingBottom: 14 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            item.sender_id == myUserId
              ? <Sender message={[item.content, item.timestamp, propAvatar]} />
              : <Receiver message={[item.content, item.timestamp, propAvatar]} />
          )}
          getItemLayout={getItemLayout}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={{ height: 36, paddingLeft: 16, borderColor: '#ccc', borderWidth: 1, borderRadius: 20, flex: 5 }}
          onChangeText={text => setText(text)}
          value={text}
          placeholder="Nhắn tin"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
        </TextInput>
        <TouchableOpacity
          style={isInputFocused ? styles.btnMessageSend : styles.btnMessageUnSend}
          onPress={sendText}
        >
          <Fontisto
            name="paper-plane"
            size={18}
            color={isInputFocused ? "white" : "#A51A29"}
          />
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    width: '100%',
    paddingTop: '10%',
    paddingBottom: '2%',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f9bebf'
  },
  backBtn: {
    resizeMode: 'contain',
    padding: 16,
    marginHorizontal: '2%',
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: '3%',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'lexend-medium',
    color: '#A51A29',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    borderTopWidth: 0.2,
    borderTopColor: '#333',
  },
  btnMessageSend: {
    backgroundColor: '#A51A29',
    paddingHorizontal: 9,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  btnMessageUnSend: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#A51A29',
    paddingHorizontal: 9,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  }
})