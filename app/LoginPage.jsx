import { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginInput from './components/Input/LoginInput';
import HeaderPage from './components/Layout/HeaderPage';

export default function LoginPage() {
    const navigation = useNavigation();
    const [utilisateur, setUtilisateur] = useState('');
    const [motDePasse, setMotDePasse] = useState('');

    const handleLogin = () => {
        if (utilisateur === 'admin' && motDePasse === 'password') {
            navigation.navigate('Home');
        } else {
            Alert.alert('Erreur', 'Nom d\'utilisateur ou mot de passe incorrect.');
        }
    }

    return (
        <>
            <HeaderPage titre={'login'} />
            <View style={styles.container}>
                <Text style={styles.title}>connecter vous</Text>
                <LoginInput placeholder={"nom d'utilisateur"} value={utilisateur} setValue={setUtilisateur} />
                <LoginInput placeholder={"Mot de passe"} value={motDePasse} setValue={setMotDePasse} secure={true} />
                <Button title="Se connecter" onPress={handleLogin} />
                <Image source={require('../assets/ScanAuraLogo.png')} style={styles.image} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 50,

    }
});