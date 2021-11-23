import React from 'react';
import Dashboard from '../pages/Dashboard'
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../contexts/auth'
import MyQRCode from '../pages/MyQRCode';
import Scan from '../pages/Scan'
import CameraPic from '../pages/CameraPic'
import MessageList from '../pages/MessageList';
import * as Constants from '../services/constants'
import Scanned from '../pages/Scanned'
import CarRoutes from './CarRoutes';
import EventRoutes from './EventRoutes';
import GuardRoutes from './GuardRoutes';
import VisitorRoutes from './VisitorRoutes';
import ThirdRoutes from './ThirdRoutes';
import UnitRoutes from './UnitRoutes';
import ResidentRoutes from './ResidentRoutes';
import CondoRoutes from './CondoRoutes';
import SindicoRoutes from './SindicoRoutes';
import SlotRoutes from './SlotRoutes'

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
                    headerRight: () => logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Dashboard"]
                    }
                }}
            />
            <AppStack.Screen 
                name="MyQRCode" 
                component={MyQRCode}
                options={{
                    headerTitle: 'Meu QR Code',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["MyQRCode"]
                    }
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
                name="Scanned" 
                component={Scanned}
                options={{
                    headerShown: false
                }}
            />
            <AppStack.Screen 
                name="CameraPic" 
                component={CameraPic}
                options={{
                    headerShown: false
                }}
            />
            {
                CarRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                EventRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                GuardRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                VisitorRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                ThirdRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                UnitRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                ResidentRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                CondoRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                SindicoRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            {
                SlotRoutes.map(el=>(
                    <AppStack.Screen 
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: ()=> logoutButton,
                            headerStyle:{
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            }
                        }}
                    />
                ))
            }
            
            <AppStack.Screen 
                name="Messages" 
                component={MessageList}
                options={{
                    headerTitle: 'Mensagens',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: '#ddd'
                    }
                }}
            />
        </AppStack.Navigator>
    )
}

export default AppRoutes