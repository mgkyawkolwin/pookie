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
import RoomAndPax from '@/lib/dto/RoomAndPax';
import { styles } from "@/lib/styles";
import { fetchRooms } from '@/lib/utilities';
import { useRouter } from 'expo-router';


export default function ChooseRoom() {
    const [roomAndPaxs, setRoomAndPaxs] = useState<RoomAndPax[]>([]);
    const [loading, setLoading] = useState(false);
    const [noOfPlayer, setNoOfPlayer] = useState(1);
    const [selected, setSelected] = useState<null | RoomAndPax>(null);
    const [selectedList, setSelectedList] = useState<RoomAndPax[]>([]);

    const router = useRouter();

    const { width, height } = Dimensions.get('window');


    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
                const response = await fetchRooms(location || '');
                const responseData = await response.json();
                if(response.ok){
                    setRoomAndPaxs(responseData?.data?.roomsAndPax);
                }else{
                    Alert.alert('객실을 로드하는 데 실패했습니다!');
                }
            } catch (e: any) {
                Alert.alert(e.message || '객실을 로드하는 데 실패했습니다!');
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const saveAndProceed = async () => {
        if (!selected) {
            Alert.alert("알 수 없는 객실 번호", "객실 번호를 선택해 주세요!");
        }
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_ROOM, selected?.roomNo ?? '');
        await AsyncStorage.setItem(STORAGE_KEYS.NO_OF_PLAYERS, String(selected?.noOfGuests));
        //navigation.replace('DrawHole');
        router.push({ pathname: `/choosefriend` });
    };


    const renderItem = ({ item }: { item: RoomAndPax }) => {
        //const isSelected: boolean = selectedList.find( s => s === item) ? true : false;
        const isSelected: boolean = selected?.roomNo === item.roomNo;
        return (
            <TouchableOpacity
                onPress={() => setSelected(selected?.roomNo === item.roomNo ? null : item)}
                style={[styles.flatListRow, isSelected && styles.flatListRowSelected]}
            >
                <Text style={styles.roomText}>{item.roomNo} ({item.noOfGuests} Pax)</Text>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.header}>방 번호하고 인원수 선택해 주세요</Text>
                <FlatList style={{ backgroundColor: 'rgba(255,255,255,0.5)', width: "80%", height: "60%", margin: 20, borderRadius: 20, borderColor: "#000" }} data={roomAndPaxs} renderItem={renderItem} keyExtractor={(i) => String(i.roomNo)} />
                {/* <View style={styles.footerRow}>
                    <TouchableOpacity
                        style={[styles.rectangleBtn, { backgroundColor: '#f7d308ff' }]}
                        onPress={() => {
                            if(noOfPlayer > 1) setNoOfPlayer(prev => prev - 1);
                        }}
                    >
                        <Text style={styles.rectangleBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.header, {paddingLeft: 10, paddingRight: 10}]}>{noOfPlayer} Player</Text>
                    <TouchableOpacity
                        style={[styles.rectangleBtn, { backgroundColor: '#f7d308ff' }]}
                        onPress={() => {
                            if(noOfPlayer < 4) setNoOfPlayer(prev => prev + 1);
                        }}
                    >
                        <Text style={[styles.rectangleBtnText]}>+</Text>
                    </TouchableOpacity>
                </View> */}
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
