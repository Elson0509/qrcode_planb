import React, {createContext, useState} from 'react';
import * as auth from '../services/auth'

//createContext only set up the format of the variable
const AuthContext = createContext({ signed: false, user: {}, signIn: ()=>{}, signOut: ()=>{}  })

export const AuthProvider = props =>{
    const [user, setUser] = useState(null)

    const signInHandler = async _ => {
        const response = await auth.signIn()
        console.log(response)
        setUser(response.user)
    }

    const signOutHandler = async _ => {
        setUser(null)
    }
    
    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn: signInHandler, signOut: signOutHandler }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;