import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Button, StyleSheet } from 'react-native';
import LandingView from './Views/LandingView';
import LoginView from './Views/LoginView';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen 
          name="Landing" 
          component={LandingView}
          options={{
            headerShown: false,
            gestureEnabled: false
          }}
        />
        
        <Stack.Screen name="Login" component={LoginView} options={{headerShown:false,  presentation: 'modal'}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
