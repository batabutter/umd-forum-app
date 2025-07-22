import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Header } from 'react-native-elements'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import EntypoIcon from "react-native-vector-icons/Entypo"
import { useGlobalContext } from '../context/GlobalProvider';
import Vote from './VoteBar';
import Comment from "./comment/Comment"
import BottomCommentBar from './comment/BottomCommentBar';
import { useLoadingContext, LoadingSpin } from '../context/LoadingProvider';
import CommentList from './comment/CommentList';

/*

Maybe create separate usestate for loading comments because I think it makes 
sense to do that separately

 I really need to create a coment list component

*/

const PostViewContent = ({ postId }) => {

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [ratio, setRatio] = useState(0)

    const { user } = useGlobalContext()
    const { isLoading, setIsLoading } = useLoadingContext()


    useFocusEffect(
        useCallback(() => {

            let isActive = true
            const fetchData = async () => {
                try {
                    setIsLoading(true)

                    const [resComments, resPost, resRatio] = await Promise.all([
                        fetch(`http://192.168.1.156:5000/posts/${postId}/comments`),
                        fetch(`http://192.168.1.156:5000/posts/${postId}`),
                        fetch(`http://192.168.1.156:5000/posts/${postId}/ratio`),
                    ]);

                    if (!resComments.ok || !resPost.ok || !resRatio.ok) {
                        throw new Error("One or more fetches failed");
                    }

                    const jsonComments = await resComments.json();
                    const jsonPost = await resPost.json();
                    const jsonRatio = await resRatio.json();

                    if (isActive) {
                        setComments(jsonComments);
                        setPost(jsonPost);
                        setRatio(jsonRatio.sum);
                    }



                } catch (error) {
                    console.log(error.message)
                } finally {
                    setIsLoading(false)
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

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <LoadingSpin
                    styleContainer={{ width: 50, height: 50 }}
                />
            </View>
        )

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


                <View className="flex-row justify-center items-center mt-5 gap-2">
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

                <CommentList
                    comments={comments}
                />

                <BottomCommentBar
                    postId={postId}
                />

            </View>


        </SafeAreaView>
    )
}

export default PostViewContent