import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from "expo-router"
import DynamicButton from '../buttons/DynamicButton'
import { Header, Icon } from 'react-native-elements'
import { useGlobalContext } from '../../context/GlobalProvider'

const CreateCommentView = ({ postId }) => {

    const [post, setPost] = useState([])
    const [bodyText, setBodytext] = useState("")
    const { user } = useGlobalContext()

    const getPost = async () => {

        try {
            const response = await fetch(`http://192.168.1.156:5000/posts/${postId}`)

            const jsonData = await response.json()

            setPost(jsonData)
        } catch (error) {
            console.log(error.message)
        }
    }

    const publishComment = async (body) => {
        try {
            console.log("Commenting...")
            if (bodyText != "") {
                await fetch(`http://192.168.1.156:5000/posts/${postId}/comments/${user.account_id}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            content: body
                        })
                    }
                )

            }

            router.push(`/(postview)/${postId}`)

            console.log("Comment created!!!")

        } catch (error) {
            console.log(error.message)
        }
    }

    const CloseButton = () => {
        return (
            <TouchableOpacity
             className="justify-center items-center flex-1"
                onPress={() => router.push(`/(postview)/${postId}`)}>
                <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
        )
    }



    useEffect(() => {
        getPost()
    }, [])

    return (
        <View>
            <Header
                leftComponent={<CloseButton />}
                rightComponent={
                    <DynamicButton
                        text="Post"
                        styleContainer="w-[150px] h-[50px] bg-slate-500"
                        handlePress={() => publishComment(bodyText)}
                    />}
                backgroundColor='#222831'
                className="items-center justify-center"
            />

            <View className="border-b-2 border-gray-600">
                <Text className="text-3xl py-5">{post.title}</Text>
            </View>

            <View className="border border-gray-200 rounded-md h-full">
                <TextInput className="font-pregular h-full"
                    onChangeText={setBodytext}
                    placeholder='Type your comment here...'
                    value={bodyText}
                    textAlignVertical='top'
                />

            </View>
        </View>
    )
}

export default CreateCommentView