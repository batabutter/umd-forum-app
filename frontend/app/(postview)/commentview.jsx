import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CreateCommentView from '../../components/comment/CreateCommentView'

const Commentview = () => {

    const { id } = useLocalSearchParams()

    return (
        <View>
            <CreateCommentView
                postId={id}
            />
        </View>
    )
}

export default Commentview