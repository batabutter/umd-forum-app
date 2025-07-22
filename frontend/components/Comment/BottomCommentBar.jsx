import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const BottomCommentBar = ({ postId }) => {
    return (

        <TouchableOpacity 
            className="absolute bg-black-100 h-16 rounded-md px-2 bottom-0 left-0 right-0 items-start py-2"
            onPress={() => router.push(
                {
                    pathname:`/(postview)/commentview/`,
                    params:{id:postId}
                })}>

            <View className="color-white rounded-md bg-slate-500 w-full justify-center py-2 px-2">
                <Text className="color-white font-pmedium">
                    Add a comment
                </Text>
            </View>


        </TouchableOpacity>

    )
}

export default BottomCommentBar