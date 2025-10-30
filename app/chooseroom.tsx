import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    ImageBackground,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoadingOverlay from '@/components/loadingoverlay';
import { STORAGE_KEYS } from '@/constants/constants';
import { styles } from "@/lib/styles";
import { fetchRooms } from '@/lib/utilities';
import { useRouter } from 'expo-router';


export default function ChooseRoom() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<null | string>(null);
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
                Alert.alert('Error', e.message || '객실을 로드하는 데 실패했습니다!');
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const saveAndProceed = async () => {
        if (!selected) {
            Alert.alert("알 수 없는 객실 번호", "객실 번호를 선택해 주세요!");
        }
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_ROOM, selected ?? '');
        //navigation.replace('DrawHole');
        router.push({ pathname: `/choosefriend`, params: { myRoom: selected } });
    };


    const toggleSelectedList = async (room: string) => {
        const item = selectedList.find(s => s === room);
        if (item)
            setSelectedList(prev => prev.filter(s => s !== room));
        else
            setSelectedList(prev => [...prev, room]);
    };


    const renderItem = ({ item }: { item: string }) => {
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
            <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.header}>객실 번호를 선택하세요</Text>
                <FlatList style={{ backgroundColor: 'rgba(255,255,255,0.5)', width: "80%", height: "60%", margin: 20, borderRadius: 20, borderColor: "#000" }} data={rooms} renderItem={renderItem} keyExtractor={(i) => String(i)} />
                <View style={styles.footerRow}>
                    <TouchableOpacity
                        style={[styles.btn, { width: '100%', backgroundColor: selected ? '#f7d308ff' : '#999' }]}
                        disabled={!selected}
                        onPress={() => saveAndProceed()}
                    >
                        <Text style={styles.btnText}>다음의</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
}
