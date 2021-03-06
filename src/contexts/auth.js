import React, {createContext, useState, useEffect, useContext} from 'react';
//import AsyncStorage from '@react-native-community/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import * as auth from '../services/auth'
import api from '../services/api'
import * as Utils from '../services/util'
import * as Constants from '../services/constants'

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
        const loadStorageData = async () => {
            const storagedUser = await AsyncStorage.getItem('@QRSeg:user')
            const storagedToken = await AsyncStorage.getItem('@QRSeg:token')
            if(storagedUser && storagedToken){
                api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`
                setUser(JSON.parse(storagedUser))
                
            }
            setLoading(false)
        }
        loadStorageData()
    }, [])

    const signInHandler = async (email, password) => {
        
        if(!Utils.validateEmail(email)){
            setErrorMessage('Email não válido.')
            return
        }
        if(password.length<Constants.MIN_PASSWORD_SIZE){
            setErrorMessage('Senha muito curta.')
            return
        }
        setLoading(true)
        api.post('/api/user/login', {
            email: email.toLowerCase(),
            password: password
        })
        .then(res=> {
            const token = res.data.token
            const user = {
                name: res.data.name,
                id: res.data.userId,
                user_kind: res.data.user_kind,
                email: res.data.username,
                condo_id: res.data.condo_id,
                condo: res.data.condo,
                bloco_id: res.data.bloco_id,
                number: res.data.number,
            }
            setUser(user)
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            setErrorMessage('')
            AsyncStorage.setItem('@QRSeg:user', JSON.stringify(user)).then()
            AsyncStorage.setItem('@QRSeg:token', token).then()
        })
        .catch((err)=> {
            setErrorMessage(err.response?.data?.message || 'Erro no login. Tente de novo.')
        })
        .finally(()=>{
            setLoading(false)
        })
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