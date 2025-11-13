import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoadingOverlay from '@/components/loadingoverlay';
import { STORAGE_KEYS } from '@/constants/constants';
import { styles } from "@/lib/styles";
import { fetchLocations } from '@/lib/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';


export default function ChooseLocation() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noOfPlayer, setNoOfPlayer] = useState(1);
    const [selectedItem, setSelectedItem] = useState<null | string>(null);

    const router = useRouter();

    const { width, height } = Dimensions.get('window');


    useEffect(() => {
        (async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 5000));
            const response = await fetchLocations();
            if (!response.ok) Alert.alert('Error', '골프 클럽 위치를 가져오는 데 실패했습니다.');
            const responseData = await response.json();
            setList(responseData.data.locations || []);
            setLoading(false);
        })();
    }, []);


    const saveAndProceed = async () => {
        if (!selectedItem) {
            Alert.alert("알려지지 않은 골프 클럽", "골프 클럽을 선택해 주세요!");
        }
        await AsyncStorage.setItem(STORAGE_KEYS.LOCATION, selectedItem ?? '');
        router.push({ pathname: `/chooseroom`, params: { myRoom: selectedItem } });
    };


    const renderItem = ({ item }: { item: string }) => {
        const isSelected: boolean = selectedItem === item;
        return (
            <TouchableOpacity
                onPress={() => setSelectedItem(selectedItem === item ? '' : item)}
                style={[styles.flatListRow, isSelected && styles.flatListRowSelected]}
            >
                <Text style={styles.roomText}>{item}</Text>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={[styles.container]}>
            <ImageBackground source={require('@/assets/images/splash-image.jpg')} style={{ flex: 1, margin: 0, paddingTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.header}>골프장을 선택해 주세요</Text>
                <FlatList style={{ backgroundColor: 'rgba(255,255,255,0.5)', width: "80%", height: "60%", margin: 20, borderRadius: 20, borderColor: "#000" }} data={list} renderItem={renderItem} keyExtractor={(i) => String(i)} />
                <View style={styles.footerRow}>
                    <TouchableOpacity
                        style={[styles.btn, { width: '100%', backgroundColor: selectedItem ? '#f7d308ff' : '#999' }]}
                        disabled={!selectedItem}
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
