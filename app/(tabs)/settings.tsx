import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Volume2, VolumeX, Info, CircleHelp as HelpCircle, ChevronDown, ChevronUp, Mail, Phone, Globe, MapPin, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when component mounts
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Also check when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    try {
      const loginData = await AsyncStorage.getItem('userLoginData');
      if (loginData) {
        const { expirationTime } = JSON.parse(loginData);
        const currentTime = new Date().getTime();
        
        if (currentTime < expirationTime) {
          // Login is still valid
          setIsLoggedIn(true);
        } else {
          // Login expired
          setIsLoggedIn(false);
          await AsyncStorage.removeItem('userLoginData');
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear login data from AsyncStorage
              await AsyncStorage.removeItem('userLoginData');
              console.log('Login data cleared successfully');
              
              // Navigate back to home screen which will show login form
              router.replace('/');
              console.log('Navigation completed');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAboutPress = () => {
    setShowAbout(!showAbout);
    if (showHelp) setShowHelp(false);
  };

  const handleHelpPress = () => {
    setShowHelp(!showHelp);
    if (showAbout) setShowAbout(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsList}>
          {isLoggedIn && (
            <TouchableOpacity
              style={[styles.settingCard, styles.logoutCard]}
              onPress={() => {
                handleLogout();
              }}
              activeOpacity={0.8}
            >
              <View style={styles.settingHeader}>
                <View style={styles.settingIcon}>
                  <LogOut size={24} color="#d32f2f" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, styles.logoutTitle]}>Logout</Text>
                  <Text style={styles.settingDescription}>Sign out of your account</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => setAudioEnabled(!audioEnabled)}
            activeOpacity={0.8}
          >
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                {audioEnabled ? (
                  <Volume2 size={24} color="#000000" />
                ) : (
                  <VolumeX size={24} color="#000000" />
                )}
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Audio Announcements</Text>
                <Text style={styles.settingDescription}>
                  {audioEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} activeOpacity={0.8} onPress={handleAboutPress}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <Info size={24} color="#000000" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingDescription}>App version & info</Text>
              </View>
              {showAbout ? (
                <ChevronUp size={20} color="#000000" />
              ) : (
                <ChevronDown size={20} color="#000000" />
              )}
            </View>

            {showAbout && (
              <View style={styles.accordionContent}>
                <Text style={styles.aboutTitle}>Bus Route Audio Guide</Text>
                <Text style={styles.aboutVersion}>Version 2.0</Text>

                <View style={styles.aboutDivider} />

                <Text style={styles.aboutDescription}>
                  A comprehensive audio guide for bus routes, providing real-time announcements
                  and information for passengers. This app helps for drivers to play audio announcements for their bus routes. and keep handy bus documents.
                </Text>

                <View style={styles.aboutDivider} />

                <View style={styles.featureList}>
                  <Text style={styles.featureTitle}>Current Features:</Text>
                  <Text style={styles.featureItem}>• Audio announcements for all bus stops</Text>
                  <Text style={styles.featureItem}>• Real-time route information</Text>
                  <Text style={styles.featureItem}>• Easy-to-use interface</Text>
                  <Text style={styles.featureItem}>• Accessibility features</Text>
                  <Text style={styles.featureItem}>• Bus documents access</Text>
                  <Text style={styles.featureItem}>• It will automatically logout every 2 days</Text>
                  <Text style={styles.featureItem}>• Mobile automatically set to silent and media volume set to 60% when app opens</Text>
                </View>

                <View style={styles.aboutDivider} />

                <Text style={styles.copyrightText}>
                  © 2024 Bus Route Audio Guide. All rights reserved.
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} activeOpacity={0.8} onPress={handleHelpPress}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <HelpCircle size={24} color="#000000" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>Get help using the app</Text>
              </View>
              {showHelp ? (
                <ChevronUp size={20} color="#000000" />
              ) : (
                <ChevronDown size={20} color="#000000" />
              )}
            </View>

            {showHelp && (
              <View style={styles.accordionContent}>
                <Text style={styles.helpTitle}>How to Use</Text>

                <View style={styles.helpStep}>
                  <Text style={styles.stepNumber}>1</Text>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Choose Your Route</Text>
                    <Text style={styles.stepDescription}>
                      Select a bus route from the home screen to view all available stops.
                    </Text>
                  </View>
                </View>

                <View style={styles.helpStep}>
                  <Text style={styles.stepNumber}>2</Text>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Listen to Announcements</Text>
                    <Text style={styles.stepDescription}>
                      Tap on any stop to hear the audio announcement for that location.
                    </Text>
                  </View>
                </View>

                <View style={styles.helpStep}>
                  <Text style={styles.stepNumber}>3</Text>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Manage Audio Settings</Text>
                    <Text style={styles.stepDescription}>
                      Enable or disable audio announcements in the settings menu.
                    </Text>
                  </View>
                </View>

                <View style={styles.helpDivider} />

                <Text style={styles.contactTitle}>Contact Support</Text>

                <TouchableOpacity style={styles.contactItem} onPress={() => Alert.alert('Email', 'support@busrouteguide.com')}>
                  <Mail size={20} color="#000000" />
                  <Text style={styles.contactText}>ysainagendra@gmail.com</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={() => Alert.alert('Phone', '+1 (555) 123-4567')}>
                  <Phone size={20} color="#000000" />
                  <Text style={styles.contactText}>+1 (555) 123-4567</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={() => Alert.alert('Website', 'www.busrouteguide.com')}>
                  <Globe size={20} color="#000000" />
                  <Text style={styles.contactText}>http://www.samanvitravels.com</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} onPress={() => Alert.alert('Address', '123 Transit Street, City, State 12345')}>
                  <MapPin size={20} color="#000000" />
                  <Text style={styles.contactText}>Honer IDL Acc Rd, near IDL Lake, Prashanti Nagar, Habeeb Nagar, Moosapet, Hyderabad, Telangana 500072.</Text>
                </TouchableOpacity>

                <View style={styles.helpDivider} />

                <Text style={styles.supportHours}>
                  Support Hours: Monday - Friday, 8:00 AM - 6:00 PM EST
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'sans-serif',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  settingsList: {
    padding: 16,
    gap: 16,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#070707',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  logoutCard: {
    backgroundColor: '#ffebee', // Light red background for logout
    borderColor: '#ef9a9a',
    borderWidth: 1,
  },
  logoutTitle: {
    color: '#d32f2f', // Red color for logout title
  },

  aboutTitle: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: '#070707',
    marginBottom: 8,
  },
  aboutVersion: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: '#070707',
    opacity: 0.1,
    marginVertical: 16,
  },
  aboutDescription: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  featureList: {
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#070707',
    marginBottom: 8,
  },
  featureItem: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
    marginBottom: 6,
    lineHeight: 20,
  },
  copyrightText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  helpTitle: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: '#070707',
    marginBottom: 8,
  },
  stepNumber: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#070707',
    marginRight: 8,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#070707',
    marginBottom: 2,
  },
  stepDescription: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  helpDivider: {
    height: 1,
    backgroundColor: '#070707',
    opacity: 0.1,
    marginVertical: 16,
  },
  contactTitle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#070707',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  contactText: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    marginLeft: 8,
  },
  supportHours: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#070707',
    opacity: 0.7,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  accordionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(7, 7, 7, 0.1)',
  },
});