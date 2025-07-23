import { View, Text, TouchableOpacity } from 'react-native'
import { useState, useCallback } from 'react'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { useFocusEffect } from 'expo-router';

const VALID_POST_TYPES = [
    "posts", "comments", "replies"
]

const Vote = ({ postId, accountId, styleContainer, postType }) => {

    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [voteRatio, setVoteRatio] = useState()
    const [rendered, setRendered] = useState(false)

    const vote = async (upvote) => {

        try {

            let vote = upvote ? "upvote" : "downvote"

                `http://192.168.1.156:5000/${postType}/${postId}/${vote}/${accountId}`

            const res = await fetch(url, { method: "POST" });

            if (!res.ok)
                throw new Error(`Server error ${res.status}`)



            await fetchVoteData()

        } catch (error) {
            console.log(error.message)
        }

    }

    const fetchVoteData = useCallback(async () => {
        try {

            const votedStatusUrl = `http://192.168.1.156:5000/${postType}/${postId}/vote/${accountId}`
            const ratioUrl = `http://192.168.1.156:5000/${postType}/${postId}/ratio`

            const resVoteStatus = await fetch(votedStatusUrl);
            const resRatio = await fetch(ratioUrl);

            if (!resRatio.ok || !resVoteStatus.ok)
                throw new Error(`Server error ${resRatio.status}`)

            const jsonStatusData = await resVoteStatus.json()
            const jsonRatioData = await resRatio.json()

            setUpvoted(jsonStatusData.upvoted)
            setDownvoted(jsonStatusData.downvoted)
            setVoteRatio(jsonRatioData.sum)

        } catch (error) {
            console.log(error.message)
        }
    }, [postId, accountId, postType])

    useFocusEffect(
        useCallback(() => {
            if (!VALID_POST_TYPES.includes(postType))
                throw new Error("Invalid post type. Post type must be a \'posts\' \'comments\' or \'replies\'")
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