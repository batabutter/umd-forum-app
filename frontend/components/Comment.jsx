import { View, Text } from 'react-native'
import React from 'react'

const Comment = ({ title, content, upvotes, downvotes, comment_id, num_replies }) => {
    return (
        <View className="border border-b-1 border-gray-600 px-5">
            <View className="mb-5">

                <Text className="text-2xl">
                    {content}
                </Text>

            </View>
        </View>
    )
}

export default Comment