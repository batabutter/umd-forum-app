import { SafeAreaView, View, Text, Touchable, TouchableOpacity } from 'react-native'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { router } from "expo-router"
import React from 'react'
import "../global.css";

const Post = ({ title, content, voteRatio, numcomments, post_id }) => {

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/postview',
                params: {
                    post_id: post_id
                },
            })}

        >
            <SafeAreaView className="border-b-2 border-gray-600">

                <View className="flex-row">
                    <Text className="fontpregular text-lg">{numcomments} comments</Text>

                </View>

                <View className="mr-10">
                    <Text className="font-pbold text-3xl mb-4">{title}</Text>


                    <Text className="font-plight">{content}</Text>
                </View>

                <View className="justify-end items-end flex-row">

                    <View className="border rounded-md border-gray-600 flex-row items-center px-5 ">


                        <TouchableOpacity>
                            <EntypoIcon
                                name="arrow-bold-up"
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                        <Text className="font-pregular text-lg ml-5 mr-6">{voteRatio}</Text>
                        <Text className="font-pregular">|</Text>

                        <TouchableOpacity className="ml-5">
                            <EntypoIcon
                                name="arrow-bold-down"
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>
                </View>

            </SafeAreaView>
        </TouchableOpacity>
    )
}

export default Post