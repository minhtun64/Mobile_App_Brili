import { View, Text, StyleSheet } from "react-native"

const Sender = (props) => {
    const content = props.message[0];
    let timestamp = props.message[1];

    const time = new Date(timestamp);
    timestamp = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    return (
        <View style={styles.container}>
            <View style={styles.textView}>
                <Text style={{color: '#fff', fontSize: 14}}>{content}</Text>
                <Text style={{alignSelf: 'flex-end', fontSize: 12, color: '#fff'}}>{timestamp}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        width: '100%',
        marginTop: 4,
    },
    textView: {
        backgroundColor: '#f9bebf',
        justifyContent: 'center',
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        paddingHorizontal: '3%',
        paddingVertical: '1%',
        marginRight: '3%',
        alignItems: 'flex-start',
    }
})

export default Sender;