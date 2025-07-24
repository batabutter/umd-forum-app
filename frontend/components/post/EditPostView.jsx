import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Header, Icon } from 'react-native-elements'
import React, { useCallback, useState } from 'react'
import CloseButton from '../buttons/CloseButton'
import DynamicButton from '../buttons/DynamicButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { router, useFocusEffect } from 'expo-router'
import LoadingSpin, { useLoadingContext } from '../../context/LoadingProvider'

const EditPostView = ({ postId }) => {

    const { user } = useGlobalContext()
    const { isLoading, setIsLoading } = useLoadingContext()
    const [postTitle, setPostTitle] = useState("")
    const [bodyText, setBodytext] = useState("")

    const editPost = async (body) => {
        try {
            if (bodyText.length != 0) {
                const res = await fetch(`http://192.168.1.156:5000/accounts/${user.account_id}/posts/${postId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            content: body
                        })
                    }
                )

                if (!res.ok)
                    throw new Error(`Error editing > ` + res.status)

                const jsonData = res.json()

            }

        } catch (error) {
            console.log(error.message)
        } finally {
            router.push(`/(postview)/${postId}`)
            console.log("Post edited!!!")
        }
    }

    useFocusEffect(
        useCallback(() => {

            let isActive = true

            const fetchData = async () => {
                try {
                    setIsLoading(true)
                    console.log("here > " + postId)
                    const res = await fetch(`http://192.168.1.156:5000/posts/${postId}`)
                    const jsonData = await res.json()

                    if (!res.ok)
                        throw new Error(`Server error ${res.status}`)

                    if (isActive) {
                        setPostTitle(jsonData.title)
                        setBodytext("")
                    }

                    console.log(jsonData)

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

        }, [])
    )

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
        <View>

            <Header
                leftComponent={<CloseButton routeDestination={`/(postview)/${postId}`} />}
                rightComponent={
                    <DynamicButton
                        text="Edit"
                        styleContainer="w-[150px] bg-cornflower"
                        handlePress={() => editPost(bodyText)}
                    />}
                backgroundColor='#222831'
            />

            <View>
                <Text>
                    Curr account: {user.user_name}
                </Text>

                <View className="border border-gray-200 rounded-md justify-center">
                    <View className="h-32 borde1r justify-center">
                        <Text className="text-3xl font-pregular">{postTitle}</Text>
                    </View>
                    <TextInput className="font-pregular"
                        onChangeText={setBodytext}
                        placeholder='Body'
                        value={bodyText}
                    />
                </View>

            </View>
        </View>
    )
}

export default EditPostView