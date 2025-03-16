import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import SidebarLayout from '../reusableComponents/SidebarLayout';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Home: undefined;
    MovieShedule:undefined;
    successTicket: { ticketId: string | undefined };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const ActionCard = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
    <TouchableOpacity 
        style={styles.actionCard} 
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
        }}
    >
        <Ionicons name={icon} size={32} color="#FFFFFF" />
        <Text style={styles.actionCardText}>{title}</Text>
    </TouchableOpacity>
);

const StatCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
    <View style={styles.statCard}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
);

export default function HomeView() {
    const navigation = useNavigation<NavigationProp>();
    const [showCamera, setShowCamera] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(1));

    const handleActionPress = (action: string) => {
        console.log(`${action} pressed`);
        // Add action handling logic here

        if (action === 'schedule') {
            navigation.navigate('MovieShedule');
        }
    };

    const handleCameraClose = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start(() => {
            setShowCamera(false);
        });
    }, [fadeAnim]);

    const handleCameraOpen = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start(() => {
            setShowCamera(true);
        });
    }, [fadeAnim]);

    useEffect(() => {
        return () => {
            fadeAnim.stopAnimation();
        };
    }, [fadeAnim]);

    if (showCamera) {
        return (
            <View style={{ flex: 1, backgroundColor: '#2C2C2E' }}>
                <CameraScreen onClose={handleCameraClose} />
            </View>
        );
    }

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: '#2C2C2E' }}>
            <SidebarLayout title="Theater Dashboard">
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Welcome Section */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeText}>Welcome back!</Text>
                        <Text style={styles.subtitleText}>Your movie theater management hub</Text>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        <StatCard 
                            title="Today's Tickets"
                            value="156"
                            subtitle="Scanned today"
                        />
                        <StatCard 
                            title="Active Shows"
                            value="4"
                            subtitle="Currently playing"
                        />
                    </View>

                    {/* Quick Actions Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.actionGrid}>
                            <ActionCard 
                                title="Scan Tickets"
                                icon="scan-outline"
                                onPress={handleCameraOpen}
                            />
                            <ActionCard 
                                title="Validate Tickets"
                                icon="checkmark-circle-outline"
                                onPress={() => handleActionPress('validate')}
                            />
                            <ActionCard 
                                title="Show Schedule"
                                icon="calendar-outline"
                                onPress={() => handleActionPress('schedule')}
                            />
                            <ActionCard 
                                title="Theater Status"
                                icon="film-outline"
                                onPress={() => handleActionPress('status')}
                            />
                            <ActionCard 
                                title="Test Success"
                                icon="bug-outline"
                                onPress={() => navigation.navigate('successTicket', { ticketId: 'test-123' })}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SidebarLayout>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    welcomeSection: {
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        fontFamily: 'System',
    },
    subtitleText: {
        fontSize: 16,
        color: '#8E8E93',
        fontFamily: 'System',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
        fontFamily: 'System',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        padding: 16,
        width: '48%',
    },
    statTitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 8,
        fontFamily: 'System',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        fontFamily: 'System',
    },
    statSubtitle: {
        fontSize: 12,
        color: '#8E8E93',
        fontFamily: 'System',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        padding: 16,
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
    },
    actionCardText: {
        marginTop: 12,
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'System',
    },
});