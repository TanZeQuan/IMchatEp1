import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import responsive from '../utils/responsive';
import { colors, borders, typography } from '../styles';

interface InputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconOnPress?: () => void;
  containerStyle?: object;
}

const Input = ({
  icon,
  iconOnPress,
  containerStyle,
  style,
  ...props
}: InputProps) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <TextInput
        style={[styles.inputField, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {icon && (
        <TouchableOpacity onPress={iconOnPress}>
          <Ionicons
            name={icon}
            size={responsive.f(22)}
            color="#888"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: responsive.h(55),
    backgroundColor: colors.background.white,
    borderRadius: responsive.w(borders.radius30),
    marginBottom: responsive.h(20),
    paddingHorizontal: responsive.s(20),
    shadowColor: colors.shadow.blue,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputField: {
    flex: 1,
    fontSize: responsive.f(typography.fontSize16),
    color: colors.text.blackMedium,
    height: '100%',
  },
  icon: { marginLeft: responsive.w(10) },
});

export default Input;
