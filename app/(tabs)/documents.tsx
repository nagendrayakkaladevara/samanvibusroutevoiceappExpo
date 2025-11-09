import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Linking } from 'react-native';
import { FileText, Download, Eye, Share2, Calendar, MapPin, Clock, User, Phone, Mail, ExternalLink, Lock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface BusDocument {
    id: string;
    documentName: string;
    fileUrl: string;
}

interface Bus {
    id: string;
    registrationNo: string;
    documents: BusDocument[];
}

interface ApiResponse {
    buses: Bus[];
    total: number;
}

export default function DocumentsScreen() {
    const [selectedBus, setSelectedBus] = useState<string | null>(null);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            // Reset states first
            setIsLoading(true);
            setError(null);
            
            const loginData = await AsyncStorage.getItem('userLoginData');
            if (loginData) {
                const { expirationTime } = JSON.parse(loginData);
                const currentTime = new Date().getTime();
                
                if (currentTime < expirationTime) {
                    // Login is still valid
                    setIsLoggedIn(true);
                    fetchBusDocuments();
                } else {
                    // Login expired
                    setIsLoggedIn(false);
                    setIsLoading(false);
                    setBuses([]);
                    setError(null);
                    await AsyncStorage.removeItem('userLoginData');
                }
            } else {
                setIsLoggedIn(false);
                setIsLoading(false);
                setBuses([]);
                setError(null);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
            setIsLoading(false);
            setBuses([]);
            setError(null);
        }
    };

    const fetchBusDocuments = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('https://samanvi-backend.vercel.app/api/v1/buses/all-with-documents', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa('qwert:123456'),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();
            setBuses(data.buses);
        } catch (error) {
            console.error('Error fetching bus documents:', error);
            setError('Failed to load documents. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBusPress = (busId: string) => {
        setSelectedBus(selectedBus === busId ? null : busId);
    };

    const handleOpenFile = async (fileUrl: string, documentName: string) => {
        try {
            const supported = await Linking.canOpenURL(fileUrl);

            if (supported) {
                await Linking.openURL(fileUrl);
            } else {
                Alert.alert(
                    'Cannot Open File',
                    `Unable to open "${documentName}". The file URL may be invalid or unsupported.`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error opening file:', error);
            Alert.alert(
                'Error',
                'Failed to open the file. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleShare = (document: BusDocument) => {
        Alert.alert(
            'Share Document',
            `Share "${document.documentName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Share',
                    onPress: () => {
                        // You can implement sharing functionality here
                        console.log('Sharing:', document.documentName, document.fileUrl);
                    }
                }
            ]
        );
    };

    const getDocumentTypeColor = (documentName: string) => {
        const name = documentName.toLowerCase();
        if (name.includes('permit')) return '#3b82f6';
        if (name.includes('fitness')) return '#10b981';
        if (name.includes('insurance')) return '#ef4444';
        if (name.includes('registration')) return '#f59e0b';
        return '#8b5cf6';
    };

    const getDocumentType = (documentName: string) => {
        const name = documentName.toLowerCase();
        if (name.includes('permit')) return 'Permit';
        if (name.includes('fitness')) return 'Fitness';
        if (name.includes('insurance')) return 'Insurance';
        if (name.includes('registration')) return 'Registration';
        return 'Other';
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
                    <Text style={styles.headerSubtitle}>Loading bus documents...</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading documents...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Documents</Text>
                    <Text style={styles.headerSubtitle}>Error loading documents</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchBusDocuments}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const busesWithDocuments = buses.filter(bus => bus.documents.length > 0);
    const totalDocuments = buses.reduce((total, bus) => total + bus.documents.length, 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Documents</Text>
                <Text style={styles.headerSubtitle}>
                    {totalDocuments} documents from {busesWithDocuments.length} buses
                </Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {busesWithDocuments.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <FileText size={48} color="#ccc" />
                        <Text style={styles.emptyText}>No documents available</Text>
                        <Text style={styles.emptySubtext}>Documents will appear here when uploaded</Text>
                    </View>
                ) : (
                    <View style={styles.busesList}>
                        {busesWithDocuments.map((bus) => (
                            <TouchableOpacity
                                key={bus.id}
                                style={styles.busCard}
                                onPress={() => handleBusPress(bus.id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.busHeader}>
                                    <View style={styles.busIcon}>
                                        <FileText size={24} color="#000000" />
                                    </View>
                                    <View style={styles.busInfo}>
                                        <Text style={styles.busTitle}>{bus.registrationNo}</Text>
                                        <Text style={styles.busDescription}>
                                            {bus.documents.length} document{bus.documents.length !== 1 ? 's' : ''} available
                                        </Text>
                                    </View>
                                </View>

                                {selectedBus === bus.id && (
                                    <View style={styles.documentsSection}>
                                        <Text style={styles.documentsSectionTitle}>Documents</Text>
                                        {bus.documents.map((document) => (
                                            <View key={document.id} style={styles.documentItem}>
                                                <View style={styles.documentItemHeader}>
                                                    <View style={styles.documentItemIcon}>
                                                        <FileText size={20} color="#666" />
                                                    </View>
                                                    <View style={styles.documentItemInfo}>
                                                        <Text style={styles.documentItemTitle}>{document.documentName}</Text>
                                                        <View style={styles.documentItemMeta}>
                                                            <Text style={styles.documentSize}>PDF</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.documentActions}>
                                                        <TouchableOpacity
                                                            style={[styles.actionButton, styles.primaryButton]}
                                                            onPress={() => handleOpenFile(document.fileUrl, document.documentName)}
                                                        >
                                                            <ExternalLink size={14} color="#ffffff" />
                                                            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
                                                                Open
                                                            </Text>
                                                        </TouchableOpacity>

                                                        {/* <TouchableOpacity
                                                            style={styles.actionButton}
                                                            onPress={() => handleShare(document)}
                                                        >
                                                            <Share2 size={14} color="#666" />
                                                        </TouchableOpacity> */}
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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
        backgroundColor: '#F2F2F2',
    },
    busesList: {
        padding: 16,
        gap: 16,
    },
    busCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    busHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    busIcon: {
        marginRight: 16,
        marginTop: 2,
    },
    busInfo: {
        flex: 1,
    },
    busTitle: {
        fontFamily: 'sans-serif',
        fontSize: 18,
        color: '#070707',
        marginBottom: 4,
        fontWeight: '600',
    },
    busDescription: {
        fontFamily: 'sans-serif',
        fontSize: 14,
        color: '#070707',
        opacity: 0.7,
        marginBottom: 8,
    },
    busMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    documentCountBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#3b82f6',
    },
    documentCountText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    busId: {
        fontSize: 12,
        color: '#666',
    },
    documentsSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(7, 7, 7, 0.1)',
    },
    documentsSectionTitle: {
        fontFamily: 'sans-serif',
        fontSize: 18,
        color: '#070707',
        marginBottom: 12,
        fontWeight: '600',
    },
    documentItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    documentItemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    documentItemIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    documentItemInfo: {
        flex: 1,
    },
    documentItemTitle: {
        fontFamily: 'sans-serif',
        fontSize: 16,
        color: '#070707',
        marginBottom: 4,
        fontWeight: '500',
    },
    documentItemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    documentSize: {
        fontSize: 12,
        color: '#666',
    },
    documentActions: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
    primaryButton: {
        backgroundColor: '#000000',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 3,
        gap: 6,
    },
    primaryButtonText: {
        color: '#ffffff',
    },
    infoSection: {
        padding: 16,
        backgroundColor: '#ffffff',
        margin: 16,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    infoTitle: {
        fontFamily: 'sans-serif',
        fontSize: 18,
        color: '#070707',
        marginBottom: 12,
        fontWeight: '600',
    },
    categoryList: {
        gap: 8,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    categoryLabel: {
        fontSize: 14,
        color: '#666',
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        padding: 20,
        minHeight: 300,
    },
    emptyText: {
        fontSize: 20,
        color: '#666',
        marginTop: 10,
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        textAlign: 'center',
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
