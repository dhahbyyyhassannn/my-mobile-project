import { Pressable, Text, TouchableOpacity } from 'react-native';


export default function PersoButton({ text, onPress, style, textStyle }) {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    )
}