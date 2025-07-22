import { SafeAreaView, View, Text, Touchable, TouchableOpacity } from 'react-native'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { router } from "expo-router"
import React, { useEffect, useState } from 'react'
import "../global.css";
import Vote from './VoteBar';
import { useGlobalContext } from '../context/GlobalProvider';
import { LoadingSpin } from '../context/LoadingProvider';

const Post = ({ title, content, numcomments, postId }) => {

    const { user } = useGlobalContext()
    const [isLoading, setIsLoading] = useState(false)
    const [voteBarReady, setVoteBarReady] = useState(true)

    if (!voteBarReady) {
        return (
            <LoadingSpin 
                styleContainer={{ width: 100, height: 100 }}
            />
        )
    }

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(postview)/${postId}`)}
        >
            <SafeAreaView className="border-b-2 border-gray-600">

                <View className="flex-row">
                    <Text className="font-pregular text-lg">{numcomments} comments</Text>

                </View>

                <View className="mr-10">
                    <Text className="font-pbold text-3xl mb-4">{title}</Text>


                    <Text className="font-plight">{content}</Text>
                </View>

                <View className="justify-end items-end flex-row">

                    <Vote
                        postId={postId}
                        accountId={user.account_id}
                        styleContainer={"w-[100px]"}
                        onRender={() => setVoteBarReady(true)}
                    />
                </View>

            </SafeAreaView>
        </TouchableOpacity>
    )
}

export default Post