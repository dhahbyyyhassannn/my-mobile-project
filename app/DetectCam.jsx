import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

export default function BarcodeScanner() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [barcodeType, setBarcodeType] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  
  // Initialize camera permission
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  // Handle barcode scanning
  const handleBarCodeScanned = ({ type, data }) => {
    // Filter out QR codes if you only want classical barcodes
    const qrTypes = ['qr', 'org.iso.QRCode', 'org.iso.QRCode'];
    const isQRCode = qrTypes.includes(type.toLowerCase());
    
    if (isQRCode) {
      // Ignore QR codes if you only want barcodes
      console.log('QR code detected, ignoring...');
      return;
    }
    
    setScanned(true);
    setBarcodeData(data);
    setBarcodeType(type);
    setScanning(false);
    
    // Vibrate on successful scan (if available)
    if (Platform.OS === 'android') {
      const { Vibration } = require('react-native');
      Vibration.vibrate(100);
    }
    
    Alert.alert(
      'Barcode Scanned!',
      `Type: ${type}\nData: ${data}`,
      [
        {
          text: 'Scan Again',
          onPress: () => {
            setScanned(false);
            setScanning(true);
            setBarcodeData(null);
          },
        },
        {
          text: 'OK',
          onPress: () => {
            // Process the barcode data
            console.log('Barcode data:', data);
          },
        },
      ]
    );
  };

  // Toggle flash
  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  // Toggle camera
  const toggleCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Reset scanner
  const resetScanner = () => {
    setScanned(false);
    setScanning(true);
    setBarcodeData(null);
  };

  // Show permission request
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-off" size={80} color="#666" />
        <Text style={styles.permissionText}>
          We need your permission to use the camera for barcode scanning
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classical Barcode Scanner</Text>
        <Text style={styles.subtitle}>Point camera at barcode</Text>
      </View>

      <View style={styles.cameraContainer}>
        {scanning && (
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              // Specify EXACTLY which barcode types you want to scan
              // These are classical barcode types (not QR codes)
              barcodeTypes: [
                'aztec',
                'ean13',      // European Article Number (most common)
                'ean8',       // Smaller EAN
                'upc_e',      // UPC-E
                'upc_a',      // UPC-A
                'code39',     // Code 39
                'code93',     // Code 93
                'code128',    // Code 128 (very common)
                'codabar',    // Codabar
                'itf14',      // ITF-14
                'pdf417',     // PDF417 (2D but not QR)
                'datamatrix', // DataMatrix (2D but not QR)
                'interleaved2of5', // ITF
              ],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            enableTorch={flashOn}
          >
            {/* Scanner overlay */}
            <View style={styles.overlay}>
              {/* Transparent area for scanning */}
              <View style={styles.scanFrameContainer}>
                <View style={styles.scanFrame}>
                  {/* Corner indicators */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <Text style={styles.scanText}>Align barcode within frame</Text>
              </View>

              {/* Control buttons */}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                  <MaterialIcons 
                    name={flashOn ? "flash-on" : "flash-off"} 
                    size={30} 
                    color="white" 
                  />
                  <Text style={styles.controlText}>Flash</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
                  <MaterialIcons name="flip-camera-ios" size={30} color="white" />
                  <Text style={styles.controlText}>Flip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        )}

        {/* Scanned result display */}
        {!scanning && barcodeData && (
          <View style={styles.resultContainer}>
            <View style={styles.resultCard}>
              <MaterialIcons name="check-circle" size={50} color="#4CAF50" />
              <Text style={styles.resultTitle}>Scan Successful!</Text>
              
              <View style={styles.resultDetails}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Type:</Text>
                  <Text style={styles.resultValue}>{barcodeType}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Data:</Text>
                  <Text style={[styles.resultValue, styles.dataText]}>{barcodeData}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
                <Text style={styles.scanAgainText}>Scan Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Manual input option */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.manualButton} onPress={resetScanner}>
          <MaterialIcons name="camera-alt" size={24} color="#2196F3" />
          <Text style={styles.manualButtonText}>
            {scanned ? 'Resume Scanning' : 'Start Scanning'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  cameraContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'space-between',
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.8,
    height: 150,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4CAF50',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  resultDetails: {
    width: '100%',
    marginVertical: 15,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  dataText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  scanAgainButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  manualButton: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});