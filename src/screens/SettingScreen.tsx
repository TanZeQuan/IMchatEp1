import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting Screen</Text>
      {/* Add your setting options here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SettingScreen;
