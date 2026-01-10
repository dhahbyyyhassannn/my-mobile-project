import { Pressable, Text, StyleSheet } from "react-native";


export default function Detecter({ text, onPress }) {
    return (
        <Pressable style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>{text}</Text>
        </Pressable>
    );   
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#000000ff',
        borderRadius: 10,
        marginBottom: 30,
        width: 280,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});