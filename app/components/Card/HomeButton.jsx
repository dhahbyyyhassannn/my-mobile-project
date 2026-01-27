import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeButton({ icon, text, onPress }) {
    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <AntDesign name={icon} size={30} color="#EAEFEF" />
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#25343F',
        width: 120,
        height: 120,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        paddingTop: 5,
        color: '#EAEFEF',
        textAlign: 'center',
    }
})