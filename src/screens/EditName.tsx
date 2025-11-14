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
import { useNavigation } from '@react-navigation/native'; // ✅ import navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStack'; // adjust path

const ResetNameScreen: React.FC = () => {
    const [name, setName] = useState('Mym');
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const handleGoBack = () => {
        navigation.goBack(); // ✅ navigate back
    };

    const handleClearName = () => {
        setName('');
    };

    const handleConfirm = () => {
        if (!name.trim()) {
            alert('请输入名字');
            return;
        }
        console.log('Name updated:', name);
        handleGoBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>名字</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="请输入名字"
                        placeholderTextColor="#B8B8B8"
                    />
                    {name.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearName}
                            activeOpacity={0.6}
                        >
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                >
                    <Text style={styles.confirmButtonText}>确认更改</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5E6B3' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#F5D76E' },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '600', color: '#333' },
    placeholder: { width: 40 },
    content: { paddingHorizontal: 16, paddingTop: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 30, paddingHorizontal: 20, height: 52, marginBottom: 24 },
    input: { flex: 1, fontSize: 15, color: '#333' },
    clearButton: { padding: 4, marginLeft: 8 },
    confirmButton: { backgroundColor: '#F5D76E', borderRadius: 30, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
    confirmButtonText: { fontSize: 17, fontWeight: '600', color: '#333' },
});

export default ResetNameScreen;
