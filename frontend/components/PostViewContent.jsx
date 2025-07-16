import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import EntypoIcon from "react-native-vector-icons/Entypo"

import Comment from "./Comment"

/*

Remember to change silliness

*/

const PostViewContent = ({ post_id }) => {

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [reload, setReload] = useState(false)

    console.log(post_id)

    const getComments = async () => {

        try {

            const response = await fetch(`http://192.168.1.156:5000/posts/${post_id}/comments`)
            const jsonData = await response.json()

            setComments(jsonData)
            setReload(false)
        } catch (error) {
            console.log(error.message)
        }

    }

    const getPost = async () => {

        try {
            const response = await fetch(`http://192.168.1.156:5000/posts/${post_id}`)

            const jsonData = await response.json()

            setPost(jsonData)

            console.log("Obatained post data")
            setReload(false)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getPost()
        getComments()
    }, [reload])

    const { title, content, upvotes, downvotes,
        num_comments } = post

    const renderComments = () => {

        if (comments != null && comments.length > 0) {
            return (
                <FlatList
                    data={comments}

                    renderItem={({ item }) =>
                        <Comment
                            content={item.content}
                            upvotes={item.upvotes}
                            downvotes={item.downvotes}
                            num_replies={item.num_replies}
                            post_id={item.post_id}
                        />
                    }

                    keyExtractor={item => item.comment_id}
                />
            )
        } else {
            return (
                <View className="justify-center items-center">
                    <Text className="mt-10 font-pbold">
                        There aren't any comments to show!
                    </Text>
                </View>
            )
        }

    }

    return (
        <SafeAreaView>
            <View className="px-5">
                <Text>
                    User name
                </Text>
                <Text className="font-pbold ml-6 text-3xl">
                    {title}
                </Text>

                <View className="border border-gray-600 min-h-40 mt-5 rounded-md">

                    <Text className=" ml-5 mt-5">
                        {content}
                    </Text>

                </View>

                <View className="min-h-10 mt-5 justify-center flex-row items-center">

                    <View className="border border-gray-600 rounded-md flex-row">

                        <TouchableOpacity
                            onPress={async () => {

                                try {
                                    const res = await fetch(`http://192.168.1.156:5000/posts/${post_id}/upvote`, {
                                        method: "PUT",
                                    });

                                    setReload(true)
                                } catch (error) {
                                    console.log(error.message)
                                }
                            }

                            }
                        >
                            <EntypoIcon
                                name="arrow-bold-up"
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                        <Text
                            className="px-5 ">
                            {upvotes - downvotes} |
                        </Text>

                        <TouchableOpacity

                            onPress={async () => {

                                try {
                                    const res = await fetch(`http://192.168.1.156:5000/posts/${post_id}/downvote`, {
                                        method: "PUT",
                                    });

                                    setReload(true)
                                } catch (error) {
                                    console.log(error.message)
                                }
                            }

                            }
                        >
                            <EntypoIcon
                                name="arrow-bold-down"
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>

                    <View>

                        <Text className="px-5 border border-gray-600 rounded-md">
                            {num_comments} Comments
                        </Text>

                    </View>

                </View>

                <View className="border border-gray-600 min-h-80 mt-5 rounded-md">
                        {renderComments()}
                </View>
            </View>

        </SafeAreaView>
    )
}

export default PostViewContent