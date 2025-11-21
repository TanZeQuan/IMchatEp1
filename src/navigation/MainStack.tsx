import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTab from './MainTab';
import ChatScreen from '../screens/ChatScreen';
import SettingScreen from '../screens/SettingScreen';
import SettingProfile from '../screens/SettingProfile';
import ResetPassword from '../screens/ResetPassword';
import Notification from '../screens/Notification';
import CreateMeeting from '../screens/CreateMeeting';
import JoinMeeting from '../screens/JoinMeeting';
import MeetingScreen from '../screens/MeetingScreen';
import EditName from '../screens/EditName';
import EditPhone from '../screens/EditPhone';
import QRScan from '../screens/QRScreen';
import ResetEmail from '../screens/ResetEmail';
import AddFriend from '../screens/AddFriend';
import FriendReq from '../screens/FriendReq';

export type MainStackParamList = {
  Home: undefined;
  Chat: { chatName: string };
  Setting: undefined;
  SettingProfile: undefined;
  ResetPassword: undefined;
  Notification: undefined;
  CreateMeeting: undefined;
  JoinMeeting: undefined;
  MeetingScreen: undefined;
  EditName: undefined;
  EditPhone: undefined;
  QRScan: undefined;
  ResetEmail: undefined;
  AddFriend:undefined;
  FriendReq:undefined;
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
      <Stack.Screen name="SettingProfile" component={SettingProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
      <Stack.Screen name="CreateMeeting" component={CreateMeeting} options={{ headerShown: false }} />
      <Stack.Screen name="JoinMeeting" component={JoinMeeting} options={{ headerShown: false }} />
      <Stack.Screen name="MeetingScreen" component={MeetingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditName" component={EditName} options={{ headerShown: false }} />
      <Stack.Screen name="EditPhone" component={EditPhone} options={{ headerShown: false }} />
      <Stack.Screen name="QRScan" component={QRScan} options={{ headerShown: false }} />
      <Stack.Screen name="ResetEmail" component={ResetEmail} options={{ headerShown: false }} />
      <Stack.Screen name="AddFriend" component={AddFriend} options={{ headerShown: false }} />
      <Stack.Screen name="FriendReq" component={FriendReq} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
