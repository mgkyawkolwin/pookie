import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { styles } from '../lib/styles';
import { STORAGE_KEYS } from '@/constants/constants';

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

  useEffect(() => {
    (async () => {
            if (!result) {
                const cached = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DRAW_RESULT);
                if (cached) setResult(JSON.parse(cached));
            }
        })();
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>티업표 배정되었습니다!</Text>
      <Image source={require("@/assets/images/logo.png")} style={{ width: 100, height: 100 }} />
      <Text style={styles.resultText}>Date: {String(result?.time).substring(0, 10)}</Text>
      <Text style={styles.resultText}>Time: {String(result?.time).substring(11, 16)}</Text>
      <Text style={styles.resultText}>Hole: {result?.hole}</Text>
      <Text style={styles.resultText}>Room (s): {result?.rooms}</Text>
      <Text style={[styles.text, {paddingTop: 50}]}>내일 아침 티오프 하실 때, 이 티 티켓을 직원에게 보여주시고 티오프를 시작하세요. 즐거운 라운드 되시길 바랍니다. 감사합니다.</Text>
      <View style={StyleSheet.absoluteFill}>
        {particles.map(p => (
          <ParticleView key={p.id} particle={p} centerX={centerX} centerY={centerY} />
        ))}
      </View>
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