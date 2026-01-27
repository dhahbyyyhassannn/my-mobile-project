import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, Alert, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';


export default function DetectScan() {
    const navigation = useNavigation();
    const [scanBarcode, setScanBarcode] = useState('');
    const inputref = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        focusInput();
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const focusInput = () => {
        setTimeout(() => {
            inputref.current?.focus(); // if inputref.current is not null, call focus()
        }, 100);
    };
    const handleChangeText = (text) => {
        setScanBarcode(text);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (text.trim().length > 0) {
                // show toast and keep the scanned value visible for a short time
                try {
                    ToastAndroid.show(`✅ Scan réussi!\n📦 Code: ${text}`, ToastAndroid.LONG);
                } catch (e) {
                    // ToastAndroid may not be available on all platforms
                }
                // leave the scanned code visible; clear after 2s
                timeoutRef.current = setTimeout(() => {
                    setScanBarcode('');
                    focusInput();
                }, 2000);
            }
        }, 100);
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Placer la machine
                {'\n'}
                Devant le code a barre
                {'\n'}
                pour scanner
            </Text>
            {scanBarcode.length > 0 ? (
                <View style={styles.resultCard}>
                    <Text style={styles.successText}>Scan réussi!</Text>
                    <Text style={styles.barcodeText}>{scanBarcode}</Text>
                </View>
            ) : (
                <AntDesign name="barcode" size={24} color="black" />
            )}
            {/* hidden input to receive scanner input (hardware scanner sends as keyboard input) */}
            <TextInput
                ref={inputref}
                value={scanBarcode}
                onChangeText={handleChangeText}
                style={styles.hiddenInput}
                autoFocus
                showSoftInputOnFocus={false}
                caretHidden={true}
                keyboardType="visible-password"
            />
            <Pressable style={({pressed}) => [styles.btn, pressed && styles.btnHover]} onPress={() => navigation.goBack()}>
                <AntDesign name="arrow-left" size={24} color="black" />
                <Text style={styles.btnText}>retourner</Text>
            </Pressable>
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
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        backgroundColor: '#ddd',
        textAlign: 'center',
        padding: 20,
        borderRadius: 10,
    },
    image: {
        marginTop: 40,
        resizeMode: 'contain',
        width: 200,
        height: 120,
    },
    btn: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    arrow: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginTop: 2,
    }
    ,
    hiddenInput: {
        height: 0,
        width: 0,
        opacity: 0,
    },
    resultCard: {
        marginTop: 40,
        backgroundColor: '#fff',
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 15,
    },
    barcodeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007bff',
    },
});