import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CommentViewContent from '../../components/comment/CommentViewContent'

const Commentview = () => {

    const { id } = useLocalSearchParams()

    return (
        <View>
            <CommentViewContent
                postId={id}
            />
        </View>
    )
}

export default Commentview