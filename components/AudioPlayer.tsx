import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, Volume2 } from 'lucide-react-native';

interface AudioPlayerProps {
  stopName: string;
  stopIndex: number;
  isPlaying: boolean;
  onPlayStatusChange: (isPlaying: boolean) => void;
}

export default function AudioPlayer({ 
  stopName, 
  stopIndex, 
  isPlaying, 
  onPlayStatusChange 
}: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          onPlayStatusChange(false);
        } else {
          await sound.playAsync();
          onPlayStatusChange(true);
        }
        return;
      }

      // In a real app, you would load the actual audio file
      // const audioUri = `./assets/audio/route1_stop${stopIndex + 1}.mp3`;
      
      // For demo purposes, we'll simulate audio playback
      const announcement = `Next stop: ${stopName}. Please prepare to exit.`;
      
      Alert.alert(
        'Audio Announcement',
        announcement,
        [
          { 
            text: 'OK', 
            onPress: () => onPlayStatusChange(false) 
          }
        ]
      );

      // Simulate audio playback
      onPlayStatusChange(true);
      setTimeout(() => {
        onPlayStatusChange(false);
      }, 3000);

    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio announcement');
      onPlayStatusChange(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.audioButton}
      onPress={playAudio}
      activeOpacity={0.8}
    >
      {isPlaying ? (
        <Pause size={20} color="#000000" />
      ) : (
        <Play size={20} color="#000000" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  audioButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});