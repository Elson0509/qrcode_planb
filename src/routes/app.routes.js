import React from 'react';
import Dashboard from '../pages/Dashboard'
import { StyleSheet,
    Button
    } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../contexts/auth'
import MyQRCode from '../pages/MyQRCode';
import Scan from '../pages/Scan';
import CameraPic from '../pages/CameraPic'
import Residents from '../pages/Residents'
import Visitors from '../pages/Visitors'
import VisitorAdd from '../pages/VisitorAdd';
import VisitorList from '../pages/VisitorList';
import VisitorEdit from '../pages/VisitorEdit';
import Thirds from '../pages/Thirds'
import ThirdAdd from '../pages/ThirdAdd';
import ThirdList from '../pages/ThirdList';
import ThirdEdit from '../pages/ThirdEdit';
import Units from '../pages/Units'
import UnitAdd from '../pages/UnitAdd'
import UnitList from '../pages/UnitList'
import ResidentAdd from '../pages/ResidentAdd'
import ResidentList from '../pages/ResidentList'
import ResidentEdit from '../pages/ResidentEdit'
import * as Constants from '../services/constants'

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
                name="CameraPic" 
                component={CameraPic}
                options={{
                    headerShown: false
                }}
            />
            <AppStack.Screen 
                name="Residents" 
                component={Residents}
                options={{
                    headerTitle: 'Moradores',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Residents"]
                    }
                }}
            />
            <AppStack.Screen 
                name="Visitors" 
                component={Visitors}
                options={{
                    headerTitle: 'Visitantes',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Visitors"]
                    }
                }}
            />
            <AppStack.Screen 
                name="VisitorAdd" 
                component={VisitorAdd}
                options={{
                    headerTitle: 'Adicionar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Visitors"]
                    }
                }}
            />
            <AppStack.Screen 
                name="VisitorList" 
                component={VisitorList}
                options={{
                    headerTitle: 'Listar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Visitors"]
                    }
                }}
            />
            <AppStack.Screen 
                name="VisitorEdit" 
                component={VisitorAdd}
                options={{
                    headerTitle: 'Editar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Visitors"]
                    }
                }}
            />
            <AppStack.Screen 
                name="Thirds" 
                component={Thirds}
                options={{
                    headerTitle: 'Terceirizados',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Thirds"]
                    }
                }}
            />
            <AppStack.Screen 
                name="ThirdAdd" 
                component={ThirdAdd}
                options={{
                    headerTitle: 'Adicionar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Thirds"]
                    }
                }}
            />
            <AppStack.Screen 
                name="ThirdList" 
                component={ThirdList}
                options={{
                    headerTitle: 'Listar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Thirds"]
                    }
                }}
            />
            <AppStack.Screen 
                name="ThirdEdit" 
                component={ThirdAdd}
                options={{
                    headerTitle: 'Editar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Thirds"]
                    }
                }}
            />
            <AppStack.Screen 
                name="Units" 
                component={Units}
                options={{
                    headerTitle: 'Unidades',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Units"]
                    }
                }}
            />
            <AppStack.Screen 
                name="UnitAdd" 
                component={UnitAdd}
                options={{
                    headerTitle: 'Adicionar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Units"],
                        
                    }
                }}
            />
            <AppStack.Screen 
                name="UnitList" 
                component={UnitList}
                options={{
                    headerTitle: 'Listar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Units"]
                    }
                }}
            />
            <AppStack.Screen 
                name="ResidentAdd" 
                component={ResidentAdd}
                options={{
                    headerTitle: 'Adicionar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Residents"]
                    }
                }}
            />
            <AppStack.Screen 
                name="ResidentEdit" 
                component={ResidentAdd}
                options={{
                    headerTitle: 'Editar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Residents"]
                    }
                }}
            />
            <AppStack.Screen 
                name="ResidentList" 
                component={ResidentList}
                options={{
                    headerTitle: 'Listar',
                    headerRight: ()=> logoutButton,
                    headerStyle:{
                        backgroundColor: Constants.backgroundDarkColors["Residents"]
                    }
                }}
            />
        </AppStack.Navigator>
    )
}

export default AppRoutes