import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

const AppNavigator = () => {
  const { userToken } = useUserStore();

  return (
    <NavigationContainer>
      {userToken ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
