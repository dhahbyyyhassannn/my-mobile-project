import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CameraSettingsButton({name, size, color, onPress, text}) {
  return (
    <View style={styles.view}>
        <TouchableOpacity onPress={onPress}>
            <Ionicons name={name} size={size} color={color} />
        </TouchableOpacity>
        <Text style={styles.text}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create ({
    view:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 10,
    }
})
