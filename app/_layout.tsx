import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'roomselectscreen',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='index' options={{title:'', headerStyle: {backgroundColor: '#060'}}} />
        <Stack.Screen name='chooseroom' options={{title:'객실 번호를 선택하세요', headerStyle: {backgroundColor: '#060'}}} />
        <Stack.Screen name='choosefriend' options={{title:'친구들과 놀아요?', headerStyle: {backgroundColor: '#060'}}} />
        <Stack.Screen name='result' options={{title:'결과 화면', headerStyle: {backgroundColor: '#060'}}} />
        <Stack.Screen name='resultexisting' options={{title:'결과 화면', headerStyle: {backgroundColor: '#060'}}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
