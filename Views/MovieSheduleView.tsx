import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  Image 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Movie {
    id: string;
    title: string;
    duration: string;
    room: string;
    posterUrl: string;
    categories: string[];
    timeSlots: Array<{
        time: string;
        capacity: number;
        occupancy: number;
        date: string;
    }>;
    dates: string[];
}

const dummyMovies: Movie[] = [
    {
        id: '1',
        title: 'Inception',
        duration: '2h 28m',
        room: 'HAll 1',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        categories: ['Sci-Fi', 'Action', 'Thriller'],
        dates: ['2024-01-20', '2024-01-21'],
        timeSlots: [
            { time: '10:00', capacity: 50, occupancy: 45, date: '2024-01-20' },
            { time: '13:30', capacity: 50, occupancy: 30, date: '2024-01-20' },
            { time: '16:45', capacity: 50, occupancy: 48, date: '2024-01-21' },
        ]
    },
    {
        id: '2',
        title: 'The Dark Knight',
        duration: '2h 32m',
        room: 'HAll 2',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        categories: ['Action', 'Crime', 'Drama'],
        dates: ['2024-01-20', '2024-01-21'],
        timeSlots: [
            { time: '11:30', capacity: 50, occupancy: 40, date: '2024-01-20' },
            { time: '14:45', capacity: 50, occupancy: 25, date: '2024-01-20' },
            { time: '18:00', capacity: 50, occupancy: 35, date: '2024-01-21' },
            { time: '18:00', capacity: 50, occupancy: 35, date: '2024-01-21' },
            { time: '18:00', capacity: 50, occupancy: 35, date: '2024-01-21' },
        ]
    },
    {
        id: '3',
        title: 'Interstellar',
        duration: '2h 49m',
        room: 'HAll 3',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        categories: ['Sci-Fi', 'Adventure', 'Drama'],
        dates: ['2024-01-20', '2024-01-21'],
        timeSlots: [
            { time: '12:15', capacity: 50, occupancy: 48, date: '2024-01-20' },
            { time: '15:45', capacity: 50, occupancy: 42, date: '2024-01-20' },
            { time: '19:15', capacity: 50, occupancy: 38, date: '2024-01-21' },
        ]
    }
];

