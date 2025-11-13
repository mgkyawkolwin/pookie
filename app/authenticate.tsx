import { API_URL, STORAGE_KEYS } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applicationId } from 'expo-application';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Authenticate() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [message, setMessage] = useState('QR 코드를 스캔해 주세요');
    const router = useRouter();


    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission]);


    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        setMessage('확인 중...');

        try {
            const deviceId = applicationId ?? '';

            const response = await fetch(
                `${API_URL}/pookie/authenticate?key=${encodeURIComponent(data)}&deviceId=${encodeURIComponent(deviceId)}`
            );
            if (!response.ok) {
                Alert.alert('오류', '서버 연결에 문제가 발생했습니다.');
                setMessage('오류가 발생했습니다. 관리자에게 문의하세요.');
                return;
            }
            const result = await response.json();

            if (result.data.isAuthenticated) {
                setMessage('인증 성공! 다음 화면으로 이동합니다...');
                await AsyncStorage.setItem(STORAGE_KEYS.QR_DATA, data);
                var date = new Date();
                date.setMonth(date.getMonth() + 1);
                await AsyncStorage.setItem(STORAGE_KEYS.QR_EXPIRY_DATE, date.toISOString());
                setTimeout(() => {
                    router.replace('/chooselocation');
                }, 1000);
            } else {
                setMessage('기기 활성화에 실패했습니다. 고객 서비스에 문의하세요.');
            }
        } catch (err) {
            Alert.alert('오류', '서버 연결에 문제가 발생했습니다.');
            setMessage('오류가 발생했습니다. 관리자에게 문의하세요.');
        }
    };

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>카메라 권한이 필요합니다.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>권한 허용</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.header}>{message}</Text>
                {!scanned ? (
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                        onBarcodeScanned={handleBarcodeScanned}
                    />
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setScanned(false);
                                setMessage('QR 코드를 다시 스캔해 주세요');
                            }}
                        >
                            <Text style={styles.buttonText}>다시 시도</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, margin:0, padding:0, backgroundColor: '#000' },
    header: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center',
    },
    camera: {
        width: '85%',
        height: '55%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    message: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#f7d308',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});
