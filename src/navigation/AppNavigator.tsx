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
      const id = await Storage.getUserId();
      if (!id) return;

      const name = await Storage.getUserName(id);
      const avatar = await Storage.getUserAvatar(id);

      setUserId(id);
      if (name) setName(name);
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
      {userToken ? <MainStack setUserToken={setUserToken} /> : <AuthStack setUserToken={setUserToken} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
function setUserId(id: string) {
  throw new Error('Function not implemented.');
}

function setName(name: string) {
  throw new Error('Function not implemented.');
}

