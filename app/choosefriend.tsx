import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';
import Checkbox from 'expo-checkbox';
import { NavigationAction, NavigationContainer, NavigationContainerRef, NavigationProp, NavigationRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';

import { STORAGE_KEYS } from '@/constants/constants';
import { styles } from "@/lib/styles";
import { callDrawApi, fetchRooms, todayDateISO } from "@/lib/utilities"
import { router, useLocalSearchParams } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';


export default function ChooseFriend({ route, navigation }: { route: any, navigation: any }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [selectedMap, setSelectedMap] = useState<Map<string, string>>({} as unknown as Map<string, string>);
    const [selectedMap, setSelectedMap] = useState<any>({});
    const [selectedList, setSelectedList] = useState<string[]>([]);
        const params : any = useSearchParams();
    const [myRoom, setMyRoom] = useState<string|null>("");
    

    useEffect(() => {
    
        (async () => {
            try {
                const t = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROOM);
                setMyRoom(t);
                const data = await fetchRooms();
                setRooms(data?.data?.roomNames);
            } catch (e: any) {
                Alert.alert('Error', e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const toggle = (room: string) => {
        setSelectedMap((m: any) => ({ ...m, [room]: !m[room] }));
    };


    const playWithFriends = async () => {
        if (selectedList.length === 0) {
            Alert.alert('Select at least one room');
            return;
        }
        await performDraw(selectedList.join(','));
    };


    const drawForMyself = async () => {
        const myRoom = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROOM);
        if (!myRoom) {
            Alert.alert('No saved room. Please choose a room first.');
            return;
        }
        await performDraw(myRoom);
    };


    const performDraw = async (roomsCsv: string) => {
        try {
            const result = await callDrawApi(roomsCsv);
            // Save the draw result & date
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_DRAW_DATE, todayDateISO());
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_DRAW_RESULT, JSON.stringify(result?.data?.timeTable));
            router.dismissAll();
            router.push("/result", result);
        } catch (e: any) {
            Alert.alert('Draw failed', e.message || 'Unable to draw');
        }
    };


    const toggleSelectedList = async (room: string) => {
        const item = selectedList.find(s => s === room);
        if (item)
            setSelectedList(prev => prev.filter(s => s !== room));
        else
            setSelectedList(prev => [...prev, room]);
    };


    const renderItem = ({ item }: { item: string }) => {
        const isSelected: boolean = selectedList.find(s => s === item) ? true : false;
        // const isSelected: boolean = selected === item;
        return (item !== myRoom ? 
            <TouchableOpacity
                onPress={() => toggleSelectedList(item)}
                style={[styles.flatListRow, isSelected && styles.flatListRowSelected]}
            >
                <Text style={styles.roomText}>{item}</Text>
            </TouchableOpacity>
            : <></>
        );
    };


    if (loading) return <SafeAreaView style={styles.centered}><ActivityIndicator /></SafeAreaView>;


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>친구들과 함께 플레이하고 싶으신가요?</Text>

            <Text style={styles.text}>친구의 방을 선택하세요.</Text>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList style={{ height: '60%', backgroundColor: '#fff' }} data={rooms} renderItem={renderItem} keyExtractor={(i) => String(i)} />
            )}
            <View style={styles.footerRow}>

                <TouchableOpacity
                    style={[styles.btn,]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.btnText}>돌아가다</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn,]}
                    onPress={() => playWithFriends()}
                >
                    <Text style={styles.btnText}>친구들과 놀다</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn,]}
                    onPress={() => drawForMyself()}
                >
                    <Text style={styles.btnText}>혼자 그리다</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}