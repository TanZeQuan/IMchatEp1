// src/navigation/MainTab.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native'; // ✅ 导入 Image
import MessageScreen from '../screens/MessageScreen';
import ContactScreen from '../screens/ContactScreen';
import ProfileScreen from '../screens/ProfileScreen';

const messageIcon = require('../../assets/images/chat.png'); 
const contactIcon = require('../../assets/images/contact.png');
const profileIcon = require('../../assets/images/user.png');

const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000ff',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FFD860',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 8,
          paddingTop: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          tabBarLabel: '消息',
          tabBarIcon: ({ focused }) => (
            <Image
              source={messageIcon}
              style={{
                width: 30,
                height: 30,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarLabel: '通讯录',
          tabBarIcon: ({ focused }) => (
            <Image
              source={contactIcon}
              style={{
                width: 30,
                height: 30,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ focused }) => (
            <Image
              source={profileIcon}
              style={{
                width: 30,
                height: 30,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
