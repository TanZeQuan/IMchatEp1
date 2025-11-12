import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your navigation stack types
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  PrivacyPolicy: undefined;
  MainTab: undefined; // Add this line
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("提示", "请输入用户名/手机号和密码");
      return;
    }
    
    // TODO: Replace with actual API call
    console.log('Login attempt:', { username, password, rememberMe });
    
    // Navigate to Home on successful login
    navigation.navigate('MainTab');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCard}>
          <Image 
            source={require('../../assets/images/sentalk-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>登录</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        
        {/* Username Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="请输入用户名/手机号"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="请输入密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={22} 
              color="#999" 
            />
          </TouchableOpacity>
        </View>

        {/* Links Row */}
        <View style={styles.linksRow}>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.linkText}>注册账号</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>忘记密码？</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>

        {/* Remember Me Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && (
              <Ionicons name="checkmark" size={14} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxText}>
            我已阅读并同意{' '}
            <Text style={styles.linkBlue} onPress={handlePrivacyPolicy}>
              《隐私政策和服务协议》
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5E6B3',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 32,
  },
  logoCard: {
    width: 128,
    height: 128,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 48,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 15,
    color: '#333',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginTop: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#FFD860',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  checkboxText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  linkBlue: {
    color: '#3B82F6',
  },
});