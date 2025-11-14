import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const QRCodeLayout: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'myQR' | 'scan'>('myQR');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* ⬅️ Back + Tabs Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myQR' && styles.activeTab]}
            onPress={() => setActiveTab('myQR')}
          >
            <Text style={styles.tabText}>我的二维码</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
            onPress={() => setActiveTab('scan')}
          >
            <Text style={styles.tabText}>
              {activeTab === 'scan' ? 'QR Scan' : '扫描二维码'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'myQR' ? (
          // My QR Code Panel
          <View style={styles.qrPanel}>
            <View style={styles.qrCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
              </View>

              <View style={styles.qrCodePlaceholder}>
                <Text style={styles.qrText}>QR CODE</Text>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="id-card-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>名片</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="download-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>下载/保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Scan Panel
          <View style={styles.scanPanel}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanHint}>请将二维码放于框中央</Text>

            {/* Bottom Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="flashlight-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>我的二维码</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="image-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>相册</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  /* Header row: Back + Tabs */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabRow: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#5a5a5a',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },

  activeTab: {
    backgroundColor: '#6a6a6a',
    borderBottomColor: '#FFE08A',
  },

  tabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },

  contentContainer: {
    flex: 1,
  },

  qrPanel: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },

  qrCard: {
    width: width * 0.6,
    aspectRatio: 0.7,
    backgroundColor: '#F4D03F',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e0e0',
  },

  qrCodePlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qrText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },

  scanPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },

  scanArea: {
    width: width * 0.65,
    aspectRatio: 1,
    position: 'relative',
    marginBottom: 20,
  },

  corner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: '#fff',
    borderWidth: 4,
  },

  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  scanHint: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 40,
  },

  actionButton: {
    alignItems: 'center',
  },

  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  actionLabel: {
    color: '#fff',
    fontSize: 12,
  },
});

export default QRCodeLayout;
