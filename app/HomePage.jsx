import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderPage from './components/Layout/HeaderPage';
import HomeButton from './components/Card/HomeButton';

export default function HomePage() {
    const navigation = useNavigation();
    const [date, setDate] = useState('-');
    const synch = () => {
        const now = new Date().toLocaleString('fr-FR');
        setDate(now);
    }

    return (
        <>
            <HeaderPage titre="ScanAura"/>
            <View style={ styles.container }>
                <View style={ { paddingBottom: 10 } }>
                    <HomeButton icon={'unordered-list'} text={'liste des actifs'} onPress={() => navigation.navigate('ListeDesActifs')} />
                </View>
                <View style={styles.rows}>
                    <HomeButton icon={'camera'} text={'detecter avec la camera'} onPress={() => navigation.navigate('DetectCam')} />
                    <HomeButton icon={'barcode'} text={'detecter avec le laser'} onPress={() => navigation.navigate('Detecter')} />
                </View>
                <View style={styles.rows}>
                    <HomeButton icon={'sync'} text={'sync'} onPress={synch} />
                    <HomeButton icon={'setting'} text={'configuration'} onPress={() => navigation.navigate('configuration')} />
                </View>
                <Text>Dérnier synchronisation: {date}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
  
    },
    rows: {
        flexDirection: 'row',
        gap: 5,
        padding: 10,
    }
});
