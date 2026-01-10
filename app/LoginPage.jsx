import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
        <View style={styles.container}>
            <Text style={styles.title}>connecter vous</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={utilisateur}
                onChangeText={setUtilisateur}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry={true}
                value={motDePasse}
                onChangeText={setMotDePasse}
            />
            <Button title="Se connecter" onPress={handleLogin} />            
        </View>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
});