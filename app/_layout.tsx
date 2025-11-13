import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { STORAGE_KEYS } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchInfo } from '@/lib/utilities';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';

export const unstable_settings = {
  anchor: 'roomselectscreen',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [contactUrl, setContactUrl] = useState("");

  useEffect(() => {
    (
      async () => {
        const response = await fetchInfo();
        if (response.ok) {
          const responseData = await response.json();
          setContactUrl(responseData?.data?.info.contactUrl);
          await AsyncStorage.setItem(STORAGE_KEYS.CONTACT_USER_LINK, responseData?.data?.info.contactUrl)
        }
      }
    )();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='index' options={{ title: '', headerShown: false }} />
        <Stack.Screen name='chooseroom' options={{ title: '객실 번호를 선택하세요', headerTransparent: true, headerStyle: { backgroundColor: '#000' }, headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => Alert.alert('도움이 필요하신가요?', '"카카오톡"을 통해 고객 지원팀에 문의하실 수 있습니다.',
                [
                  { text: "Contact Support", onPress: () => Linking.openURL(contactUrl) },
                  { text: "Cancel", style: "cancel" },
                ])}
            >
              <Ionicons name="help-circle" size={24} color="#fff" />
            </TouchableOpacity>
          ), }} />
        <Stack.Screen name='choosefriend' options={{ title: '친구들과 놀아요?', headerTransparent: true, headerStyle: { backgroundColor: '#000' }, headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => Alert.alert('도움이 필요하신가요?', '"카카오톡"을 통해 고객 지원팀에 문의하실 수 있습니다.',
                [
                  { text: "Contact Support", onPress: () => Linking.openURL(contactUrl) },
                  { text: "Cancel", style: "cancel" },
                ])}
            >
              <Ionicons name="help-circle" size={24} color="#fff" />
            </TouchableOpacity>
          ), }} />
        <Stack.Screen name='result' options={{ title: '결과 화면', headerTransparent: true, headerStyle: { backgroundColor: '#000' }, headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => Alert.alert('도움이 필요하신가요?', '"카카오톡"을 통해 고객 지원팀에 문의하실 수 있습니다.',
                [
                  { text: "Contact Support", onPress: () => Linking.openURL(contactUrl) },
                  { text: "Cancel", style: "cancel" },
                ])}
            >
              <Ionicons name="help-circle" size={24} color="#fff" />
            </TouchableOpacity>
          ), }} />
        <Stack.Screen name='chooselocation' options={{
          title: '골프 클럽', headerTransparent: true, headerStyle: { backgroundColor: '#000' }, headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => Alert.alert('도움이 필요하신가요?', '"카카오톡"을 통해 고객 지원팀에 문의하실 수 있습니다.',
                [
                  { text: "Contact Support", onPress: () => Linking.openURL(contactUrl) },
                  { text: "Cancel", style: "cancel" },
                ])}
            >
              <Ionicons name="help-circle" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }} />
        <Stack.Screen name='authenticate' options={{ title: '장치 인증', headerTransparent: true, headerStyle: { backgroundColor: '#000' }, headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => Alert.alert('도움이 필요하신가요?', '"카카오톡"을 통해 고객 지원팀에 문의하실 수 있습니다.',
                [
                  { text: "Contact Support", onPress: () => Linking.openURL(contactUrl) },
                  { text: "Cancel", style: "cancel" },
                ])}
            >
              <Ionicons name="help-circle" size={24} color="#fff" />
            </TouchableOpacity>
          ), }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
