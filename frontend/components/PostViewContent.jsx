import { SafeAreaView, View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const PostViewContent = () => {

    const { post_title, post_content } = useLocalSearchParams();
    console.log(post_content)

    return (
        <SafeAreaView>
            <View className="px-5">
                <Text className="text-gray-100">
                    User name
                </Text>
                <Text className="font-pbold ml-6 text-gray-100 text-3xl">
                    {post_title}
                </Text>

                <View className="border border-white min-h-40 mt-5 rounded-md">

                    <Text className="text-gray-100 ml-5 mt-5">
                        {post_content}
                    </Text>

                </View>

                <View className="min-h-10 mt-5 justify-center flex-row">

                    <Text className="px-5 text-gray-100 border border-white rounded-md">
                        Upvotes | Downvote
                    </Text>

                    <Text className="px-5 text-gray-100 border border-white rounded-md">
                        Comment
                    </Text>

                </View>

                <View className="border border-white h-full mt-5 rounded-md">

                </View>
            </View>

        </SafeAreaView>
    )
}

export default PostViewContent