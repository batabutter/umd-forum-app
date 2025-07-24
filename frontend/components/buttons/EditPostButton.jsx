import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'
import { router } from 'expo-router'

const EditPostButton = ({ postId }) => {

    return (
        <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => router.push(
                {
                    pathname: `/(postview)/editview/`,
                    params: { id: postId }
                })}
            >
            <Icon name="edit" size={30} color="#fff" />
            <Text className="font-psemibold text-white text-3xl">Edit Post</Text>
        </TouchableOpacity>
    )
}

export default EditPostButton