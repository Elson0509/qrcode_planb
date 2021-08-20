import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native'
import Routes from './src/routes';
import {AuthProvider} from './src/contexts/auth';
import {RootSiblingParent} from 'react-native-root-siblings'

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <AuthProvider>
            <Routes/>
        </AuthProvider>
      </NavigationContainer>
    </RootSiblingParent>
  )
  
}

