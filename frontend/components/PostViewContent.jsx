import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Header } from 'react-native-elements'
import { useLocalSearchParams } from 'expo-router';
import EntypoIcon from "react-native-vector-icons/Entypo"

import Comment from "./Comment"
import { useGlobalContext } from '../context/GlobalProvider';
import Vote from './VoteBar';

/*

This is so hard to read, I need to fix this once I get this working

*/

const PostViewContent = ({ postId }) => {

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [ratio, setRatio] = useState(0)
    const [reload, setReload] = useState(false)

    const { user } = useGlobalContext()

    const getComments = async () => {

        try {

            const response = await fetch(`http://192.168.1.156:5000/posts/${postId}/comments`)
            const jsonData = await response.json()

            setComments(jsonData)
            setReload(false)
        } catch (error) {
            console.log(error.message)
        }

    }

    const getPost = async () => {

        try {
            const response = await fetch(`http://192.168.1.156:5000/posts/${postId}`)

            const jsonData = await response.json()

            setPost(jsonData)
            setReload(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    const getRatio = async () => {

        try {
            const response = await fetch(`http://192.168.1.156:5000/posts/${postId}/ratio`)
            const jsonData = await response.json()
            setRatio(jsonData.sum)
            setReload(false)
        } catch (error) {
            console.log(error.message)
        }
    }


    useEffect(() => {
        getPost()
        getComments()
        getRatio()
    }, [reload])

    const { title, content,
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
                            postId={item.postId}
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
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: user.user_name, style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
                backgroundColor='#222831'
            />

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


                <View className="flex-row justify-center items-center mt-5">
                    <Vote
                        postId={postId}
                        accountId={user.account_id}
                        voteRatio={ratio}
                        styleContainer={"w-[100px]"}
                    />
                    <Text className="px-5 border border-gray-600 rounded-md">
                        {num_comments} Comments
                    </Text>

                </View>



                <View className="border border-gray-600 min-h-80 mt-5 rounded-md">
                    {renderComments()}
                </View>
            </View>

        </SafeAreaView>
    )
}

export default PostViewContent