import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bus, ChevronRight, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  stops: string[];
}

import { busRoutes } from '../../data/busRoutes';

// Transform the imported data to match the expected interface
const transformedBusRoutes: BusRoute[] = busRoutes.map(route => ({
  id: route.id,
  routeNumber: route.routeNumber,
  routeName: route.routeName,
  stops: route.stops.map(stop => stop.name) // Extract just the stop names
}));

export const isEmoji = (value: string): boolean => {
  const emojiRegex = /[\u{1F300}-\u{1FAFF}]/u;
  return emojiRegex.test(value);
};

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');


  // Also check login status when screen comes into focus (e.g., after logout from settings)
  useFocusEffect(
    React.useCallback(() => {
      checkLoginSession();
    }, [])
  );

  const checkLoginSession = async () => {
    try {
      const loginData = await AsyncStorage.getItem('userLoginData');
      if (loginData) {
        const { expirationTime, userData } = JSON.parse(loginData);
        const currentTime = new Date().getTime();
        
        if (currentTime < expirationTime) {
          // Login is still valid
          setIsLoggedIn(true);
          console.log('Auto-login successful:', userData);
        } else {
          // Login expired, clear stored data
          await AsyncStorage.removeItem('userLoginData');
        }
      }
    } catch (error) {
      console.error('Error checking login session:', error);
    }
  };

  const saveLoginData = async (userData: any) => {
    try {
      const expirationTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 2 days from now
      const loginData = {
        userData,
        expirationTime,
      };
      await AsyncStorage.setItem('userLoginData', JSON.stringify(loginData));
    } catch (error) {
      console.error('Error saving login data:', error);
    }
  };

  const clearLoginData = async () => {
    try {
      await AsyncStorage.removeItem('userLoginData');
    } catch (error) {
      console.error('Error clearing login data:', error);
    }
  };

  const handleLogout = async () => {
    await clearLoginData();
    setIsLoggedIn(false);
    setMessage('');
    setMessageType('');
  };

  const handleRoutePress = (route: BusRoute) => {
    router.push({
      pathname: '/route-details',
      params: {
        routeNumber: route.routeNumber,
        routeName: route.routeName
      }
    });
  };

  const handleLogin = async () => {
    // Simple validation
    if (!username.trim() || !password.trim()) {
      setMessage('Please enter both username and password');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('https://samanvi-backend.vercel.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Login successful
        setMessage('Login successful! Welcome back.');
        setMessageType('success');
        
        // Save login data for 2 days
        await saveLoginData(data.user);
        
        setTimeout(() => {
          // Clear the form
          setUsername('');
          setPassword('');
          setMessage('');
          setMessageType('');
        }, 5500); // Show success message for 4.5 seconds
        setIsLoggedIn(true);
        console.log('Login successful:', data.user);
      } else {
        // Login failed
        setMessage(data.message || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/samv_logo.png')}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>Bus Routes</Text>
        {message ? (
          <View style={[styles.messageContainer, messageType === 'success' ? styles.successMessage : styles.errorMessage]}>
            <Text style={[styles.messageText, messageType === 'success' ? styles.successText : styles.errorText]}>
              {message}
            </Text>
          </View>
        ) : null}
        {isLoggedIn ? (
          <>
            <Text style={styles.headerSubtitle}>Choose your route</Text>
          </>
        ) : null}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoggedIn ? (
          <>
            <View style={styles.routesList}>
              {transformedBusRoutes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={styles.routeCard}
                  onPress={() => handleRoutePress(route)}
                  activeOpacity={0.8}
                >
                  <View style={styles.routeHeader}>
                    <View style={styles.routeNumberContainer}>
                      <Text
                        style={[
                          styles.routeNumber,
                          isEmoji(route.routeNumber) && styles.emojiRouteNumber
                        ]}
                      >
                        {route.routeNumber}
                      </Text>
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeName}>{route.routeName}</Text>
                      <Text style={styles.stopsCount}>{route.stops.length} {route.routeName === 'Quick Actions' ? 'actions' : 'stops'}</Text>
                    </View>
                    <ChevronRight size={24} color="#000000" />
                  </View>

                  <View style={styles.routeIcon}>
                    <Bus size={20} color="#000000" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (<>
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Welcome</Text>
            <Text style={styles.loginSubtitle}>Please sign in to continue</Text>


            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#666"
              editable={!isLoading}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {!showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </>)}
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
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerImage: {
    width: 180,
    height: 50,
    alignSelf: 'center',
    // marginBottom: 16,
    resizeMode: 'contain',
  },
  headerTitle: {
    // fontFamily: 'Inter_300Light',
    fontFamily: 'sans-serif',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  routesList: {
    padding: 16,
    gap: 16,
  },
  routeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeNumberContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
    width: 120,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeNumber: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#000000',
    fontWeight: 600
  },
  emojiRouteNumber: {
    fontSize: 32,
    lineHeight: 36,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontFamily: 'sans-serif',
    fontSize: 15,
    color: '#070707',
    marginBottom: 2,
  },
  stopsCount: {
    fontFamily: 'Fredoka-Regular',
    fontSize: 14,
    color: '#070707',
    opacity: 0.8,
  },
  routeIcon: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    opacity: 0.3,
  },
  loginContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTitle: {
    fontFamily: 'sans-serif',
    fontSize: 24,
    color: '#070707',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: '#070707',
    opacity: 0.8,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#070707',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#070707',
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  messageContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    borderColor: '#a5d6a7',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
    borderWidth: 1,
  },
  messageText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
  },
  successText: {
    color: '#2e7d32',
  },
  errorText: {
    color: '#d32f2f',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
});