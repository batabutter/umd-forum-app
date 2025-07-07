import { SafeAreaView, View, Text } from 'react-native'
import React from 'react'
import "../global.css";

const Post = ({ title, content, upvotes, downvotes, numcomments }) => {
    return (
        <SafeAreaView className="border-t-2 border-b-2 border-gray-600">

            <View className="flex-row">
                <Text className="fontpregular text-lg">{numcomments} comments</Text>

            </View>

            <View>
                <Text className="font-pbold text-3xl mb-4">{title}</Text>


                <Text className="font-plight">{content}</Text>
            </View>

            <View className="justify-end items-end flex-row">
                <Text className="font-pregular text-lg">{upvotes} upvotes </Text>
                <Text className="font-pregular text-lg">{downvotes} downvotes </Text>
            </View>

        </SafeAreaView>
    )
}

export default Post