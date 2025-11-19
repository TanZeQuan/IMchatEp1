import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// 👉 API
import { sendOTP, verifyOTP, resetPassword } from '../api/UserApi';

const ForgetPasswordScreen: React.FC = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // ===========================
    // 发送验证码
    // ===========================
    const handleSendCode = async () => {
        if (!email) {
            Alert.alert("提示", "请输入邮箱地址");
            return;
        }

        try {
            await sendOTP({ email });
            Alert.alert("验证码已发送", "请检查您的邮箱");

            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err: any) {
            Alert.alert("发送失败", err?.message || "请稍后再试");
        }
    };

    // ===========================
    // 提交密码重置
    // ===========================
    const handleSubmit = async () => {
        if (!email || !verificationCode || !newPassword || !confirmPassword) {
            Alert.alert("提示", "请填写完整信息");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("错误", "两次密码不一致");
            return;
        }

        try {
            // 1️⃣ 验证 OTP
            await verifyOTP({ email, otp: verificationCode });

            // 2️⃣ 重设密码
            await resetPassword({
                password: newPassword,
            });

            Alert.alert("成功", "密码已重设，请返回登录", [
                { text: "确定", onPress: () => navigation.goBack() }
            ]);

        } catch (err: any) {
            Alert.alert("失败", err?.message || "请稍后再试");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>找回密码</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>

                {/* 邮箱 */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入邮箱地址"
                        placeholderTextColor="#B8B8B8"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* 验证码 + 按钮 */}
                <View style={styles.verificationRow}>
                    <View style={[styles.inputContainer, styles.verificationInput]}>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入验证码"
                            placeholderTextColor="#B8B8B8"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="number-pad"
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendCodeButton,
                            countdown > 0 && styles.sendCodeButtonDisabled,
                        ]}
                        disabled={countdown > 0}
                        onPress={handleSendCode}
                    >
                        <Text style={styles.sendCodeButtonText}>
                            {countdown > 0 ? `${countdown}s` : '发送验证码'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 新密码 */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入新密码"
                        placeholderTextColor="#B8B8B8"
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                        <Ionicons
                            name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={22}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

                {/* 确认密码 */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="请确认密码"
                        placeholderTextColor="#B8B8B8"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={22}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

                {/* 按钮 */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>提交</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5E6B3' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F5D76E',
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '600', color: '#333' },
    placeholder: { width: 40 },
    content: { paddingHorizontal: 20, paddingTop: 32 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 18,
        height: 50,
    },
    input: { flex: 1, fontSize: 15, color: '#333' },
    eyeIcon: { padding: 8 },
    verificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 12,
    },
    verificationInput: { flex: 1 },
    sendCodeButton: {
        backgroundColor: '#F5D76E',
        borderRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 15,
        minWidth: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendCodeButtonDisabled: { backgroundColor: '#E8DCA8', opacity: 0.6 },
    sendCodeButtonText: { color: '#D32F2F', fontWeight: '600' },
    submitButton: {
        marginTop: 10,
        backgroundColor: '#F5D76E',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
    },
    submitButtonText: { fontSize: 17, fontWeight: '600', color: '#333' },
});

export default ForgetPasswordScreen;
