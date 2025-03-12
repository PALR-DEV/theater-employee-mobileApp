import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as Haptics from 'expo-haptics';

function LoginView() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#1C1C1E' }}>
                <View style={{ flex: 0.5, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 40 }}>
                    <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20, fontFamily: 'System' }}>
                        Welcome Back to the Show!
                    </Text>
                </View>

                <View style={{ flex: 5.5, paddingBottom: 20 }}>
                    <FormContainerView />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const FormContainerView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleHapticFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <View style={{
            width: '100%',
            paddingHorizontal: 20,
            marginTop: 0
        }}>
            {/* Form Header */}
            <View style={{
                marginBottom: 30,
                paddingHorizontal: 5
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 22,
                    fontWeight: '700',
                    marginBottom: 8,
                    fontFamily: 'System'
                }}>
                    Sign In
                </Text>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 16,
                    fontFamily: 'System',
                    lineHeight: 22
                }}>
                    Please enter your credentials to access your account
                </Text>
            </View>

            {/* Email Input */}
            <View style={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: emailFocused ? '#FFFFFF' : '#3A3A3C',
                marginBottom: 24,
                paddingBottom: 8
            }}>
                <Text style={{
                    color: emailFocused ? '#FFFFFF' : '#8E8E93',
                    fontSize: 14,
                    marginBottom: 8,
                    fontWeight: '500',
                    letterSpacing: 0.3
                }}>Email</Text>
                <TextInput
                    style={{
                        color: 'white',
                        fontSize: 16,
                        paddingVertical: 6,
                        fontFamily: 'System'
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="#6E6E73"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => {
                        setEmailFocused(true);
                        handleHapticFeedback();
                    }}
                    onBlur={() => setEmailFocused(false)}
                />
            </View>

            {/* Password Input */}
            <View style={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: passwordFocused ? '#FFFFFF' : '#3A3A3C',
                marginBottom: 32,
                paddingBottom: 8
            }}>
                <Text style={{
                    color: passwordFocused ? '#FFFFFF' : '#8E8E93',
                    fontSize: 14,
                    marginBottom: 8,
                    fontWeight: '500',
                    letterSpacing: 0.3
                }}>Password</Text>
                <TextInput
                    style={{
                        color: 'white',
                        fontSize: 16,
                        paddingVertical: 6,
                        fontFamily: 'System'
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor="#6E6E73"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => {
                        setPasswordFocused(true);
                        handleHapticFeedback();
                    }}
                    onBlur={() => setPasswordFocused(false)}
                />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
                style={{
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 10
                }}
                activeOpacity={0.8}
                onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    // Add login logic here
                }}
            >
                <Text style={{
                    color: '#1C1C1E',
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'System'
                }}>
                    Sign In
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default LoginView;