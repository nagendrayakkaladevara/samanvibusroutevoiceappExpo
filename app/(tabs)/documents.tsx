import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Linking } from 'react-native';
import { FileText, Lock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function DocumentsScreen() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check login status when component mounts
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Also check login status when screen comes into focus (e.g., after login/logout)
    useFocusEffect(
        React.useCallback(() => {
            checkLoginStatus();
        }, [])
    );

    const checkLoginStatus = async () => {
        try {
            setIsLoading(true);
            
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickHere = async () => {
        try {
            const documentsUrl = 'https://drive.google.com/drive/folders/1t1S_Zdf-QRsdMDsqudEMFOdUvBCQJGnN';
            const supported = await Linking.canOpenURL(documentsUrl);

            if (supported) {
                await Linking.openURL(documentsUrl);
            } else {
                Alert.alert(
                    'Cannot Open',
                    'Unable to open documents. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error opening documents:', error);
            Alert.alert(
                'Error',
                'Failed to open documents. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Show login required message if not logged in
    if (!isLoggedIn && !isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Documents</Text>
                    <Text style={styles.headerSubtitle}>Login required to access documents</Text>
                </View>
                <View style={styles.loginRequiredContainer}>
                    <Lock size={64} color="#ccc" />
                    <Text style={styles.loginRequiredTitle}>Login Required</Text>
                    <Text style={styles.loginRequiredText}>
                        Please login to view bus documents and information.
                    </Text>
                    <Text style={styles.loginRequiredSubtext}>
                        Documents are only available to authenticated users.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Documents</Text>
                    <Text style={styles.headerSubtitle}>Loading...</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Documents</Text>
                <Text style={styles.headerSubtitle}>Access all bus documents</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.documentCard}
                    onPress={handleClickHere}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardIcon}>
                        <FileText size={32} color="#000000" />
                    </View>
                    <Text style={styles.cardTitle}>All Bus Documents</Text>
                    <TouchableOpacity 
                        style={styles.clickButton}
                        onPress={handleClickHere}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.clickButtonText}>Click Here</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        padding: 20,
    },
    documentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    cardIcon: {
        marginBottom: 20,
    },
    cardTitle: {
        fontFamily: 'sans-serif',
        fontSize: 24,
        color: '#070707',
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
    },
    clickButton: {
        backgroundColor: '#000000',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        minWidth: 150,
    },
    clickButtonText: {
        fontFamily: 'sans-serif',
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    },
    loginRequiredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        padding: 20,
    },
    loginRequiredTitle: {
        fontFamily: 'sans-serif',
        fontSize: 24,
        color: '#070707',
        marginTop: 20,
        fontWeight: '600',
    },
    loginRequiredText: {
        fontFamily: 'sans-serif',
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    loginRequiredSubtext: {
        fontFamily: 'sans-serif',
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});
