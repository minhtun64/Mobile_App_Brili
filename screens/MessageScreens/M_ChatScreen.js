// import React, {useState, useEffect, useCallback} from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import io from 'socket.io-client';

// export default function M_ChatScreen({ navigation }) {
//   const socket = io('https://25bd-2001-ee0-4f0c-b2b0-b00d-bff3-d7eb-4219.ngrok-free.app');
//   const [messages, setMessages] = useState([]);
//   // const [inputText, setInputText] = useState('');

//   // useEffect(() => {
//   //   socket.on('message', message => {
//   //     setMessages([...messages, message]);
//   //   });
//   // }, [messages]);

//   // const sendMessage = () => {
//   //   socket.emit('message', inputText);
//   //   setInputText('');
//   // };
//   useEffect(() => {
//     navigation.getParent().setOptions({ tabBarStyle: { display: 'none' } });
//   }, []);

//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: 'Hello developer',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//       },
//       {
//         _id: 2,
//         text: 'Hello world',
//         createdAt: new Date(),
//         user: {
//           _id: 1,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//       },
//     ]);
//   }, []);

//   const onSend = useCallback((messages = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, messages),
//     );
//   }, []);

//   const renderSend = (props) => {
//     return (
//       <Send {...props}>
//         <View>
//           <MaterialCommunityIcons
//             name="send-circle"
//             style={{marginBottom: 5, marginRight: 5}}
//             size={32}
//             color="#2e64e5"
//           />
//         </View>
//       </Send>
//     );
//   };

//   const renderBubble = (props) => {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: '#2e64e5',
//           },
//         }}
//         textStyle={{
//           right: {
//             color: '#fff',
//           },
//         }}
//       />
//     );
//   };

//   const scrollToBottomComponent = () => {
//     return(
//       <FontAwesome name='angle-double-down' size={22} color='#333' />
//     );
//   }

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(messages) => onSend(messages)}
//       user={{
//         _id: 1,
//       }}
//       renderBubble={renderBubble}
//       alwaysShowSend
//       renderSend={renderSend}
//       scrollToBottom
//       scrollToBottomComponent={scrollToBottomComponent}
//     />
//   );
// }


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
// import io from 'socket.io-client';

// const SOCKET_SERVER_URL = 'https://c4c3-2001-ee0-4f0c-b2b0-b00d-bff3-d7eb-4219.ngrok-free.app';

const M_ChatScreen = () => {
//   const [message, setMessage] = useState('');
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Connect to the Socket.IO server when component mounts
//     const socket = io(SOCKET_SERVER_URL);
//     setSocket(socket);

//     // Disconnect from the Socket.IO server when component unmounts
//     return () => {
//       socket.disconnect();
//       setSocket(null);
//     };
//   }, []);

//   const handleChangeText = (text) => {
//     setMessage(text);
//   };

//   const handlePress = () => {
//     if (socket) {
//       socket.emit('message', message);
//       setMessage('');
//     }
//   };

  return (
    <View>
      <Text>Welcome to my app!</Text>
      {/* <TextInput value={message} onChangeText={handleChangeText} />
      <Button title="Send Message" onPress={handlePress} /> */}
    </View>
  );
};

export default M_ChatScreen;