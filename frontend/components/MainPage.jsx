import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Header } from 'react-native-elements'

import Post from "./Post"
import { useGlobalContext } from '../context/GlobalProvider';
import { LoadingSpin } from '../context/LoadingProvider';

/*

There should really be a list posts component to handle loading 

Goal: Make it so main page only shows 6 posts at onces, loads more when needed

*/

const NUM_POSTS_TO_LOAD = 6

const MainPage = () => {

    const [currposts, setCurrPosts] = useState([]);
    const { user } = useGlobalContext()
    const [postCount, setPostCount] = useState(NUM_POSTS_TO_LOAD)

    // For now, I am just using a placeholder account

    const getPosts = async () => {
        try {
            const response = await fetch(`http://192.168.1.156:5000/getPosts/${postCount}`)
            const jsonData = await response.json()
            setCurrPosts(jsonData)
        } catch (error) {
            console.log(error.message)
        }
    }

    useFocusEffect(
        useCallback(() => {
            setPostCount(6)
        }, [])
    )

    useEffect(() => {
        getPosts()
    }, [postCount])

    const renderList = (postData) => {

        if (postData != null && postData.length > 0) {

            return (
                <FlatList
                    data={postData}

                    renderItem={({ item }) =>
                        <Post
                            title={item.title}
                            content={item.content}
                            numcomments={item.num_comments}
                            postId={item.post_id}
                        />}

                    keyExtractor={item => item.post_id}
                    onEndReached={() => {
                        setPostCount(postCount + NUM_POSTS_TO_LOAD)
                    }}
                    ListFooterComponent={<LoadingSpin
                        styleContainer={{ width: 30, height: 30 }}
                    />}
                />
            )
        } else {
            return (
                <View className="justify-center items-center">
                    <Text className="mt-10 font-pbold">
                        There aren't any posts to show!
                    </Text>
                </View>
            )
        }

    }

    return (
        <SafeAreaView className="flex-1">
            {renderList(currposts)}
        </SafeAreaView>
    )
}

export default MainPage