import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import BarStatus from './BarStatus';

export default function HeaderPage({ titre }) {
    const navigation = useNavigation();
    const currentTopPadding = Platform.OS === 'android' ? StatusBar.currentHeight : 0; 
    return (
        <>
            <View>
                <BarStatus />
                <View style={ [styles.header, {paddingTop: currentTopPadding}] }>
                    <AntDesign name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />
                    <Text style={styles.text}>{titre}</Text>
                    <AntDesign />
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#182B32',
        height: 70,
        width: '100%',
        padding: 5,
    },
    text: {
        color: '#F6F6F6',
        fontSize: 18,
    },
})