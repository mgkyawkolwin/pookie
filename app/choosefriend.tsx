import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Alert,
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
import { fetchRooms } from "@/lib/utilities";
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';


export default function ChooseFriend() {
    const router = useRouter();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noOfFriend, setNoOfFriend] = useState(1);
    const [noOfPlayer, setNoOfPlayer] = useState(0);
    const [selectedMap, setSelectedMap] = useState<any>({});
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const params: any = useSearchParams();
    const [myRoom, setMyRoom] = useState<string | null>("");


    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                setNoOfPlayer(Number(await AsyncStorage.getItem(STORAGE_KEYS.NO_OF_PLAYERS)));
                const t = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROOM);
                setMyRoom(t);
                const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
                const data = await fetchRooms(location || '');
                setRooms(data?.data?.roomNames);
            } catch (e: any) {
                Alert.alert('Error', e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const playWithFriends = async () => {
        if (selectedList.length === 0) {
            Alert.alert('최소한 한 개의 객실을 선택하세요.');
            return;
        }
        if(Number(noOfFriend) + Number(noOfPlayer) > 4){
            Alert.alert('최대 4명의 플레이어만 함께 플레이할 수 있습니다.');
            return;
        }
        selectedList.push(myRoom ?? '');
        await AsyncStorage.setItem(STORAGE_KEYS.NO_OF_PLAYERS, String(Number(noOfFriend) + Number(noOfPlayer)));
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_ROOM, selectedList.join(','));
        router.dismissAll();
        router.replace("/result");
    };


    const drawForMyself = async () => {
        router.dismissAll();
        router.replace("/result");
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

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.header}>함께 라운드를 진행하고 싶은 방 번호와 플레이어 수를 선택해 주세요.</Text>
                <FlatList style={{ backgroundColor: 'rgba(255,255,255,0.5)', width: "80%", height: "50%", margin: 20, borderRadius: 20, borderColor: "#000" }} data={rooms} renderItem={renderItem} keyExtractor={(i) => String(i)} />
                <View style={styles.footerRow}>
                    <TouchableOpacity
                        style={[styles.rectangleBtn, { backgroundColor: '#f7d308ff' }]}
                        onPress={() => {
                            if (noOfFriend > 1) setNoOfFriend(prev => prev - 1);
                        }}
                    >
                        <Text style={styles.rectangleBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.header, { paddingLeft: 10, paddingRight: 10 }]}>{noOfFriend} Player</Text>
                    <TouchableOpacity
                        style={[styles.rectangleBtn, { backgroundColor: '#f7d308ff' }]}
                        onPress={() => {
                            if (noOfFriend < 4) setNoOfFriend(prev => prev + 1);
                        }}
                    >
                        <Text style={[styles.rectangleBtnText]}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerRow}>
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
                <LoadingOverlay visible={loading} />
            </ImageBackground>
        </SafeAreaView>
    );
}