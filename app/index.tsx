import React, { useEffect, useRef, useState } from 'react';

import { API_URL, STORAGE_KEYS } from '@/constants/constants';
import { fetchVersion } from '@/lib/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';


export default function RoomSelectScreen() {

    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const logoWidth = width * 0.8;
    const logoHeight = logoWidth * (3 / 3);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showVersionWarning, setShowVersionWarning] = useState(false);

    useEffect(() => {
        (async () => {
            Animated.timing(fadeAnim, {
                toValue: 1,              // target opacity
                duration: 2000,          // 2 seconds
                useNativeDriver: true,   // better performance
            }).start();

            // validate version
            const currentVer = Application.nativeApplicationVersion;
            const currentVersion = Number(currentVer?.replace(".", ""));
            const serverVerResponse = await fetchVersion();
            const serverVersion = Number(serverVerResponse.data.version.replace(".", ""));
            if (serverVersion > currentVersion) {
                setShowVersionWarning(true);
                return;
            }

            // check for existing device authentication and expiration
            const qrData = await AsyncStorage.getItem(STORAGE_KEYS.QR_DATA);
            if(!qrData) {
                router.replace('/authenticate');
                return;
            }
            
            const qrExpiryDate = await AsyncStorage.getItem(STORAGE_KEYS.QR_EXPIRY_DATE);
            if(!qrExpiryDate) {
                router.replace('/authenticate');
                return;
            }
            
            if(new Date().getTime() > new Date(qrExpiryDate ?? '').getTime()){
                router.replace('/authenticate');
                return;
            }

            try{
                const deviceId = Application.applicationId ?? '';
                const response = await fetch(
                `${API_URL}/pookie/authenticate?key=${encodeURIComponent(qrData)}&deviceId=${encodeURIComponent(deviceId)}`
                );
                if (!response.ok) {
                    router.replace('/authenticate');
                    return;
                }
                const result = await response.json();

                if (!result.data.isAuthenticated) {
                    router.replace('/authenticate');
                    return;
                }
            }catch{
                router.replace('/authenticate');
                return;
            }
                
            router.replace('/chooselocation');



            // if(await hasLastDrawnResult())
            //     router.replace('/result');
            // else
            //     router.replace('/chooselocation');
        })();
    }, []);


    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("@/assets/images/splash-image.jpg")}
                style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Image
                        source={require("@/assets/images/logo-text-shadow.png")}
                        style={{
                            width: logoWidth,
                            height: logoHeight,
                        }}
                    />
                    
                    
                </Animated.View>
                <Text style={{fontSize: 12, fontWeight: "bold", marginBottom: 20, color: "#000"}}>Version : {Application.nativeApplicationVersion}</Text>
                {showVersionWarning && <View style={{width: "50%", backgroundColor: "#fff", borderColor: "#aaa", borderRadius: 10, borderWidth: 2, padding: 10}}>
                        <Text style={{fontSize: 14, color: "#a00"}}>새로운 버전의 앱이 출시되었습니다. 최신 버전으로 업데이트 해주세요!</Text>
                    </View>}
                
            </ImageBackground>
        </View>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    image: {
        height: "100%",
    },
});
