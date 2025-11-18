import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // ✅ Navigation hook

const ForgetPasswordScreen: React.FC = () => {
    const navigation = useNavigation(); // ✅ Get navigation instance

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleSendCode = () => {
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
    };

    const handleSubmit = () => {
        console.log('Password reset submitted');
    };

    const handleGoBack = () => {
        navigation.goBack(); // ✅ Navigate back
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>找回密码</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入邮箱地址"
                        placeholderTextColor="#B8B8B8"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.verificationRow}>
                    <View style={[styles.inputContainer, styles.verificationInput]}>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入短信验证码"
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
                        onPress={handleSendCode}
                        disabled={countdown > 0}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sendCodeButtonText}>
                            {countdown > 0 ? `${countdown}s` : '发送验证码'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入密码"
                        placeholderTextColor="#B8B8B8"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        activeOpacity={0.6}
                    >
                        <Ionicons
                            name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={22}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="请确认密码"
                        placeholderTextColor="#B8B8B8"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        activeOpacity={0.6}
                    >
                        <Ionicons
                            name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={22}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                >
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
        height: 52,
    },
    input: { flex: 1, fontSize: 15, color: '#333' },
    eyeIcon: { padding: 8, marginRight: -4 },
    verificationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
    verificationInput: { flex: 1, marginBottom: 0 },
    sendCodeButton: {
        backgroundColor: '#F5D76E',
        borderRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
    },
    sendCodeButtonDisabled: { backgroundColor: '#E8DCA8', opacity: 0.6 },
    sendCodeButtonText: { fontSize: 14, fontWeight: '600', color: '#D32F2F' },
    submitButton: {
        backgroundColor: '#F5D76E',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    submitButtonText: { fontSize: 17, fontWeight: '600', color: '#333' },
});

export default ForgetPasswordScreen;