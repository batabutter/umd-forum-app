import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'
import { router } from 'expo-router'

const CloseButton = ({ routeDestination }) => {
    return (
        <TouchableOpacity
            className="justify-center items-center flex-1"
            onPress={() => router.push(routeDestination)}>
            <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
    )
}

export default CloseButton