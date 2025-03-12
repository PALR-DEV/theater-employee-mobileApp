import React from 'react';
import { View , Text, SafeAreaView} from 'react-native';

function LoginView() {
    return (
        <SafeAreaView style={{flex:1, backgroundColor: '#1C1C1E' }}>
            <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center', paddingTop:60}}>
            <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20,  fontFamily:'System'}}>
                    Welcome Back to the Show!
                </Text>
            </View>
        </SafeAreaView>
    );
}

export default LoginView;