import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import Storage from '../store/userStorage';
import { ActivityIndicator, View } from 'react-native';

const AppNavigator = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const id = await Storage.getUserId();

        if (id) {
          // 如果有登录的用户
          setUserToken(id);
        } else {
          // 没有登录
          setUserToken(null);
        }
      } catch (err) {
        console.log("Load user error:", err);
      } finally {
        setLoading(false); // 🌟 最重要的
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? (
        <MainStack setUserToken={setUserToken} />
      ) : (
        <AuthStack setUserToken={setUserToken} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
