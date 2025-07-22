import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalContext } from "../context/GlobalProvider"

const SwitchAccountButton = ({ text, styleContainer, username }) => {

    const { setUser, user } = useGlobalContext()

    const switchAccount = async () => {

        try {

            console.log("Current user > " + user.user_name)

            const response = await fetch(`http://192.168.1.156:5000/accounts/${username}`)

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const jsonData = await response.json()

            if (!jsonData)
                throw new Error(`User does not exist`)

            setUser(jsonData)

            console.log("Now user > ")
            console.log(jsonData)
        } catch (error) {
            console.log(error.message)
        }

    }


    return (
        <TouchableOpacity
            className={`${styleContainer}`}
            onPress={switchAccount}
        >
            <Text className="text-3xl">
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default SwitchAccountButton