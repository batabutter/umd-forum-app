import { View, Text, TouchableOpacity } from 'react-native'
import { useState, useCallback } from 'react'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { useFocusEffect } from 'expo-router';
import { useLoadingContext, LoadingSpin } from '../context/LoadingProvider';

const Vote = ({ postId, accountId, styleContainer, isComment, onRender }) => {

    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [voteRatio, setVoteRatio] = useState()
    const [rendered, setRendered] = useState(false)

    const vote = async (upvote) => {

        try {

            let vote = upvote ? "upvote" : "downvote"
            const url = isComment ?
                `http://192.168.1.156:5000/comments/${postId}/${vote}/${accountId}`
                : `http://192.168.1.156:5000/posts/${postId}/${vote}/${accountId}`

            const res = await fetch(url, { method: "POST" });

            if (!res.ok)
                throw new Error(`Server error ${res.status}`)

            console.log("is it here?")


            await fetchVoteData()

        } catch (error) {
            console.log(error.message)
        }

    }

    const fetchVoteData = useCallback(async () => {
        try {

            


            const votedStatusUrl = isComment ?
                `http://192.168.1.156:5000/comments/${postId}/vote/${accountId}`
                : `http://192.168.1.156:5000/posts/${postId}/vote/${accountId}`
            const ratioUrl = isComment ?
                `http://192.168.1.156:5000/comments/${postId}/ratio`
                : `http://192.168.1.156:5000/posts/${postId}/ratio`

            const resVoteStatus = await fetch(votedStatusUrl);
            const resRatio = await fetch(ratioUrl);

            if (!resRatio.ok || !resVoteStatus.ok)
                throw new Error(`Server error ${resRatio.status}`)

            const jsonStatusData = await resVoteStatus.json()
            const jsonRatioData = await resRatio.json()

            setUpvoted(jsonStatusData.upvoted)
            setDownvoted(jsonStatusData.downvoted)
            setVoteRatio(jsonRatioData.sum)

            if (typeof onRender === 'function') {
                onRender(true)
                setRendered(true)
            }

        } catch (error) {
            console.log(error.message)
        }
    }, [postId, accountId, isComment, onRender])

    useFocusEffect(
        useCallback(() => {
            fetchVoteData()
        }, [fetchVoteData])
    )

    return (
        <View className={`justify-between flex-row items-center ${styleContainer} border border-gray-600 rounded-md`}>

            <View className="flex-row justify-between items-center w-3/4">

                <TouchableOpacity
                    onPress={() => vote(true)}
                >
                    <EntypoIcon
                        name="arrow-bold-up"
                        size={20}
                        color={upvoted ? "red" : "black"}
                    />
                </TouchableOpacity>

                <Text className="font-psemibold mt-1">
                    {voteRatio}
                </Text>

                <EntypoIcon
                    name="dot-single"
                    size={20}
                    color={"black"}
                />

            </View>

            <TouchableOpacity
                onPress={() => vote(false)}
            >
                <EntypoIcon
                    name="arrow-bold-down"
                    size={20}
                    color={downvoted ? "blue" : "black"}
                />
            </TouchableOpacity>

        </View>
    )
}

export default Vote