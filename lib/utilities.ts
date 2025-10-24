import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    Alert,
    Modal,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';

import {DRAW_URL, ROOMS_URL} from "@/constants/constants";



export function todayDateISO() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
}


export async function fetchRooms() {
    const res = await fetch(ROOMS_URL);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    const json = await res.json();
    // Expecting array of strings, but keep defensive
    return json;
}


export async function callDrawApi(roomsCsv: string) {
    const date = todayDateISO();
    const res = await fetch(DRAW_URL + `?location=MIDA&rooms=${encodeURIComponent(roomsCsv)}&drawDate=${encodeURIComponent(date)}`);
    // Some servers expect POST; if your backend expects POST change accordingly.
    if (!res.ok) throw new Error('Draw API failed');
    const json = await res.json();
    return json; // expected { rooms:string, time: string, hole: string }
}