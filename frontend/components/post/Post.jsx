import { SafeAreaView, View, Text, Touchable, TouchableOpacity } from 'react-native'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { router } from "expo-router"
import React, { useEffect, useState } from 'react'
import Vote from '../buttons/VoteBar';
import { useGlobalContext } from '../../context/GlobalProvider';
import { LoadingSpin } from '../../context/LoadingProvider';

const Post = ({ title, content, numcomments, postId }) => {

    const { user } = useGlobalContext()
    const [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
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


                <View className="ml-5">

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
                            postType={"posts"}
                        />
                    </View>
                </View>

            </SafeAreaView>
        </TouchableOpacity>
    )
}

export default Post