export const MovieScheduleView = () => {
    const navigation = useNavigation();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const getOccupancyColor = (occupancy: number, capacity: number) => {
        const percentage = (occupancy / capacity) * 100;
        if (percentage >= 90) return '#ff4444';
        if (percentage >= 70) return '#ffbb33';
        return '#00C851';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTimeSlots = (timeSlots: Movie['timeSlots'], date: string) => {
        return timeSlots
            .filter(slot => slot.date === date)
            .sort((a, b) => {
                const timeA = new Date(`1970/01/01 ${a.time}`);
                const timeB = new Date(`1970/01/01 ${b.time}`);
                return timeA.getTime() - timeB.getTime();
            });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Now Showing</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {dummyMovies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onPress={() => {
                            setSelectedMovie(movie);
                            setSelectedDate(movie.dates[0]);
                            setModalVisible(true);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    />
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedMovie && (
                            <>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            setModalVisible(false);
                                        }}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons 
                                            name="close" 
                                            size={24} 
                                            color="#fff" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView horizontal 
                                    contentContainerStyle={styles.dateContainer}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {selectedMovie.dates.map((date, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.dateButton,
                                                selectedDate === date && styles.selectedDate
                                            ]}
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                setSelectedDate(date);
                                            }}
                                        >
                                            <Text style={styles.dateText}>
                                                {formatDate(date)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <ScrollView style={styles.timeSlotsContainer} showsVerticalScrollIndicator={false}>
                                    {selectedDate && formatTimeSlots(selectedMovie.timeSlots, selectedDate)
                                        .map(slot => (
                                            <TouchableOpacity 
                                                key={slot.time}
                                                style={styles.timeSlot}
                                                onPress={() => {
                                                    Haptics.notificationAsync(
                                                        Haptics.NotificationFeedbackType.Success
                                                    );
                                                    navigation.navigate('Booking', {
                                                        movie: selectedMovie,
                                                        slot: slot
                                                    });
                                                }}
                                            >
                                                <View style={styles.timeSlotContent}>
                                                    <Text style={styles.timeText}>{slot.time}</Text>
                                                    <Text style={styles.roomText}>{selectedMovie.room}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 12,
    },
    backButton: {
        padding: 8,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#3A3A3C',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    movieCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        transform: [{ scale: 1 }],
    },
    poster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    movieDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(44, 44, 46, 0.95)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    meta: {
        color: '#9B9B9B',
        fontSize: 14,
        marginBottom: 12,
        letterSpacing: 0.25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 34,
        minHeight: '50%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#2C2C2E',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    movieCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        transform: [{ scale: 1 }],
    },
    poster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    movieDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(44, 44, 46, 0.95)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    meta: {
        color: '#9B9B9B',
        fontSize: 14,
        marginBottom: 12,
        letterSpacing: 0.25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 34,
        minHeight: '50%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#2C2C2E',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    movieCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        transform: [{ scale: 1 }],
    },
    poster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    movieDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(44, 44, 46, 0.95)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    meta: {
        color: '#9B9B9B',
        fontSize: 14,
        marginBottom: 12,
        letterSpacing: 0.25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 34,
        minHeight: '50%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#2C2C2E',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    movieCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        transform: [{ scale: 1 }],
    },
    poster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    movieDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(44, 44, 46, 0.95)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    meta: {
        color: '#9B9B9B',
        fontSize: 14,
        marginBottom: 12,
        letterSpacing: 0.25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 34,
        minHeight: '50%',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#2C2C2E',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#2C2C2E',
    },
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    movieCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        transform: [{ scale: 1 }],
    },
    poster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    movieDetails: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(44, 44, 46, 0.95)',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    meta: {
        color: '#9B9B9B',
        fontSize: 14,
        marginBottom: 12,
        letterSpacing: 0.25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 34,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 16,
    },
    closeButton: {
        padding: 8,
        alignSelf: 'flex-end',
    },
    dateContainer: {
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    dateButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#3A3A3C',
        borderWidth: 1,
        borderColor: '#4A4A4C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    selectedDate: {
        backgroundColor: '#00C851',
        borderColor: '#00C851',
        shadowColor: '#00C851',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    dateText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    timeSlotsContainer: {
        maxHeight: 400,
        paddingHorizontal: 12,
        marginTop: 20,
        width: '100%',
    },
    timeSlot: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        marginBottom: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        marginHorizontal: 8,
        width: '100%',
        alignSelf: 'center',
    },
    timeSlotContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    roomText: {
        color: '#9B9B9B',
        fontSize: 14,
    },
    occupancyBar: {
        height: 4,
        flex: 1,
        marginLeft: 16,
        borderRadius: 2,
    },
    categoriesContainer: {
        marginVertical: 8,
        flexGrow: 0
    },
    categoryPill: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500'
    }
});

const MovieCard = ({ movie, onPress }: { movie: Movie; onPress: () => void }) => {
    const [pressAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
        >
            <Animated.View style={[styles.movieCard, { transform: [{ scale: pressAnim }] }]}>
                <Image source={{ uri: movie.posterUrl }} style={styles.poster} />
                <LinearGradient
                    colors={['rgba(44, 44, 46, 0.7)', 'rgba(44, 44, 46, 0.95)']}
                    style={styles.movieDetails}
                >
                    <Text style={styles.title}>{movie.title}</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesContainer}
                    >
                        {movie.categories?.map((category, index) => (
                            <View key={index} style={styles.categoryPill}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <Text style={styles.meta}>{movie.duration}</Text>
                </LinearGradient>
            </Animated.View>
        </Pressable>
    );
};
{dummyMovies.map(movie => (
    <MovieCard
        key={movie.id}
        movie={movie}
        onPress={() => {
            setSelectedMovie(movie);
            setSelectedDate(movie.dates[0]);
            setModalVisible(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
    />
))}