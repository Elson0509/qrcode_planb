import React, {createContext, useState, useEffect} from 'react';
//import AsyncStorage from '@react-native-community/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as auth from '../services/auth'
import {View, ActivityIndicator} from 'react-native'

//createContext only set up the format of the variable
const AuthContext = createContext({ signed: false, user: {}, signIn: ()=>{}, signOut: ()=>{}  })

export const AuthProvider = props =>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const loadStoragegData = async () => {
            const storagedUser = await AsyncStorage.getItem('@QRSeg:user')
            const storageToken = await AsyncStorage.getItem('@QRSeg:token')
            await new Promise(resolve => setTimeout(resolve, 2000))
            if(storagedUser && storageToken){
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
        await AsyncStorage.setItem('@QRSeg:user', JSON.stringify(response.user))
        await AsyncStorage.setItem('@QRSeg:token', response.token)
    }

    const signOutHandler = async _ => {
        AsyncStorage.clear().then(()=>{
            setUser(null)
        })
        
    }

    if(loading){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#666"/>
            </View>
        )
    }
    
    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn: signInHandler, signOut: signOutHandler }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;