import React from 'react';
import Dashboard from '../pages/Dashboard'
import { StyleSheet,
    Button
    } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../contexts/auth'
import MyQRCode from '../pages/MyQRCode';
import Scan from '../pages/Scan';
import Residents from '../pages/Residents'
import Visitors from '../pages/Visitors'
import Thirds from '../pages/Thirds'

const AppStack = createStackNavigator()

const AppRoutes = _ => {
    const {signOut} = useAuth()

    const logoutButton = <Button onPress={()=> signOut()} title='Logout' color='#444' accessibilityLabel="sair" />
     

    return (
        <AppStack.Navigator>
            <AppStack.Screen 
                name="Dashboard" 
                component={Dashboard}
                options={{
                    headerRight: () => logoutButton
                }}
            />
            <AppStack.Screen 
                name="MyQRCode" 
                component={MyQRCode}
                options={{
                    headerTitle: 'Meu QR Code',
                    headerRight: ()=> logoutButton
                }}
            />
            <AppStack.Screen 
                name="Scan" 
                component={Scan}
                
                options={{
                    headerShown: false
                }}
            />
            <AppStack.Screen 
                name="Residents" 
                component={Residents}
                options={{
                    headerTitle: 'Moradores',
                    headerRight: ()=> logoutButton
                }}
            />
            <AppStack.Screen 
                name="Visitors" 
                component={Visitors}
                options={{
                    headerTitle: 'Visitantes',
                    headerRight: ()=> logoutButton
                }}
            />
            <AppStack.Screen 
                name="Thirds" 
                component={Thirds}
                options={{
                    headerTitle: 'Terceirizados',
                    headerRight: ()=> logoutButton
                }}
            />
        </AppStack.Navigator>
    )
}

export default AppRoutes