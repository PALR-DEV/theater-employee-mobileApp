import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, Button, StyleSheet, StatusBar } from 'react-native';
import LandingView from './Views/LandingView';
import LoginView from './Views/LoginView';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import HomeView from './Views/HomeView';
import { MovieScheduleView } from './Views/MovieSheduleView';
import SuccessTicketView from './Views/SuccessTicketView';

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Home: undefined;
};




const Stack = createNativeStackNavigator();
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  
  useEffect(() => {
    checkAuthStatus();
    
    // Only run interval if not authenticated
    let interval: NodeJS.Timeout | null = null;
    if (!isAuthenticated) {
      interval = setInterval(() => {
        checkAuthStatus();
      }, 1000);
    }

    // Cleanup interval on component unmount or when authenticated
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated]); // Add isAuthenticated to dependencies

  const checkAuthStatus = async () => {
    try {
      const employeeSession = await AsyncStorage.getItem('employeeSession');
      setIsAuthenticated(!!employeeSession);
      // console.log('Auth Status Check:', employeeSession);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E'
      }}>
        <StatusBar hidden />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{
          color: '#FFFFFF',
          marginTop: 20,
          fontSize: 16,
          fontFamily: 'System'
        }}>

        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Landing"
              component={LandingView}
              options={{
                gestureEnabled: false
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginView}
              options={{
                presentation: 'modal'
              }}
            />
          </>
        ) : (

          // Protected Stack
          <>
            <Stack.Screen
              name="Home"
              component={HomeView}
              options={{
                gestureEnabled: false
              }}
            />

            <Stack.Screen
              name='MovieShedule'
              component={MovieScheduleView}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name='successTicket'
              component={SuccessTicketView}
              initialParams={{ ticketId: undefined }}
              options={{headerShown: false, gestureEnabled: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
