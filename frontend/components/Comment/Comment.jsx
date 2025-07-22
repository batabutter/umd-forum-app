import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import Vote from '../VoteBar'

const Comment = ({ title, content, upvotes, downvotes, num_replies, commentId }) => {

    const [poster, setPoster] = useState("")

    const { user } = useGlobalContext()

    useEffect(() => {

        let isActive = true

        const getPoster = async () => {
            try {
                const response = await fetch(`http://192.168.1.156:5000/comments/${commentId}/user`)
                const jsonData = await response.json()

                if (!response.ok)
                    throw new Error(`Server error ${response.status}`)

                setPoster(jsonData)

            } catch (error) {
                console.log(error.message)
            }
        }
        getPoster()

        return () => {
            isActive = false
        }
    }), [commentId]

    return (
        <>
            <View className="border border-b-1 border-gray-600 rounded-md px-5">
                <View>
                    <Text className="font-plight color-slate-500">
                        {poster}
                    </Text>
                </View>

                <View className="mb-5">

                    <Text className="text-2xl font-pregular">
                        {content}
                    </Text>

                </View>

                <View className="justify-end items-end flex-row">
                    <Vote
                        postId={commentId}
                        accountId={user.account_id}
                        styleContainer={"w-[100px]"}
                        isComment={true}
                    />
                </View>

            </View>


        </>


    )
}

export default Comment