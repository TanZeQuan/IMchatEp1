import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors } from '../styles';

interface VoiceMessageProps {
  uri: string;
}

export default function VoiceMessage({ uri }: VoiceMessageProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function playSound() {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
      return;
    }

    const { sound: newSound, status } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);

    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  function onPlaybackStatusUpdate(status: Audio.AVPlaybackStatus) {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        sound?.setPositionAsync(0);
      }
    }
  }

  function formatTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={isPlaying ? pauseSound : playSound}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={colors.text.black} />
      </TouchableOpacity>
      <Text>{formatTime(position)} / {formatTime(duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginRight: 10,
  },
});

