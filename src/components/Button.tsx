import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import responsive from '../utils/responsive';
import { colors, borders, typography } from '../styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

const Button = ({ title, onPress, disabled, isLoading, style }: ButtonProps) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[
        styles.loginButtonWrapper,
        isButtonDisabled && styles.disabledButton,
        style,
      ]}
    >
      <LinearGradient
        colors={colors.background.gradientWhite}
        style={styles.loginButtonGradient}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? '加载中...' : title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButtonWrapper: {
    width: '100%',
    height: responsive.h(55),
    borderRadius: responsive.w(borders.radius30),
    shadowColor: colors.shadow.blue,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: responsive.h(10),
    overflow: 'hidden',
  },
  loginButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsive.w(borders.radius30),
    borderWidth: borders.width1,
    borderColor: colors.border.white,
  },
  loginButtonText: {
    color: colors.text.blackMedium,
    fontSize: responsive.f(typography.fontSize16),
    fontWeight: typography.fontWeightBold,
  },
  disabledButton: { opacity: 0.6 },
});

export default Button;
