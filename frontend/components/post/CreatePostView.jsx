import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Header, Icon } from 'react-native-elements'
import { useGlobalContext } from '../../context/GlobalProvider'
import { router, useFocusEffect, useNavigation } from "expo-router"

import DynamicButton from "../buttons/DynamicButton"
import CloseButton from '../buttons/CloseButton'
import { useLoadingContext } from '../../context/LoadingProvider'

const CreatePostView = () => {
    const [account, setAccount] = useState([])
    const [titleText, setTitleText] = useState("")
    const [bodyText, setBodytext] = useState("")
    const { user } = useGlobalContext()
    const { isLoading, setIsLoading } = useLoadingContext()
    const navigation = useNavigation()

    const publishPost = async (title, body) => {
        try {
            console.log("Posting...")
            if (titleText.length != 0 && bodyText.length != 0) {
                await fetch(`http://192.168.1.156:5000/accounts/${user.account_id}/posts`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: title,
                            content: body
                        })
                    }
                )

            }
            router.push(`/(home)/homepage`)
            console.log("Post created!!!")


        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        })
    }, [navigation])

    useFocusEffect(
        useCallback(() => {
            setTitleText("")
            setBodytext("")
        }, [])
    )


    return (
        <>

            <View>

                <Header
                    leftComponent={<CloseButton routeDestination={"/(home)/homepage"} />}
                    centerComponent={{ text: "", style: { color: '#fff' } }}
                    rightComponent={
                        <DynamicButton
                            text="Post"
                            styleContainer="w-[150px] bg-secondary"
                            handlePress={() => publishPost(titleText, bodyText)}
                        />}
                    backgroundColor='#222831'
                />

                <View>
                    <Text>
                        Curr account: {user.user_name}
                    </Text>

                    <View className="border border-gray-200 rounded-md">
                        <TextInput
                            className="text-3xl font-pregular h-32"
                            onChangeText={setTitleText}
                            placeholder='Title'
                            value={titleText}
                        />
                        <TextInput className="font-pregular"
                            onChangeText={setBodytext}
                            placeholder='Body'
                            value={bodyText}
                        />
                    </View>

                </View>
            </View>

        </>
    )
}

export default CreatePostView