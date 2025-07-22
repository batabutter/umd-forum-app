import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Header } from 'react-native-elements'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import EntypoIcon from "react-native-vector-icons/Entypo"

import Comment from "./Comment/Comment"
import { useGlobalContext } from '../context/GlobalProvider';
import Vote from './VoteBar';
import BottomCommentBar from './Comment/BottomCommentBar';

/*

This is so hard to read, I need to fix this once I get this working

*/

const PostViewContent = ({ postId }) => {

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [ratio, setRatio] = useState(0)

    const [loadComments, setLoadComments] = useState(false)

    const { user } = useGlobalContext()


    useFocusEffect(
        useCallback(() => {

            let isActive = true

            const fetchData = async () => {
                try {

                    const responseComments = await fetch(`http://192.168.1.156:5000/posts/${postId}/comments`)
                    const jsonDataComments = await responseComments.json()

                    if (isActive)
                        setComments(jsonDataComments)

                    const responsePost = await fetch(`http://192.168.1.156:5000/posts/${postId}`)
                    const jsonDataPost = await responsePost.json()

                    if (isActive)
                        setPost(jsonDataPost)

                    const responseRatio = await fetch(`http://192.168.1.156:5000/posts/${postId}/ratio`)
                    const jsonDataRatio = await responseRatio.json()

                    if (isActive)
                        setRatio(jsonDataRatio.sum)



                } catch (error) {
                    console.log(error.message)
                }
            }

            fetchData()

            return () => {
                isActive = false;
            };
        }, [postId])
    )

    const { title, content,
        num_comments } = post

    const RenderComments = () => {

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

    return (
        <SafeAreaView className="flex-1">
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: user.user_name, style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
                backgroundColor='#222831'
            />

            <View className="px-5 relative flex-1">
                <Text>
                    User name
                </Text>
                <Text>
                    Post ID : {postId}
                </Text>
                <Text className="font-pbold ml-6 text-3xl">
                    {title}
                </Text>

                <View className="border border-gray-600 min-h-40 mt-5 rounded-md">

                    <Text className=" ml-5 mt-5">
                        {content}
                    </Text>

                </View>


                <View className="flex-row justify-center items-center mt-5">
                    <Vote
                        postId={postId}
                        accountId={user.account_id}
                        voteRatio={ratio}
                        styleContainer={"w-[100px]"}
                        isComment={false}
                    />
                    <Text className="px-5 border border-gray-600 rounded-md">
                        {num_comments} Comments
                    </Text>

                </View>

                <RenderComments />

                <BottomCommentBar
                    postId={postId}
                />

            </View>


        </SafeAreaView>
    )
}

export default PostViewContent