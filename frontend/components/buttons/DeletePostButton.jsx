import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'
import { useGlobalContext } from '../../context/GlobalProvider'
import { router } from 'expo-router'

const DeletePostButton = ({ postId }) => {

    const { user } = useGlobalContext()

    const deletePost = async () => {
        try {
           const res = await fetch(`http://192.168.1.156:5000/accounts/${user.account_id}/posts/${postId}`,
                    {
                        method: "DELETE"
                    }
                )

            const jsonData = await res.json()

        } catch (error) {
            console.log(error.message)
        } finally {
            console.log("Post deleted!")
            router.push(`/(home)/homepage`)
        }
    }



    return (
        <TouchableOpacity 
            className="flex-row items-center gap-2"
            onPress={deletePost}
            >
            <Icon name="delete" size={30} color="#fff" />
            <Text className="font-psemibold text-white text-3xl">Delete Post</Text>
        </TouchableOpacity>
    )
}

export default DeletePostButton