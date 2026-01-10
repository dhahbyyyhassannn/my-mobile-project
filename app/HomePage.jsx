import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Detecter from './Detecter';
import ApiCallTest from './ApiCallTest';

export default function HomePage() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue!</Text>
            <Detecter text="detection avec le laser" onPress={() => navigation.navigate('DetectScan')}  />
            <Detecter text="detection avec la camera" onPress={()=> navigation.navigate('DetectCam')}/>
            <Detecter text="SYNC" onPress={() => navigation.navigate()} />
            <ApiCallTest />
            <Text style={styles.info}>Dernière sync: -</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        paddingBottom: 20,
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        marginTop: 20,
        marginBottom: 20,
        color: '#666',
    },
    btn: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        width: 240,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    btnHover: {
        backgroundColor: '#799abeff',
        color: '#000',
    }
});
