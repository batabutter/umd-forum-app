import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Header } from 'react-native-elements'

import Post from "./post/Post"
import { useGlobalContext } from '../context/GlobalProvider';
import { useLoadingContext, LoadingSpin } from '../context/LoadingProvider';

/*

Update in the future to handle and load the number of popular posts, 
but the numposts logic is a great start

*/

const NUM_POSTS_TO_LOAD = 6

const MainPage = () => {

    const [currposts, setCurrPosts] = useState([]);
    const { user } = useGlobalContext()
    const [loadedPostOffset, setLoadedPostOffset] = useState(0)
    const [totalPostCount, setTotalPostCount] = useState(0)
    const { isLoading, setIsLoading } = useLoadingContext()

    // For now, I am just using a placeholder account

    const getPosts = async () => {
        try {
            const response = await fetch(`http://192.168.1.156:5000/getPosts/${NUM_POSTS_TO_LOAD}/${loadedPostOffset}`)

            if (!response.ok)
                        throw new Error(`Server error ${response.status}`)

            const jsonData = await response.json()
            /*
                Check to make sure you're not appending the own list
            */
            if (loadedPostOffset != 0 && jsonData.length != 0) {
                setCurrPosts(currposts => [...currposts, ...jsonData])
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    useFocusEffect(
        useCallback(() => {
            let isActive = true

            const fetchInital = async () => {
                setIsLoading(true)
                try {
                    const resPost = await fetch(`http://192.168.1.156:5000/getPosts/6`)
                    const jsonDataPost = await resPost.json()

                    if (!resPost.ok)
                        throw new Error(`Server error ${resPost.status}`)

                    const resNumPosts = await fetch(`http://192.168.1.156:5000/count/posts`)
                    const jsonDataCount = await resNumPosts.json()

                    if (!resNumPosts.ok)
                        throw new Error(`Sever error ${resNumPosts.status}`)

                    if (isActive) {
                        setCurrPosts(jsonDataPost)
                        setTotalPostCount(jsonDataCount.count)
                        setLoadedPostOffset(0)
                    }


                } catch (error) {
                    console.log(error.message)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchInital()
            
            return () => {
                isActive = false;
            };

        }, [])
    )

    useEffect(() => {
        getPosts()
    }, [loadedPostOffset])

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <LoadingSpin
                    styleContainer={{ width: 50, height: 50 }}
                />
            </View>
        )

    }


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
                        let temp = loadedPostOffset + NUM_POSTS_TO_LOAD
                        if (temp < totalPostCount)
                            setLoadedPostOffset(temp) 
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