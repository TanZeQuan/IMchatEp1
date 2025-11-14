import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStack'; // adjust the path if needed

interface MeetingItemProps {
    icon: string;
    label: string;
    onPress: () => void;
}

const MeetingItem: React.FC<MeetingItemProps> = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.label}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
);

const MeetingScreen: React.FC = () => {
    // ✅ Typed navigation
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleJoinMeeting = () => {
        navigation.navigate('JoinMeeting');
    };

    const handleCreateMeeting = () => {
        navigation.navigate('CreateMeeting');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>会议</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Meeting Items */}
            <View style={styles.content}>
                <MeetingItem
                    icon="enter-outline"
                    label="加入会议"
                    onPress={handleJoinMeeting}
                />
                <MeetingItem
                    icon="videocam-outline"
                    label="创建会议"
                    onPress={handleCreateMeeting}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5E6B3',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F5D76E',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 16,
        height: 56,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
});

export default MeetingScreen;
