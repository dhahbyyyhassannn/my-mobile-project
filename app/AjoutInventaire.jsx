import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderPage from './components/Layout/HeaderPage'; 
import HomeButton from './components/Card/HomeButton';

export default function AjoutInventaire() {
    const navigation = useNavigation();
    return (    
        <>
            <HeaderPage titre={'ajouter un inventaire'} />
            <View style={styles.container}>
                <View style={styles.rows}>
                    <HomeButton icon={'camera'} text={'detecter avec la camera'} onPress={() => navigation.navigate('DetectCam')} />
                    <HomeButton icon={'barcode'} text={'detecter avec le laser'} onPress={() => navigation.navigate('Detecter')} />
                </View>
                <View>
                    <Image source={require('../assets/ScanAuraLogo.png')} style={styles.image}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rows: {
        flexDirection: 'row',
        gap: 20,
        padding: 10,
    },
    image: {
        marginTop: 20,
        width: 200,
        height: 200,
        borderRadius: 20,
    }
})
