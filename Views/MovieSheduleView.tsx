import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Dimensions, Image, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';


interface Movie {
    id: string;
    title: string;
    duration: string;
    room: string;
    posterUrl: string;
    timeSlots: Array<{
        time: string;
        capacity: number;
        occupancy: number;
    }>;
    dates: string[];
}

const dummyMovies: Movie[] = [
    {
        id: '1',
        title: 'The Dark Knight',
        duration: '2h 32min',
        room: 'Room A',
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        timeSlots: [
            { time: '10:00 AM', capacity: 150, occupancy: 87 },
            { time: '2:30 PM', capacity: 150, occupancy: 45 },
            { time: '6:00 PM', capacity: 150, occupancy: 120 }
        ],
        dates: ['2024-01-15', '2024-01-16', '2024-01-17']
    },
    {
        id: '2',
        title: 'Inception',
        duration: '2h 28min',
        room: 'Room B',
        posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        timeSlots: [
            { time: '11:30 AM', capacity: 120, occupancy: 98 },
            { time: '3:00 PM', capacity: 120, occupancy: 60 },
            { time: '7:30 PM', capacity: 120, occupancy: 110 }
        ],
        dates: ['2024-01-15', '2024-01-16']
    },
    {
        id: '3',
        title: 'Interstellar',
        duration: '2h 49min',
        room: 'Room A',
        posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        timeSlots: [
            { time: '1:00 PM', capacity: 150, occupancy: 145 },
            { time: '4:30 PM', capacity: 150, occupancy: 80 },
            { time: '8:00 PM', capacity: 150, occupancy: 130 }
        ],
        dates: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18']
    },
];

