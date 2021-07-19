import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native'
import Routes from './src/routes';
import {AuthProvider} from './src/contexts/auth';

import { StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Keyboard
  } from 'react-native';

export default function App() {
  

  return (
    <NavigationContainer>
      {/* <AuthProvider>
      <View>
        <Text>ergegre</Text>
      </View>
      </AuthProvider> */}
      <AuthProvider>
          <Routes/>
      </AuthProvider>
    </NavigationContainer>
  )
  
}

