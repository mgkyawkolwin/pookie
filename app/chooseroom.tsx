import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Pressable,
    Image,
    SectionList,Button
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { NavigationAction, NavigationContainer, NavigationContainerRef, NavigationProp, NavigationRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';

import { STORAGE_KEYS } from '@/constants/constants';
import {styles} from "@/lib/styles";
import { fetchRooms } from '@/lib/utilities';
import { useRouter } from 'expo-router';
import { Background } from '@react-navigation/elements';


export default function ChooseRoom({ navigation } : { navigation: any}) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<null|string>(null);
    const [selectedList, setSelectedList] = useState<string[]>([]);

    const router = useRouter();

    const { width, height } = Dimensions.get('window');


    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await fetchRooms();
                setRooms(data?.data?.roomNames);
            } catch (e: any) {
                Alert.alert('Error', e.message || 'Failed to load rooms');
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const saveAndProceed = async () => {
        if(!selected){
            Alert.alert("Missing Room", "Please choose your room number!");
        }
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_ROOM, selected ?? '');
        //navigation.replace('DrawHole');
        router.push({pathname: `/choosefriend`, params: {myRoom: selected}});
    };


    const toggleSelectedList = async (room: string) => {
        const item = selectedList.find(s => s === room);
        if(item)
            setSelectedList(prev => prev.filter(s => s !== room));
        else
            setSelectedList(prev => [...prev, room]);
    };


    const renderItem = ({ item } : { item: string}) => {
        //const isSelected: boolean = selectedList.find( s => s === item) ? true : false;
        const isSelected: boolean = selected === item;
        return (
            <TouchableOpacity
                onPress={() => setSelected(selected === item ? '' : item)}
                style={[styles.flatListRow, isSelected && styles.flatListRowSelected]}
            >
                <Text style={styles.roomText}>{item}</Text>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>객실 번호를 선택하세요</Text>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList style={{backgroundColor: '#fff', height: '70%'}} data={rooms} renderItem={renderItem} keyExtractor={(i) => String(i)} />
            )}
            <View style={styles.footerRow}>
                <TouchableOpacity
                    style={[styles.btn, { width: '100%',backgroundColor: selected ? '#f7d308ff' : '#999' }]}
                    disabled={!selected}
                    onPress={() => saveAndProceed()}
                >
                    <Text style={styles.btnText}>다음의</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
