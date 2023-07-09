import React, { createContext, useEffect, useState } from "react"
import { config } from '../config'
// import { useNavigate } from "react-router-dom"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [login, setLogin] = useState(false)


    //if (!firebase.apps.length) firebase.initializeApp(config)


    // useEffect(() => {
    //     // if (!user) setUser(firebase.auth().currentUser)
    //     if (firebase.auth().currentUser) {
    //         setUser(user)
    //         setLogin(true)
    //     }
    // }, [user])

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext










