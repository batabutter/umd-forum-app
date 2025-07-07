import { SafeAreaView, View, Text } from 'react-native'
import React from 'react'
import "../global.css";

const Post = () => {
    return (
        <SafeAreaView className="border-t-2 border-b-2 border-gray-600">

            <View className="flex-row">
                <Text className="fontpregular text-lg">0 comments</Text>

            </View>

            <View>
                <Text className="font-pbold text-3xl mb-4">Why do my balls itch?</Text>


                <Text className="font-plight">No matter how hard I stratch, they still itch</Text>
            </View>

            <View className="justify-end items-end flex-row">
                <Text className="font-pregular text-lg">0 upvotes </Text>
                <Text className="font-pregular text-lg">0 downvotes </Text>
            </View>

        </SafeAreaView>
    )
}

export default Post