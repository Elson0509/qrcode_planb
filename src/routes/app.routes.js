import React from 'react';
import Dashboard from '../pages/Dashboard'
import { StyleSheet,
    Button
    } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../contexts/auth'

const AppStack = createStackNavigator()

const AppRoutes = _ => {
    const {signOut} = useAuth()

    return (
        <AppStack.Navigator>
            <AppStack.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={{
                headerRight: ()=>(
                    <Button
                        onPress={()=> signOut()}
                        title='Logout'
                        color='#ccc'
                    />
                )
            }}
        />
        </AppStack.Navigator>
    )
}

export default AppRoutes