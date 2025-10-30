import React, { useEffect, useRef } from 'react';

import { fetchVersion } from '@/lib/utilities';
import * as Application from 'expo-application';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { Alert, Animated, Dimensions, Image, StyleSheet, View } from 'react-native';


export default function RoomSelectScreen() {

    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const logoWidth = width * 0.8;
    const logoHeight = logoWidth * (3 / 3);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            Animated.timing(fadeAnim, {
                toValue: 1,              // target opacity
                duration: 2000,          // 2 seconds
                useNativeDriver: true,   // better performance
            }).start();
            const currentVer = Number(Application.nativeApplicationVersion ?? 0);
            const serverVer = Number(await fetchVersion() ?? 0);
            if (serverVer > currentVer) {
                Alert.alert("업데이트 필요", "새로운 버전의 앱이 출시되었습니다. 최신 버전으로 업데이트 해주세요!");
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            // for testing purpose, always go to location selection
            router.replace('/chooselocation');
            return;

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
