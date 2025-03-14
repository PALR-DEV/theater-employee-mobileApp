import React from 'react';
import { View, Text, ImageBackground, StatusBar, Button, TouchableOpacity, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;


function LandingView() {
    const navigation = useNavigation<NavigationProp>();

    const handleHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <>
            <StatusBar hidden />
            <ImageBackground
                source={{ uri: 'https://images.pexels.com/photos/7991182/pexels-photo-7991182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 90 }}>
                    <Text style={{ color: 'white', fontSize: 35, fontWeight: 'bold', textAlign: 'center', fontFamily:'System' }}>
                        Theater App
                    </Text>
                    <Text style={{ 
                        fontFamily:'System',
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: '500',
                        textAlign: 'center',
                        paddingTop: 10,
                        paddingHorizontal: 40
                    }}>
                        Your gateway to seamless theater management
                    </Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#2C2C2E',
                            paddingVertical: 20,
                            paddingHorizontal: 20,
                            width: Dimensions.get('window').width > 400 ? '90%' : '95%',
                            maxWidth: 500,
                            borderRadius: 15, 
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 5
                        }} 
                        activeOpacity={0.7}
                        onPress={() => {
                            handleHapticFeedback();
                            navigation.navigate('Login');
                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontFamily:'System',
                            textAlign: 'center',
                            fontSize: 24,
                            fontWeight: '600',
                            letterSpacing: 0.5
                        }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </>
    );
}

export default LandingView;