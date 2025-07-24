import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'

const DeletePostButton = ({ postId }) => {
    return (
        <TouchableOpacity className="flex-row items-center gap-2">
            <Icon name="delete" size={30} color="#fff" />
            <Text className="font-psemibold text-white text-3xl">Delete Post</Text>
        </TouchableOpacity>
    )
}

export default DeletePostButton