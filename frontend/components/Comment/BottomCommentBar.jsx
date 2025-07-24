import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const BottomCommentBar = ({ postId }) => {
    return (

        <View className="w-full justify-center">

            <TouchableOpacity
                className="bg-black-100 rounded-md px-2 items-start py-2 w-full "
                onPress={() => router.push(
                    {
                        pathname: `/(postview)/commentview/`,
                        params: { id: postId }
                    })}>

                <View className="color-white rounded-md bg-slate-500 w-full justify-center py-2 px-2">
                    <Text className="color-white font-pmedium">
                        Add a comment
                    </Text>
                </View>


            </TouchableOpacity>
        </View>
    )
}

export default BottomCommentBar