export const MovieScheduleView = () => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');


    const getOccupancyColor = (occupancy: number, capacity: number) => {
        const percentage = (occupancy / capacity) * 100;
        if (percentage >= 90) return '#ff4444';
        if (percentage >= 70) return '#ffbb33';
        return '#00C851';
    };

    const formatTimeSlots = (timeSlots: Array<{time: string; capacity: number; occupancy: number}>) => {
        return timeSlots.sort((a, b) => {
            const timeA = new Date(`2000/01/01 ${a.time}`);
            const timeB = new Date(`2000/01/01 ${b.time}`);
            return timeA.getTime() - timeB.getTime();
        });
    };

    const handleMoviePress = (movie: Movie) => {
        setSelectedMovie(movie);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setModalVisible(false);
        setSelectedMovie(null);
        setSelectedDate('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Now Showing</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.movieList}>
                        {dummyMovies.map((movie) => (
                            <TouchableOpacity
                                key={movie.id}
                                style={styles.movieCardRow}
                                onPress={() => handleMoviePress(movie)}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: movie.posterUrl }}
                                    style={styles.moviePosterRow}
                                    resizeMode="cover"
                                />
                                <View style={styles.movieInfoRow}>
                                    <Text style={styles.movieTitleRow} numberOfLines={2}>{movie.title}</Text>
                                    <Text style={styles.movieDurationRow}>{movie.duration}</Text>
                                    <View style={styles.roomBadgeRow}>
                                        <Text style={styles.roomTextRow}>{movie.room}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                    statusBarTranslucent={true}
                >
                    <View style={[styles.modalContainer, { backgroundColor: modalVisible ? 'rgba(0, 0, 0, 0.8)' : 'transparent' }]}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseModal}
                                activeOpacity={0.7}
                                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                            >
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>

                            {selectedMovie && (
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.modalHeader}>
                                        <Image
                                            source={{ uri: selectedMovie.posterUrl }}
                                            style={styles.modalPoster}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.modalHeaderInfo}>
                                            <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                                            <View style={styles.modalDetailRow}>
                                                <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                                                <Text style={styles.modalDetailText}>{selectedMovie.duration}</Text>
                                            </View>
                                            <View style={styles.modalDetailRow}>
                                                <Ionicons name="location-outline" size={20} color="#FFFFFF" />
                                                <Text style={styles.modalDetailText}>{selectedMovie.room}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={styles.sectionTitle}>Select Date</Text>
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false} 
                                        style={styles.datesContainer}
                                    >
                                        {selectedMovie.dates.map((date, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.dateChip, selectedDate === date && styles.dateChipSelected]}
                                                onPress={() => setSelectedDate(date)}
                                            >
                                                <Text style={[styles.dateText, selectedDate === date && styles.dateTextSelected]}>{date}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    <Text style={styles.sectionTitle}>Available Times</Text>
                                    <View style={styles.timeSlotGrid}>
                                        {formatTimeSlots(selectedMovie.timeSlots).map((slot, index) => (
                                            <View key={index} style={styles.timeSlotCard}>
                                                <Text style={styles.timeText}>{slot.time}</Text>
                                                <View style={styles.occupancyBar}>
                                                    <View 
                                                        style={[styles.occupancyFill, { 
                                                            width: `${(slot.occupancy / slot.capacity) * 100}%`,
                                                            backgroundColor: getOccupancyColor(slot.occupancy, slot.capacity)
                                                        }]} 
                                                    />
                                                </View>
                                                <Text style={styles.occupancyText}>
                                                    {slot.occupancy}/{slot.capacity} seats
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_COUNT_PER_ROW = 2;
const CARD_WIDTH = (SCREEN_WIDTH - (CARD_MARGIN * (CARD_COUNT_PER_ROW + 1))) / CARD_COUNT_PER_ROW;

const styles = StyleSheet.create({
    movieList: {
        padding: 12,
    },
    movieCardRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 8,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        transform: [{ scale: 1 }],
    },
    moviePosterRow: {
        width: 140,
        height: 210,
        borderRadius: 12,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    movieInfoRow: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(44, 44, 46, 0.3)',
    },
    movieTitleRow: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    movieDurationRow: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    roomBadgeRow: {
        backgroundColor: 'rgba(82, 82, 93, 0.7)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    roomTextRow: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
        marginBottom: CARD_MARGIN,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    movieGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: CARD_MARGIN,
        gap: CARD_MARGIN,
    },
    movieCard: {
        width: CARD_WIDTH,
        backgroundColor: '#3A3A3C',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: CARD_MARGIN,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        transform: [{ scale: 1 }],
    },
    moviePoster: {
        width: '100%',
        height: CARD_WIDTH * 1.5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    movieInfo: {
        padding: 12,
        backgroundColor: '#3A3A3C',
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        fontFamily: 'System',
    },
    movieDuration: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 8,
        fontFamily: 'System',
    },
    roomBadge: {
        backgroundColor: '#2C2C2E',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    roomText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
        fontFamily: 'System',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    movieCard: {
        width: '48%',
        backgroundColor: '#3A3A3C',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        transform: [{ scale: 1 }],
    },
    modalContent: {
        backgroundColor: '#2C2C2E',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        minHeight: '80%',
        paddingTop: 24,
        transform: [{ translateY: 0 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 16,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(60, 60, 60, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        padding: 16,
        gap: 20,
        marginBottom: 5,
    },
    modalPoster: {
        width: 130,
        height: 195,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeaderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
        fontFamily: 'System',
    },
    modalDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    modalDetailText: {
        fontSize: 16,
        color: '#8E8E93',
        fontFamily: 'System',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 28,
        marginBottom: 16,
        marginHorizontal: 16,
        fontFamily: 'System',
        letterSpacing: 0.5,
    },
    datesContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    dateChip: {
        backgroundColor: '#3A3A3C',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    dateChipSelected: {
        backgroundColor: '#007AFF',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
    dateText: {
        fontSize: 15,
        color: '#8E8E93',
        fontFamily: 'System',
    },
    dateTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    timeSlotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    timeSlotCard: {
        width: '48%',
        backgroundColor: '#3A3A3C',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    timeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10,
        fontFamily: 'System',
        textAlign: 'center',
    },
    occupancyBar: {
        height: 6,
        backgroundColor: '#2C2C2E',
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    occupancyFill: {
        height: '100%',
        borderRadius: 3,
    },
    occupancyText: {
        fontSize: 13,
        color: '#8E8E93',
        fontFamily: 'System',
        textAlign: 'center',
        fontWeight: '500',
    },
    posterScroll: {
        marginBottom: 20,
    },
    posterContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    posterCard: {
        width: 140,
        marginRight: 16,
    },
    posterImage: {
        width: 140,
        height: 210,
        borderRadius: 12,
        marginBottom: 8,
    },
    posterTitle: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '500',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    scheduleContainer: {
        flex: 1,
    },
    movieSection: {
        backgroundColor: '#3A3A3C',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 16,
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    timeSlotCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        padding: 12,
        width: '30%',
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    occupancyBar: {
        height: 4,
        backgroundColor: '#4A4A4C',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 6,
    },
    occupancyFill: {
        height: '100%',
        borderRadius: 2,
    },
    occupancyText: {
        color: '#8E8E93',
        fontSize: 12,
        textAlign: 'center',
    },
    movieHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        fontFamily: 'System',
    },
    roomText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    movieDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#8E8E93',
        fontFamily: 'System',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    modalContent: {
        backgroundColor: 'rgba(44, 44, 46, 0.95)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        width: '100%',
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 24,
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 44,
        height: 44,
        backgroundColor: '#3A3A3C',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
        marginTop: 8,
        fontFamily: 'System',
    },
    modalDetails: {
        backgroundColor: '#3A3A3C',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    modalDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 4,
    },
    modalDetailText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 12,
        fontFamily: 'System',
    },
    datesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
        fontFamily: 'System',
    },
    datesContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    dateChip: {
        backgroundColor: 'rgba(58, 58, 60, 0.8)',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    dateText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    modalHeader: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    modalPoster: {
        width: 120,
        height: 180,
        borderRadius: 12,
    },
    modalHeaderInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    modalTimeSlots: {
        marginBottom: 24,
    },
    modalTimeSlot: {
        backgroundColor: '#3A3A3C',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    modalTimeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    modalOccupancyBar: {
        height: 4,
        backgroundColor: '#4A4A4C',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 6,
    },
    modalOccupancyFill: {
        height: '100%',
        borderRadius: 2,
    },
    modalOccupancyText: {
        color: '#8E8E93',
        fontSize: 12,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        padding: 8,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(60, 60, 60, 0.9)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        fontFamily: 'System',
    },
    modalDetails: {
        marginBottom: 24,
    },
    modalDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalDetailText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 12,
        fontFamily: 'System',
    },
    datesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
        fontFamily: 'System',
    },
    datesContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    dateChip: {
        backgroundColor: 'rgba(58, 58, 60, 0.8)',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    dateText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});