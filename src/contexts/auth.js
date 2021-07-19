import React, {createContext, useState, useEffect, useContext} from 'react';
//import AsyncStorage from '@react-native-community/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as auth from '../services/auth'
import api from '../services/api'

//createContext only set up the format of the variable
const AuthContext = createContext(
    {
        signed: false,
        user: {},
        loading: false,
        signIn: ()=>{},
        signOut: ()=>{}  
    }
)

export const AuthProvider = props =>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const loadStoragegData = async () => {
            const storagedUser = await AsyncStorage.getItem('@QRSeg:user')
            const storagedToken = await AsyncStorage.getItem('@QRSeg:token')
            await new Promise(resolve => setTimeout(resolve, 2000))///
            if(storagedUser && storagedToken){
                api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`
                setUser(JSON.parse(storagedUser))
                
            }
            setLoading(false)
        }
        loadStoragegData()
    }, [])

    const signInHandler = async _ => {
        const response = await auth.signIn()
        console.log(response)
        setUser(response.user)

        api.defaults.headers['Authorization'] = `Bearer ${response.token}`

        await AsyncStorage.setItem('@QRSeg:user', JSON.stringify(response.user))
        await AsyncStorage.setItem('@QRSeg:token', response.token)
    }

    const signOutHandler = async _ => {
        AsyncStorage.clear().then(()=>{
            setUser(null)
        })
        
    }
    
    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn: signInHandler, signOut: signOutHandler }}>
            {props.children}
        </AuthContext.Provider>
    )
}

//export default AuthContext;

export const useAuth = _ =>{
    const context = useContext(AuthContext)
    return context
}