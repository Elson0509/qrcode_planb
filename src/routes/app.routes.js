import React from 'react';
import Dashboard from '../pages/Dashboard'
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../contexts/auth'
import MyQRCode from '../pages/MyQRCode'
import Scan from '../pages/Scan'
import CameraPic from '../pages/CameraPic'
import MessageList from '../pages/MessageList'
import * as Constants from '../services/constants'
import Scanned from '../pages/Scanned'
import AccessRoutes from './AccessRoutes';
import CarRoutes from './CarRoutes'
import EventRoutes from './EventRoutes'
import GuardRoutes from './GuardRoutes'
import Info from '../pages/Info';
import VisitorRoutes from './VisitorRoutes'
import ThirdRoutes from './ThirdRoutes'
import UnitRoutes from './UnitRoutes'
import ResidentRoutes from './ResidentRoutes'
import CondoRoutes from './CondoRoutes'
import SindicoRoutes from './SindicoRoutes'
import SlotRoutes from './SlotRoutes'
import UserRoutes from './UserRoutes'
import THEME from '../services/theme'

const AppStack = createStackNavigator()

const AppRoutes = _ => {
    const { signOut } = useAuth()

    const logoutButton = <Button onPress={() => signOut()} title='Logout' color='#444' accessibilityLabel="sair" />

    const headerTitleStyle = {
        fontFamily: THEME.FONTS.r400i
    }

    const AllRoutes = [
        AccessRoutes,
        CarRoutes,
        EventRoutes,
        GuardRoutes,
        VisitorRoutes,
        ThirdRoutes,
        UnitRoutes,
        ResidentRoutes,
        CondoRoutes,
        SindicoRoutes,
        SlotRoutes,
        UserRoutes
    ]

    return (
        <AppStack.Navigator>
            <AppStack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    title: 'Painel Principal',
                    headerRight: () => logoutButton,
                    headerStyle: {
                        backgroundColor: Constants.backgroundDarkColors["Dashboard"],
                    },
                    headerTitleStyle
                }}
            />
            <AppStack.Screen
                name="MyQRCode"
                component={MyQRCode}
                options={{
                    headerTitle: 'Meu QR Code',
                    headerRight: () => logoutButton,
                    headerStyle: {
                        backgroundColor: Constants.backgroundDarkColors["MyQRCode"]
                    },
                    headerTitleStyle
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
            <AppStack.Screen
                name="Messages"
                component={MessageList}
                options={{
                    headerTitle: 'Mensagens',
                    headerRight: () => logoutButton,
                    headerStyle: {
                        backgroundColor: '#ddd'
                    },
                    headerTitleStyle
                }}
            />
            <AppStack.Screen
                name="Info"
                component={Info}
                options={{
                    headerTitle: 'Info',
                    headerRight: () => logoutButton,
                    headerStyle: {
                        backgroundColor: '#ddd'
                    },
                    headerTitleStyle
                }}
            />
            {
                AllRoutes.flatMap(route => route.map(el => (
                    <AppStack.Screen
                        key={el.name}
                        name={el.name}
                        component={el.component}
                        options={{
                            headerTitle: el.headerTitle,
                            headerRight: () => logoutButton,
                            headerStyle: {
                                backgroundColor: Constants.backgroundDarkColors[el.backgroundDarkColor]
                            },
                            headerTitleStyle
                        }}
                    />
                )))
            }
        </AppStack.Navigator>
    )
}

export default AppRoutes