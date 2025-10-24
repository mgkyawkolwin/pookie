import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/constants';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';


export default function RoomSelectScreen({ navigation }: { navigation: any }) {

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const lastResult : any = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DRAW_RESULT);
            if (!lastResult) {
                router.push('/chooseroom');
                return;
            }

            // there is draw result, check date
            const today = new Date();
            let drawDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
            drawDate.setUTCDate(drawDate.getUTCDate() + 1);
            const lastDrawnDate = new Date(JSON.parse(lastResult).date);

            if(lastDrawnDate.getTime() === drawDate.getTime()){
                router.replace('/result');
                return;
            }

            router.push('/chooseroom');
        })();
    }, []);


    return (
        <></>
    );
}
