import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type SidebarLayoutProps = {
    children: React.ReactNode;
    title: string;
};

type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



export default function SidebarLayout({ children, title }: SidebarLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [employeeName, setEmployeeName] = useState('');
    const slideAnim = React.useRef(new Animated.Value(-300)).current;
    const overlayOpacity = slideAnim.interpolate({
        inputRange: [-300, -150, 0],
        outputRange: [0, 0.5, 0.5],
        extrapolate: 'clamp'
    });
    const navigation = useNavigation<NavigationProp>();

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onPanResponderMove: () => {
                // Swipe to open functionality removed
            },
            onPanResponderRelease: () => {
                // Swipe to open functionality removed
            },
        })
    ).current;

    React.useEffect(() => {
        const loadEmployeeData = async () => {
            try {
                const sessionData = await AsyncStorage.getItem('employeeSession');
                if (sessionData) {
                    const { name } = JSON.parse(sessionData);
                    setEmployeeName(name);
                }
            } catch (error) {
                console.error('Error loading employee data:', error);
            }
        };
        loadEmployeeData();
    }, []);

    const handleHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    

    const toggleSidebar = () => {
        const toValue = isSidebarOpen ? -300 : 0;
        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: true,
        }).start();
        setSidebarOpen(!isSidebarOpen);
        handleHapticFeedback();
    };


    const handleLogout = async () => {
        try {
            console.log("logging out");
            await AsyncStorage.removeItem('employeeSession');
            setSidebarOpen(false);
            
        } catch (error) {
            throw error;
            
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <SafeAreaView style={styles.headerContainer} edges={['top']}>
                <StatusBar barStyle="light-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
                        <Ionicons name="menu" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{title}</Text>
                </View>
            </SafeAreaView>
            
            <View style={styles.content}>
                {children}
            </View>

            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.sidebarHeader}>
                    <Text style={styles.sidebarHeaderText}>Welcome</Text>
                    {employeeName && (
                        <Text style={styles.employeeName}>{employeeName}</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Ionicons name="home-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.sidebarItemText}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.sidebarItemText}>Scan Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.sidebarItemText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogout()} style={[styles.sidebarItem, styles.logoutItem]}>
                    <Ionicons name="log-out-outline" size={24} color="#FF453A" />
                    <Text style={[styles.sidebarItemText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View 
                style={[styles.overlay, { opacity: overlayOpacity }]}
                pointerEvents={isSidebarOpen ? 'auto' : 'none'}
            >
                <TouchableOpacity 
                    style={{ width: '100%', height: '100%' }}
                    activeOpacity={1}
                    onPress={toggleSidebar}
                />
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    headerContainer: {
        backgroundColor: '#1C1C1E',
        zIndex: 1,
    },
    header: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        marginRight: 4,
        padding: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        fontFamily: 'System',
    },
    subtitleText: {
        fontSize: 16,
        color: '#8E8E93',
        fontFamily: 'System',
    },
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 300,
        backgroundColor: '#2C2C2E',
        zIndex: 2,
        paddingTop: 50,
    },
    sidebarHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#3C3C3E',
    },
    sidebarHeaderText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'System',
        marginBottom: 8,
    },
    employeeName: {
        color: '#8E8E93',
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '500',
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#3C3C3E',
    },
    sidebarItemText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 15,
        fontFamily: 'System',
    },
    logoutItem: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#3C3C3E',
    },
    logoutText: {
        color: '#FF453A',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    },
});