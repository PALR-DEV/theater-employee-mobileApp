import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Image,
    ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllMovies } from '../Services/GetAllMovies';
import { LazyLoadImage } from 'react-native-lazy-load-image';

interface Movie {
    id: string;
    title: string;
    duration: string;
    poster_url: string;
    categories: string[];
    screenings: Array<{
        sala: string;
        time_slots: Array<{
            date: string;
            times: string[];
        }>;
    }>;
}

const fetchMovies = async () => {
    try {
        const movies = await getAllMovies();
        // Parse the stringified categories for each movie
        return movies.map(movie => ({
            ...movie,
            categories: JSON.parse(movie.categories)
        }));
    } catch (error) {
        console.error('Error parsing movie data:', error);
        throw error;
    }
}

const isFutureDate = (dateStr: string) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() - 240); // UTC-4 for Puerto Rico
    const date = new Date(dateStr);
    return date >= now;
};

const isFutureTime = (timeStr: string, dateStr: string) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() - 240); // UTC-4 for Puerto Rico
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dateTime = new Date(dateStr);
    dateTime.setHours(hours, minutes, 0);
    
    return dateTime > now;
};

export const MovieScheduleView = () => {
    const navigation = useNavigation();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsloading(true)
                const moviesData = await fetchMovies();
                setMovies(moviesData);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setIsloading(false);
            }
        })();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getAvailableDates = (screenings: Movie['screenings']) => {
        return screenings.reduce((acc, screening) => {
            screening.time_slots.forEach(slot => {
                if (!acc.includes(slot.date) && isFutureDate(slot.date)) {
                    acc.push(slot.date);
                }
            });
            return acc.sort();
        }, [] as string[]);
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
            
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    {movies.map (movie => {
                        const dates = getAvailableDates(movie.screenings);
                        return (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onPress={() => {
                                    setSelectedMovie(movie);
                                    setSelectedDate(dates[0]);
                                    setModalVisible(true);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            />
                        );
                    })}
                </ScrollView>
            )}

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
                                    <Text style={styles.modalMovieTitle}>{selectedMovie.title}</Text>
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

                                <View style={styles.dateListContainer}>
                                    {getAvailableDates(selectedMovie.screenings).map(date => (
                                        <TouchableOpacity
                                            key={date}
                                            style={[
                                                styles.dateListItem,
                                                selectedDate === date && styles.selectedDate
                                            ]}
                                            onPress={() => setSelectedDate(date)}
                                        >
                                            <Text style={styles.dateText}>{formatDate(date)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <ScrollView style={styles.timeSlotsContainer}>
                                    {selectedMovie.screenings.map((screening, index) => {
                                        const timeSlots = screening.time_slots
                                            .filter(slot => slot.date === selectedDate)
                                            .map(slot => ({
                                                ...slot,
                                                times: slot.times.filter(time => 
                                                    selectedDate === new Date().toISOString().split('T')[0] 
                                                        ? isFutureTime(time, selectedDate)
                                                        : true
                                                )
                                            }))
                                            .filter(slot => slot.times.length > 0);
                                        
                                        if (timeSlots.length === 0) return null;

                                        return (
                                            <View key={index} style={styles.screeningRoom}>
                                                <Text style={styles.roomText}>Hall: {screening.sala}</Text>
                                                <View style={styles.timeGrid}>
                                                    {timeSlots[0].times.map((time, idx) => (
                                                        <TouchableOpacity
                                                            key={idx}
                                                            style={styles.timeButton}
                                                            onPress={() => {
                                                                Haptics.notificationAsync(
                                                                    Haptics.NotificationFeedbackType.Success
                                                                );
                                                                navigation.navigate('Booking', {
                                                                    movie: selectedMovie,
                                                                    sala: screening.sala,
                                                                    time: time
                                                                });
                                                            }}
                                                        >
                                                            <Text style={styles.timeButtonText}>{time}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

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
                <LazyLoadImage source={{ uri: movie.poster_url }} style={styles.poster} />
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
        paddingTop: 16,
        paddingBottom: 34,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    modalMovieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        marginRight: 16,
    },
    closeButton: {
        padding: 8,
        borderRadius: 16,
        backgroundColor: '#2C2C2E',
    },
    dateListContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    dateListItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#2C2C2E',
    },
    selectedDate: {
        backgroundColor: '#007AFF',
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    screeningRoom: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    roomText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    timeButton: {
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        padding: 12,
        margin: 4,
        minWidth: 80,
        alignItems: 'center',
    },
    timeButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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

