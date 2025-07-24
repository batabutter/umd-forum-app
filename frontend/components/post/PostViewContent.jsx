import { SafeAreaView, View, Text, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Header, Icon } from 'react-native-elements'
import { useFocusEffect } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from "expo-router"
import Vote from '../buttons/VoteBar';
import BottomCommentBar from '../comment/BottomCommentBar';
import { useLoadingContext, LoadingSpin } from '../../context/LoadingProvider';
import CommentList from '../comment/CommentList';
import PostDotsOptions from '../buttons/PostDotsOptions';


/*

    Clean up the fetch requests

*/

const PostViewContent = ({ postId }) => {

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [ratio, setRatio] = useState(0)
    const [poster, setPoster] = useState("")
    const [posterId, setPosterId] = useState("")

    const { user } = useGlobalContext()
    const { isLoading, setIsLoading } = useLoadingContext()
    const [voteBarReady, setVoteBarReady] = useState(true)


    useFocusEffect(
        useCallback(() => {

            let isActive = true
            const fetchData = async () => {
                try {
                    setIsLoading(true)

                    const [resComments, resPost, resRatio, resPoster, resPosterId] = await Promise.all([
                        fetch(`http://192.168.1.156:5000/posts/${postId}/comments`),
                        fetch(`http://192.168.1.156:5000/posts/${postId}`),
                        fetch(`http://192.168.1.156:5000/posts/${postId}/ratio`),
                        fetch(`http://192.168.1.156:5000/posts/${postId}/poster`),
                        fetch(`http://192.168.1.156:5000/posts/${postId}/poster_id`),
                    ]);

                    if (!resComments.ok || !resPost.ok || !resRatio.ok) {
                        throw new Error("One or more fetches failed");
                    }

                    const jsonComments = await resComments.json();
                    const jsonPost = await resPost.json();
                    const jsonRatio = await resRatio.json();
                    const jsonPoster = await resPoster.json()
                    const jsonPosterId = await resPosterId.json()

                    if (isActive) {
                        setComments(jsonComments);
                        setPost(jsonPost);
                        setRatio(jsonRatio.sum);
                        setPoster(jsonPoster.user_name)
                        setPosterId(jsonPosterId.account_id)
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
    /*
        For now, bring to homepage, but in future, the course section you're
        posting in
    */

    const BackArrow = () => {
        return (
            <TouchableOpacity
                className="justify-center items-center flex-1"
                onPress={() => router.push(`/(home)/homepage`)}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        )
    }

    const Home = () => {
        return (
            <TouchableOpacity
                className="justify-center items-center flex-1"
                onPress={() => router.push(`/(home)/homepage`)}>
                <Icon name="home" size={24} color="#fff" />
            </TouchableOpacity>
        )
    }

    if (isLoading || !voteBarReady) {
        return (
            <View className="flex-1 items-center justify-center">
                <LoadingSpin
                    styleContainer={{ width: 50, height: 50 }}
                />
            </View>
        )

    }

    const CheckPoster = () => {
        if (user.account_id == posterId)
            return (
                <PostDotsOptions postId={postId}/>
            )
    }

    return (
        <View className="flex-1">
            <Header
                leftComponent={<BackArrow />}
                centerComponent={{ text: user.user_name, style: { color: '#fff' } }}
                rightComponent={<Home />}
                backgroundColor='#222831'
            />

            <View className="px-5 relative flex-1 h-full w-full">

                <View>


                    <View>

                        <Text className="font-psemibold"> {poster} asks... </Text>
                        <Text> Post ID : {postId} </Text>
                        <View className="justify-between flex-row">
                            <Text className="font-pbold text-3xl"> {title} </Text>
                            <CheckPoster />
                        </View>

                    </View>

                    <View className="border border-gray-600 min-h-40 mt-5 rounded-md">

                        <Text className=" ml-5 mt-5"> {content} </Text>

                    </View>

                    <View className="flex-row justify-center items-center mt-5 gap-2">
                        <Vote
                            postId={postId}
                            accountId={user.account_id}
                            voteRatio={ratio}
                            styleContainer={"w-[100px]"}
                            postType={"posts"}
                        />
                        <Text className="px-5 border border-gray-600 rounded-md">
                            {num_comments} Comments
                        </Text>

                    </View>
                </View>

                <CommentList comments={comments} />


            </View>
            
            <BottomCommentBar postId={postId} />
        </View>
    )
}

export default PostViewContent