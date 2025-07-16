import { createContext, useContext, useState } from "react";
import { View, Text } from 'react-native'
import React from 'react'

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {

    const [user, setUser] = useState("michaelmorton")

    return (
        <GlobalContext.Provider value={{
            user, setUser
        }}>
            {children}

        </GlobalContext.Provider>
    )
}

export default GlobalProvider