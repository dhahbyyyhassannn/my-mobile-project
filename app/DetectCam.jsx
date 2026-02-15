import { useState} from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CameraSettingsButton from './components/Button/CameraSettingsButton';
import HeaderPage from './components/Layout/HeaderPage';

export default function DetectCam() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState('back');
  const [cameraFlash, setCameraFlash] = useState('off');
  const [scannedData, setScannedData] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="donner la permission" />
      </View>
    );
  }

  return (
    <>
      <HeaderPage titre='camera scan' />
      <View style={styles.screen}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Détecter votre code a barre
            ou votre code QR
          </Text>
          <MaterialCommunityIcons name="qrcode-scan" size={30} color="#FFF9FB" />
        </View>
        <View style={styles.cameraFrame}>
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={cameraFacing} flash={cameraFlash} 
            barcodeScannerSettings={{
              barcodeTypes:
                ["qr","ean13", "ean8", "upc_e", "upc_a", "code39", 
                "code93", "code128", "pdf417", "aztec", "datamatrix",
                "itf14"]
            }}
            onBarcodeScanned={({ data, type }) => {
              setScannedData(`Type: ${type} - Data: ${data}`);}}
            />
          </View>
          <View style={styles.cameraSettings}>
            <CameraSettingsButton 
            text="tourner la camera" name="camera-reverse-sharp" size={30} color="#FFF9FB" 
            onPress={() => {
              setCameraFacing(cameraFacing === 'back' ? 'front' : 'back');
            }}
            />
            <CameraSettingsButton text='on/off' name={cameraFlash === 'off' ? 'flash-off' : 'flash'} size={30} color="#FFF9FB" 
            onPress={() => {
              setCameraFlash(cameraFlash === 'off' ? 'on' : 'off');
            }}/>
          </View>
        </View>
        <View style={styles.resultContainer}>
            <Text>Résultat du scan:</Text>
            {scannedData && <Text>
                {scannedData}
              </Text>}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create ({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  titleContainer: {
    backgroundColor: '#292F36',
    padding: 8,
    borderRadius: 7,
    width: 280,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: '#FFF9FB',
    fontSize: 20,
    textAlign: 'center'
  },
  cameraFrame: {
    gap: 11,
  },
  cameraContainer: {
    width: 280,
    height: 120,
    borderColor: '#292F36',
    borderWidth: 2,
    borderRadius: 7,
    borderStyle: 'dashed',
    overflow: 'hidden'
  },
  camera: {
    flex: 1
  },
  cameraSettings: {
    backgroundColor: '#7C898B',
    width: 280,
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },
  persobutton: {
    width: 80,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  persobuttontext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  resultContainer: {
    backgroundColor: '#7C898B',
  }
})