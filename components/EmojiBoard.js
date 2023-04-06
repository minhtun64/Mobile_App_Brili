import React from "react";
import { View, TextInput } from "react-native";
import EmojiBoard from "react-native-emoji-board";

const EmojiTextInput = ({ value, onChangeText }) => {
  const [showEmojiBoard, setShowEmojiBoard] = React.useState(false);

  const onEmojiSelected = (emoji) => {
    onChangeText(value + emoji);
  };

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setShowEmojiBoard(true)}
        onBlur={() => setShowEmojiBoard(false)}
      />
      {showEmojiBoard && <EmojiBoard onEmojiSelected={onEmojiSelected} />}
    </View>
  );
};

export default EmojiTextInput;
