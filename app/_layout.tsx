import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { 
  Fredoka_400Regular, 
  Fredoka_700Bold 
} from '@expo-google-fonts/fredoka';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Dynamically import volume manager to handle cases where it's not available
let VolumeManager: any = null;
try {
  VolumeManager = require('react-native-volume-manager');
} catch (error) {
  console.log('Volume manager not available:', error);
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Fredoka-Regular': Fredoka_400Regular,
    'Fredoka-Bold': Fredoka_700Bold,
  });

  // Set silent mode and media volume when app starts
  useEffect(() => {
    const setupAudioSettings = async () => {
      if (!VolumeManager) {
        console.log('Volume manager not available');
        return;
      }

      try {
        // Set device to silent mode (Android only - iOS doesn't allow this)
        if (Platform.OS === 'android') {
          try {
            // Try using the named export format
            if (VolumeManager.setRingerMode) {
              await VolumeManager.setRingerMode(VolumeManager.RINGER_MODE?.silent || 'silent');
            } else if (VolumeManager.default?.setRingerMode) {
              await VolumeManager.default.setRingerMode(VolumeManager.default.RINGER_MODE?.silent || 'silent');
            }
          } catch (error) {
            console.log('Could not set ringer mode:', error);
          }
        }
        
        // Set media volume to 60% (0.6)
        try {
          if (VolumeManager.setVolume) {
            await VolumeManager.setVolume(0.6, {
              showUI: false, // Don't show native volume UI
            });
          } else if (VolumeManager.default?.setVolume) {
            await VolumeManager.default.setVolume(0.6, {
              showUI: false,
            });
          }
        } catch (error) {
          console.log('Could not set volume:', error);
        }
      } catch (error) {
        // Silently handle errors (e.g., if permissions are not granted)
        console.log('Audio settings setup error:', error);
      }
    };

    // Run after a short delay to ensure app is fully initialized
    const timer = setTimeout(() => {
      setupAudioSettings();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}