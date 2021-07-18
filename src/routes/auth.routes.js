import React from 'react';
import Signin from "../pages/Signin";

import { createStackNavigator } from '@react-navigation/stack'

const AuthStack = createStackNavigator()

const AuthRoutes = _ => {
    return (
    <AuthStack.Navigator>
        <AuthStack.Screen options={{headerShown: false}} name="SignIn" component={Signin}/>
    </AuthStack.Navigator>
    )
}

export default AuthRoutes