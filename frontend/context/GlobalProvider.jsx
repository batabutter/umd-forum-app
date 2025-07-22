import { createContext, useContext, useEffect, useState } from "react";
import { View, Text } from 'react-native'
import React from 'react'

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

/*

temporary obtaining of account, this WILL be changed in the future.

Uses first account in table as test

*/

const GlobalProvider = ({ children }) => {

    const [user, setUser] = useState([])

    const getAccount = async () => {

        try {
            const response = await fetch(`http://192.168.1.156:5000/accounts`)
            const jsonData = await response.json()


            /*
            What is going on here, how does it not work here, but it works 
            somewhere else
            */
            setUser(jsonData[0])
        } catch (error) {
            console.log(error.message)
        }

    }

    useEffect(() => {
        getAccount()
    }, [])


    return (
        <GlobalContext.Provider value={{
            user, setUser
        }}>
            {children}

        </GlobalContext.Provider>
    )
}

export default GlobalProvider