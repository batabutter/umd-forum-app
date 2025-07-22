import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import Vote from '../VoteBar'
import { LoadingSpin } from '../../context/LoadingProvider';

const Comment = ({ title, content, upvotes, downvotes, num_replies, commentId }) => {

    const [poster, setPoster] = useState("")

    const { user } = useGlobalContext()
    const [isLoading, setIsLoading] = useState(false)
    const [voteBarReady, setVoteBarReady] = useState(true)
    useEffect(() => {

        let isActive = true

        const getPoster = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`http://192.168.1.156:5000/comments/${commentId}/user`)
                const jsonData = await response.json()

                if (!response.ok)
                    throw new Error(`Server error ${response.status}`)

                setPoster(jsonData)

            } catch (error) {
                console.log(error.message)
            } finally {
                setIsLoading(false)
            }
        }
        getPoster()

        return () => {
            isActive = false
        }
    }, [commentId])

    if (isLoading || !voteBarReady) {
        return (
            <LoadingSpin
                styleContainer={{ width: 30, height: 30 }}
            />
        )
    }

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
                        onRender={setVoteBarReady}
                    />
                </View>

            </View>


        </>


    )
}

export default Comment