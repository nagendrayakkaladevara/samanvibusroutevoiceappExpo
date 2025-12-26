import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Play, Pause, Volume2, ChevronDown, ChevronRight, Folder } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { busRoutes } from '../data/busRoutes';
import { BusStop } from '../types/routes';
import { audioAssets } from './audioAssets';
import { isEmoji } from './(tabs)';

export default function RouteDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentPlayingStop, setCurrentPlayingStop] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const routeNumber = params.routeNumber as string;
  const routeName = params.routeName as string;

  // Find the route from the data instead of using params
  const route = busRoutes.find(r => r.routeNumber === routeNumber && r.routeName === routeName);
  const stops: BusStop[] = route?.stops || [];

  useEffect(() => {
    // Set up audio mode when component mounts
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error setting up audio mode:', error);
      }
    };

    setupAudio();

    // Cleanup function
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const toggleFolder = (stopId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(stopId)) {
      newExpanded.delete(stopId);
    } else {
      newExpanded.add(stopId);
    }
    setExpandedFolders(newExpanded);
  };

  const playStopAudio = async (stop: BusStop, index: number) => {
    // If it's a folder, toggle it instead of playing
    if (stop.isFolder) {
      toggleFolder(stop.id);
      return;
    }

    try {
      // Stop current audio if playing
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      if (currentPlayingStop === stop.id) {
        setCurrentPlayingStop(null);
        return;
      }

      setIsLoading(true);
      setCurrentPlayingStop(stop.id);

      // Extract just the filename from stop.audioFile (handles both full path and filename)
      const audioFileName = stop.audioFile.split('/').pop();
      if (!audioFileName) {
        throw new Error(`Invalid audio file name for stop: ${stop.name}`);
      }
      const audioSource = audioAssets[audioFileName];
      if (!audioSource) {
        throw new Error(`Audio file not found in assets: ${audioFileName}`);
      }

      // Load the audio file from assets
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true }
      );

      setSound(newSound);

      // Set up event listeners
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setCurrentPlayingStop(null);
          setSound(null);
        }
      });

      setIsLoading(false);

    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
      setCurrentPlayingStop(null);
      Alert.alert('Error', `Failed to play audio for ${stop.name}. Please try again.`);
    }
  };

  const renderStop = (stop: BusStop, index: number, isChild: boolean = false) => {
    const isExpanded = expandedFolders.has(stop.id);
    const hasChildren = stop.isFolder && stop.children && stop.children.length > 0;
    const childCount = stop.isFolder ? (stop.children?.length || 0) : 0;

    return (
      <View key={stop.id}>
        <TouchableOpacity
          style={[
            styles.stopCard,
            isChild && styles.childCard,
            currentPlayingStop === stop.id && !stop.isFolder && styles.stopCardActive,
            stop.isFolder && styles.folderCard
          ]}
          onPress={() => playStopAudio(stop, index)}
          activeOpacity={0.8}
          disabled={isLoading && !stop.isFolder}
        >
          <View style={styles.stopHeader}>
            <View style={[
              styles.stopNumberContainer,
              stop.isFolder && styles.folderIconContainer
            ]}>
              {stop.isFolder ? (
                <Folder size={22} color="#ffffff" />
              ) : (
                <Text style={styles.stopNumber}>{index + 1}</Text>
              )}
            </View>
            <View style={styles.stopInfo}>
              <Text style={[
                styles.stopName,
                stop.isFolder && styles.folderName
              ]}>
                {stop.name}
              </Text>
              {stop.isFolder && (
                <Text style={styles.folderCount}>
                  {childCount > 0 ? `${childCount} item${childCount !== 1 ? 's' : ''}` : 'Folder'}
                </Text>
              )}
            </View>
            {stop.isFolder ? (
              <View style={styles.folderIcon}>
                {isExpanded ? (
                  <ChevronDown size={20} color="#000000" />
                ) : (
                  <ChevronRight size={20} color="#000000" />
                )}
              </View>
            ) : (
              <View style={styles.playButton}>
                {currentPlayingStop === stop.id ? (
                  <Pause size={20} color="#000000" />
                ) : (
                  <Play size={20} color="#000000" />
                )}
              </View>
            )}
          </View>

          {currentPlayingStop === stop.id && !stop.isFolder && (
            <View style={styles.playingIndicator}>
              <Volume2 size={16} color="#000000" />
              <Text style={styles.playingText}>
                {isLoading ? 'Loading audio...' : 'Playing announcement...'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {stop.isFolder && isExpanded && (
          <View style={styles.childrenContainer}>
            {hasChildren ? (
              stop.children!.map((child, childIndex) => 
                renderStop(child, childIndex, true)
              )
            ) : (
              <View style={styles.emptyFolderContainer}>
                <Text style={styles.emptyFolderText}>No items in this folder</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const handleBack = () => {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
    }
    router.back();
  };

  if (!route) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.routeNumber}>Route {routeNumber}</Text>
            <Text style={styles.routeName}>{routeName}</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Route not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.routeNumber}>{routeName}</Text>
          {!isEmoji(routeNumber) && <Text style={styles.routeName}>{routeNumber}</Text>}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.stopsContainer}>
          <Text style={styles.stopsTitle}>{routeName === "Quick Actions" ? 'Actions' : 'Bus stops'}</Text>
          <Text style={styles.stopsSubtitle}>Tap any {routeName === "Quick Actions" ? 'action' : 'stop'} to hear the announcement</Text>

          <View style={styles.stopsList}>
            {stops.map((stop: BusStop, index: number) => renderStop(stop, index))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  routeNumber: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 2,
    // paddingTop: 40,
  },
  routeName: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    backgroundColor:'#F2F2F2'
  },
  stopsContainer: {
    padding: 16,
  },
  stopsTitle: {
    fontFamily: 'sans-serif',
    fontSize: 24,
    color: '#070707',
    marginBottom: 4,
    textAlign: 'center',
  },
  stopsSubtitle: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16,
    color: '#070707',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  stopsList: {
    gap: 12,
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stopCardActive: {
    backgroundColor: '#fcd36a',
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopNumberContainer: {
    backgroundColor: '#000000',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumber: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 16,
    color: '#ffffff',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#070707',
    marginBottom: 2,
  },
  stopCode: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  playButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    opacity: 0.7,
  },
  playingText: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 24,
  },
  folderCard: {
    backgroundColor: '#e8e8e8',
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
  },
  childCard: {
    marginTop: 10,
    marginLeft: 20,
    backgroundColor: '#fafafa',
  },
  childrenContainer: {
    marginTop: 8,
    marginLeft: 16,
  },
  folderIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderIconContainer: {
    backgroundColor: '#4a90e2',
  },
  folderName: {
    fontWeight: '600',
  },
  folderCount: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 12,
    color: '#070707',
    opacity: 0.6,
    marginTop: 2,
  },
  emptyFolderContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  emptyFolderText: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 14,
    color: '#070707',
    opacity: 0.5,
    fontStyle: 'italic',
  },
});