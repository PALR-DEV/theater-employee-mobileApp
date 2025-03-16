import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Dimensions, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function App({ onClose }) {
    const [permission, requestPermission] = useCameraPermissions();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const scanSize = Math.min(windowWidth * 0.7, windowHeight * 0.4);
    const [isScanning, setIsScanning] = useState(true);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBackPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onClose();
    };



    const handleScan = ({ barcodes }: BarcodeScanningResult) => {
        try {
            // Add debug logging
            console.log('Scan attempt:', barcodes);
            
            if (!isScanning || !barcodes || barcodes.length === 0) return;

            for (const barcode of barcodes) {
                // Add more detailed logging
                console.log('Detected barcode:', {
                    type: barcode.type,
                    data: barcode.data,
                    bounds: barcode.bounds
                });
                
                if (barcode.type === 'qr' && barcode.data) {
                    // Remove bounds checking temporarily for testing
                    setIsScanning(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    
                    const ticketId = barcode.data.trim();
                    if (ticketId) {
                        console.log('Valid QR Code detected:', ticketId);
                        Alert.alert(
                            'QR Code Detected',
                            `Ticket ID: ${ticketId}`,
                            [{ text: 'OK', onPress: () => validateTicket(ticketId) }]
                        );
                    }
                    
                    setTimeout(() => setIsScanning(true), 1000);
                    break;
                }
            }
        } catch (error) {
            console.error('Error scanning QR code:', error);
            setIsScanning(true);
        }
    };

    const validateTicket = async (ticketId: string) => {
        try {
            // Add your ticket validation logic here
            // For example:
            // const response = await fetch('your-api-endpoint', {
            //     method: 'POST',
            //     body: JSON.stringify({ ticketId })
            // });
            // const data = await response.json();
            // Handle the validation response
        } catch (error) {
            console.error('Error validating ticket:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <CameraView 
                style={styles.camera} 
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleScan}
                enableTorch={false}
            >
                <View style={[styles.overlay, { width: windowWidth, height: windowHeight }]}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={handleBackPress}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={[styles.scanArea, { width: scanSize, height: scanSize }]}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                    </View>
                    <Text style={styles.scanText}>Position QR code within frame</Text>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#2C2C2E'
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderRadius: 12,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#FFFFFF',
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 30,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: '#FFFFFF',
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 30,
        height: 30,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#FFFFFF',
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderColor: '#FFFFFF',
    },

    scanText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 20,
        fontWeight: '500',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 12,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
});
