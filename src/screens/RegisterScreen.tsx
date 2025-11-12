import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface FormData {
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegister = () => {
    if (!agreedToTerms) {
      Alert.alert('提示', '请同意隐私政策和服务协议');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('提示', '两次密码输入不一致');
      return;
    }
    console.log('注册信息:', formData);
    // TODO: Add registration API call here
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCard}>
          <Image 
            source={require('../../assets/images/sentalk-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>注册</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Phone Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="请输入电话号/手机号码"
            placeholderTextColor="#999"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="请输入密码"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            style={[styles.input, styles.inputWithIcon]}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="请再次确认密码"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            secureTextEntry={!showConfirmPassword}
            style={[styles.input, styles.inputWithIcon]}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>注册</Text>
        </TouchableOpacity>

        {/* Terms Checkbox */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <Ionicons
              name={agreedToTerms ? 'checkbox' : 'square-outline'}
              size={20}
              color={agreedToTerms ? '#E8C66A' : '#999'}
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            我已阅读并同意{' '}
            <Text style={styles.termsLink}>《隐私政策和服务协议》</Text>
          </Text>
        </View>

        {/* Already Registered Link */}
        <TouchableOpacity
          style={styles.loginLinkContainer}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.loginLink}>已有账号？返回登录</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCard: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 50,
    fontSize: 14,
    color: '#333',
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  registerButton: {
    backgroundColor: '#E8C66A',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  checkbox: {
    marginRight: 8,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#3B82F6',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLink: {
    fontSize: 14,
    color: '#666',
  },
});
