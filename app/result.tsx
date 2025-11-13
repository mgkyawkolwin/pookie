import LoadingOverlay from '@/components/loadingoverlay';
import { STORAGE_KEYS } from '@/constants/constants';
import { callDrawApi, getDrawDateStringInISOFormat } from '@/lib/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../lib/styles';

const { width, height } = Dimensions.get('window');
const centerX = width / 2;
const centerY = height / 2;

type Particle = {
  id: string;
  shape: 'circle' | 'rect' | 'triangle';
  color: string;
  dx: number; // movement X
  dy: number; // movement Y
};

export default function ExplodeScreen() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contactUrl, setContactUrl] = useState("");


  useEffect(() => {
    (async () => {
      setContactUrl(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_USER_LINK) ?? "");
      performDraw();
      return;
    })();
  }, []);


  const drawAnimation = () => {
    const count = 300;
    const shapes: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 200 + 100;
      return {
        id: `p-${i}`,
        shape: ['circle', 'rect', 'triangle'][Math.floor(Math.random() * 3)] as Particle['shape'],
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
      };
    });
    setParticles(shapes);
  };


  const performDraw = async () => {
    try {
      const rooms = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROOM);
      const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
      const noOfPlayer = Number(await AsyncStorage.getItem(STORAGE_KEYS.NO_OF_PLAYERS));
      const response = await callDrawApi(location ?? '', rooms ?? '', noOfPlayer);
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        Alert.alert(data?.message ?? "알 수 없는 이유로 추첨에 실패했습니다.");
        return;
      }


      // Save the draw result & date
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_DRAW_DATE, getDrawDateStringInISOFormat());
      const result = data?.data?.timeTable;
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_DRAW_RESULT, JSON.stringify(result));
      setLoading(false);
      drawAnimation();
      setResult(result);

    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', e.message || 'Unable to draw', undefined, { cancelable: true });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingOverlay visible={loading} />
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', padding: 20, borderRadius: 20, width: "80%" }}>
          <Text style={{ fontSize: 25, color: "#000", fontWeight: "bold" }}>티업표 배정되었습니다!</Text>
          <Image source={require("@/assets/images/trophy.png")} style={{ width: 100, height: 100 }} />
          <Text style={styles.resultText}>Date: {String(result?.date).substring(0, 10)}</Text>
          <Text style={styles.resultText}>Time: {String(result?.time).substring(11, 16)}</Text>
          <Text style={styles.resultText}>Hole: {result?.hole}</Text>
          <Text style={styles.resultText}>Room (s): {result?.rooms}</Text>
          <Text style={[styles.text, { paddingTop: 50 }]}>내일 오전 라운하실 때, 이 티켓을 직원에게 보여주시고 라운딩 시작하시면 됩니다. 즐거운 라운딩 되시길 바랍니다. 감사합니다.</Text>
        </View>
        <Text>도움이 필요하신가요?</Text>
        <Text
          style={{ color: '#1DA1F2', textDecorationLine: 'underline' }}
          onPress={() => Linking.openURL(contactUrl)}
        >
          지원팀에 문의하세요.
        </Text>

        <View style={StyleSheet.absoluteFill}>
          {particles.map(p => (
            <ParticleView key={p.id} particle={p} centerX={centerX} centerY={centerY} />
          ))}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

function ParticleView({ particle, centerX, centerY }: { particle: Particle; centerX: number; centerY: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateX.value = withTiming(particle.dx, { duration: 3000, easing: Easing.out(Easing.exp) });
    translateY.value = withTiming(particle.dy, { duration: 3000, easing: Easing.out(Easing.exp) });
    opacity.value = withDelay(2500, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
    top: centerY,
    left: centerX,
  }));

  const size = Math.random() * 10 + 1;

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: particle.shape === 'circle' ? size / 2 : 0,
          backgroundColor: particle.color,
        },
      ]}
    />
  );
}