import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import EditPostView from '../../components/post/EditPostView'

const editview = () => {

    const { id } = useLocalSearchParams()

    return (
        <EditPostView postId = {id}/>
    )
}

export default editview