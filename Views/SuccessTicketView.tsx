import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';

type RouteParams = {
    successTicket: {
        ticketId: string;
    };
};

export default function SuccessTicketView() {
    const route = useRoute<RouteProp<RouteParams, 'successTicket'>>();
    const navigation = useNavigation();
    const { ticketId } = route.params;

    useEffect(() => {
        // Play success haptic feedback
        const playSuccessFeedback = async () => {
            // Play success sound
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/success-sound.mp3')
            );
            await sound.setVolumeAsync(0.08)
            await sound.playAsync();

            // Play haptic pattern
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }, 150);
        };

        playSuccessFeedback();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* Validation Status */}
                <View style={styles.successSection}>
                    <View style={styles.confettiContainer}>
                        <LottieView
                            source={require('../assets/confeti.json')}
                            autoPlay
                            loop={false}
                            style={styles.confetti}
                        />
                    </View>
                    <View style={styles.successIconContainer}>
                        <LottieView
                            source={require('../assets/success-mark.json')}
                            autoPlay
                            loop={false}
                            style={styles.successMark}
                        />
                    </View>
                    <Text style={styles.successTitle}>Ticket Successfully Validated</Text>
                    <Text style={styles.validationTime}>Validated at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>

                {/* Movie Details Card */}
                <View style={styles.movieCard}>
                    <View style={styles.movieHeader}>
                        <Image
                            source={{ uri: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg' }}
                            style={styles.moviePoster}
                        />
                        <View style={styles.movieHeaderInfo}>
                            <Text style={styles.movieTitle}>The Dark Knight</Text>
                            <Text style={styles.showingTime}>2:30 PM Showing</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.movieDetails}>
                        <Text style={styles.sectionTitle}>Ticket Information</Text>
                        
                        <View style={styles.detailRow}>
                            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.detailText}>January 20, 2024</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.detailText}>2:30 PM</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="film-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.detailText}>Theater 1 - Hall A</Text>
                        </View>

                        <View style={styles.ticketSummaryContainer}>
                            <View style={styles.ticketSummaryRow}>
                                <Text style={styles.ticketTypeText}>Adult Tickets (2)</Text>
                                <Text style={styles.ticketPriceText}>$31.98</Text>
                            </View>
                            <View style={styles.ticketSummaryRow}>
                                <Text style={styles.ticketTypeText}>Child Ticket (1)</Text>
                                <Text style={styles.ticketPriceText}>$10.99</Text>
                            </View>
                            <View style={[styles.ticketSummaryRow, styles.totalRow]}>
                                <Text style={styles.totalText}>Total</Text>
                                <Text style={styles.totalPriceText}>$42.97</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.validationNote}>
                        <Ionicons name="information-circle-outline" size={24} color="#8E8E93" />
                        <Text style={styles.noteText}>Ticket has been marked as used in the system</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Button */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        navigation.navigate('Home');
                    }}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="home" size={24} color="#1C1C1E" style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: '#1C1C1E' }]}>Return Home</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    confettiContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 10,
        width: '200%',
        height: '200%',
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    },
    confetti: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [{ scale: 2 }],
    },
    iconGradient: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00C851',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.7,
        shadowRadius: 15,
        elevation: 12,
    },
    actionButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 34,
        backgroundColor: '#1C1C1E',
        borderTopWidth: 1,
        borderTopColor: '#2C2C2E',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    actionButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    actionButton: {
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'System',
    },
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        height: '100%',
    },
    content: {
        flex: 1,
        height: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100, // Add padding to account for the home button
        minHeight: '100%',
    },
    successSection: {
        alignItems: 'center',
        marginBottom: 24,
        flex: 1,
        justifyContent: 'center',
        minHeight: 240,
    },
    successIconContainer: {
        marginBottom: 4,
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successMark: {
        width: '100%',
        height: '100%',
    },
    successTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#00E676',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 0.8,
        textShadowColor: 'rgba(0, 230, 118, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#8E8E93',
    },
    scrollContainer: {
        width: '100%',
    },
    movieCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 20,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    movieHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    moviePoster: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginRight: 16,
    },
    movieHeaderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(255, 255, 255, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    showingTime: {
        fontSize: 18,
        color: '#A0A0A5',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#4A4A4C',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    movieDetails: {
        flex: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    ticketSummaryContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    ticketSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    ticketTypeText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    ticketPriceText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    totalRow: {
        borderBottomWidth: 0,
        marginTop: 8,
        paddingTop: 16,
    },
    totalText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    totalPriceText: {
        fontSize: 20,
        color: '#00E676',
        fontWeight: 'bold',
    },
    detailText: {
        fontSize: 17,
        color: '#FFFFFF',
        marginLeft: 14,
        fontWeight: '500',
        flex: 1,
    },
    validationTime: {
        fontSize: 18,
        color: '#A0A0A5',
        marginBottom: 28,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    ticketIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    ticketIdLabel: {
        fontSize: 16,
        color: '#8E8E93',
        marginRight: 8,
    },
    ticketIdValue: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    validationNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 230, 118, 0.1)',
        padding: 18,
        borderRadius: 16,
        marginTop: 28,
        borderWidth: 1,
        borderColor: 'rgba(0, 230, 118, 0.2)',
    },
    noteText: {
        color: '#00E676',
        marginLeft: 14,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
});