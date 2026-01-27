import { TextInput, StyleSheet } from 'react-native';

export default function LoginInput({ placeholder, value, setValue, secure }) {
    return (
        <TextInput style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            secureTextEntry={secure}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 15,
    },
})