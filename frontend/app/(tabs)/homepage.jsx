import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Header } from 'react-native-elements'

import "../../global.css";
import Post from '../../components/Post';
import { useGlobalContext } from '../../context/GlobalProvider';

const homepage = () => {

    const [currposts, setCurrPosts] = useState([]);
    const { user } = useGlobalContext()

    // For now, I am just using a placeholder account

    const getPosts = async () => {
        try {
            const response = await fetch("http://192.168.1.156:5000/posts")
            const jsonData = await response.json()

            setCurrPosts(jsonData)
        } catch (error) {
            console.log(error.message)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getPosts()
            console.log("Rendering homepage...")
        }, [])
    )
    const renderList = (postData) => {

        if (postData != null && postData.length > 0) {

            return (
                <FlatList
                    data={postData}
                    ListHeaderComponent={() => {
                        
                        const { user } = useGlobalContext()

                        return (
                            <Header
                                leftComponent={{ icon: 'menu', color: '#fff' }}
                                centerComponent={{ text: user, style: { color: '#fff' } }}
                                rightComponent={{ icon: 'home', color: '#fff' }}
                                backgroundColor='#222831'
                            />
                        )

                    }}

                    renderItem={({ item }) =>
                        <Post
                            title={item.title}
                            content={item.content}
                            upvotes={item.upvotes}
                            downvotes={item.downvotes}
                            numcomments={item.num_comments}
                            post_id={item.post_id}
                        />}

                    keyExtractor={item => item.post_id}
                />
            )
        } else {
            return (
                <View className="justify-center items-center">
                    <Header
                        leftComponent={{ icon: 'menu', color: '#fff' }}
                        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                        rightComponent={{ icon: 'home', color: '#fff' }}
                    />
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

export default homepage