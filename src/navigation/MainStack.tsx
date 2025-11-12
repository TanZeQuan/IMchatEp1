import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTab from './MainTab';
import ChatScreen from '../screens/ChatScreen';
import SettingScreen from '../screens/SettingScreen';

export type MainStackParamList = {
  Home: undefined;
  Chat: { chatName: string };
  Setting: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MainTab} options={{ headerShown: false }} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: false,
          title: route.params?.chatName || 'Chat',
        })}
      />
      <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
