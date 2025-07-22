import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Comment from "./Comment"

const CommentList = ({ comments }) => {

    const [render, setRender] = useState(false)
    if (comments != null && comments.length > 0) {
        return (
            <View className="mt-5 rounded-md flex-1 max-h-96">

                <FlatList
                    data={comments}

                    renderItem={({ item }) =>
                        <Comment
                            content={item.content}
                            upvotes={item.upvotes}
                            downvotes={item.downvotes}
                            num_replies={item.num_replies}
                            commentId={item.comment_id}
                        />
                    }

                    keyExtractor={item => item.comment_id}
                />

            </View>

        )
    } else {
        return (
            <View className="justify-center items-center border border-gray-600 min-h-80 mt-5 rounded-md">
                <Text className="mt-10 font-pbold">
                    There aren't any comments to show!
                </Text>
            </View>
        )
    }
}

export default CommentList