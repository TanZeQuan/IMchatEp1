import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import responsive from '../utils/responsive';
import { colors } from '../styles';

interface AvatarProps {
  uri: string | null;
  size?: number;
  onPress?: () => void;
  showEditButton?: boolean;
}

const Avatar = ({
  uri,
  size = responsive.w(60),
  onPress,
  showEditButton = false,
}: AvatarProps) => {
  const imageSize = { width: size, height: size };
  const borderRadius = responsive.w(10); // Maintain the border radius from original design

  return (
    <TouchableOpacity
      style={[styles.avatarContainer, imageSize]}
      onPress={onPress}
      disabled={!onPress}
    >
      {uri ? (
        <Image source={{ uri }} style={[styles.avatar, imageSize, { borderRadius }]} />
      ) : (
        <View style={[styles.avatarPlaceholder, imageSize, { borderRadius }]}>
          <Ionicons name="person" size={size * 0.6} color={colors.text.white} />
        </View>
      )}
      {showEditButton && (
        <View style={styles.cameraOverlay}>
          <Ionicons name="camera" size={size * 0.2} color={colors.text.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.functional.avatarPlaceholder,
  },
  avatarPlaceholder: {
    backgroundColor: colors.functional.avatarGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: responsive.w(18),
    height: responsive.w(18),
    borderRadius: responsive.w(9),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});

export default Avatar;
