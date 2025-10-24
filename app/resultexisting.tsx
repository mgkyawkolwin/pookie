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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { NavigationAction, NavigationContainer, NavigationContainerRef, NavigationProp, NavigationRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';

import { STORAGE_KEYS } from '@/constants/constants';
import { styles } from "@/lib/styles";
import { callDrawApi, fetchRooms, todayDateISO } from "@/lib/utilities";


export default function ResultScreen({ route, navigation }: {route: any, navigation: any}) {
    const [result, setResult] = useState<any>(null);


    useEffect(() => {
        (async () => {
            if (!result) {
                const cached = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DRAW_RESULT);
                if (cached) setResult(JSON.parse(cached));
            }
        })();
    }, []);


    if (!result) return (
        <SafeAreaView style={styles.centered}><Text>No result to show</Text></SafeAreaView>
    );


    const entries = Object.entries(result);
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("@/assets/images/logo.png")} style={{ width: 100, height: 100 }} />
            <Text style={styles.header}>Draw Result</Text>
            <Text style={styles.header}>Date: {String(result?.time).substring(0, 10)}</Text>
            <Text style={styles.header}>Time: {String(result?.time).substring(11, 16)}</Text>
            <Text style={styles.header}>Hole: {result?.data?.hole}</Text>
            <Text style={styles.header}>Room (s): {result?.rooms}</Text>
            
        </SafeAreaView>
    );
}