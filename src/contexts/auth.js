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
        signIn: (email, password)=>{},
        signOut: ()=>{},
        errorMessage: false  
    }
)

export const AuthProvider = props =>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{
        const loadStoragegData = async () => {
            const storagedUser = await AsyncStorage.getItem('@QRSeg:user')
            const storagedToken = await AsyncStorage.getItem('@QRSeg:token')
            //await new Promise(resolve => setTimeout(resolve, 2000))///
            if(storagedUser && storagedToken){
                api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`
                setUser(JSON.parse(storagedUser))
                
            }
            setLoading(false)
        }
        loadStoragegData()
    }, [])

    const signInHandler = async (email, password) => {
        try{
            const response = await auth.signIn(email, password)

            setUser(response.user)

            api.defaults.headers['Authorization'] = `Bearer ${response.token}`
            setErrorMessage('')
            await AsyncStorage.setItem('@QRSeg:user', JSON.stringify(response.user))
            await AsyncStorage.setItem('@QRSeg:token', response.token)
        }
        catch(e){
            setErrorMessage(e.message)
        }
    }

    const signOutHandler = async _ => {
        AsyncStorage.clear().then(()=>{
            setUser(null)
        })
        
    }
    
    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn: signInHandler, signOut: signOutHandler, errorMessage: errorMessage }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = _ =>{
    const context = useContext(AuthContext)
    return context
}