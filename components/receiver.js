import { View, Text, StyleSheet, Image } from "react-native"

const Receiver = (props) => {
    const content = props.message[0];
    let timestamp = props.message[1];
    const userAvatar = props.message[2];

    const time = new Date(timestamp);
    timestamp = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <Image
                style={styles.userAvatar}
                source={{ uri: userAvatar }} />
            <View style={styles.textView}>
                <Text style={{alignSelf: 'flex-end'}}>{content}</Text>
                <Text style={{alignSelf: 'flex-start', fontSize: 11, color: '#666'}}>{timestamp}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 3,
    },
    textView: {
        backgroundColor: '#F3F3F3',
        justifyContent: 'center',
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: '3%',
        paddingVertical: '1%',
        marginLeft: '2%',
        alignItems: 'flex-end',
    },
    userAvatar: {
        width: 28,
        height: 28,
        borderRadius: 16,
        alignSelf: 'flex-end',
        marginLeft: '3%',
    }
})

export default Receiver;