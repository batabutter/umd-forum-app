import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useCallback } from 'react'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { useFocusEffect } from 'expo-router';
import { useEffect } from 'react'

const Vote = ({ postId, accountId, styleContainer }) => {

    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)
    const [voteRatio, setVoteRatio] = useState()
    const [reload, setReload] = useState(false)

    const getPostRatio = async (postData) => {
        try {

            const response = await fetch(`http://192.168.1.156:5000/posts/${postId}/ratio`)
            const jsonData = await response.json();

            setVoteRatio(jsonData.sum)
            console.log("Rerendering ratio")
        } catch (error) {
            console.log(error.message)
        }
    }

    const vote = async (upvote) => {

        try {

            let vote = upvote ? "upvote" : "downvote"
            console.log("Vote > " + vote)

            const res = await fetch(`http://192.168.1.156:5000/posts/${postId}/${vote}/${accountId}`,
                {
                    method: "POST",
                });
            if (!res.ok)
                throw new Error(`Server error ${res.status}`)

            getVoted()

            setReload(!reload)
        } catch (error) {
            console.log(error.message)
        }

    }

    const getVoted = async () => {
        try {
            const res = await fetch(`http://192.168.1.156:5000/posts/${postId}/vote/${accountId}`);
            const json = await res.json()

            if (!res.ok)
                throw new Error(`Server error ${res.status}`)

            setUpvoted(json.upvoted)
            setDownvoted(json.downvoted)
        } catch (error) {
            console.log(error.message)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getPostRatio()
            getVoted()
            console.log(`Rendering post page with id ${postId}...`)
        }, [])
    )

    useEffect(() => {
        getPostRatio()
        getVoted()
    }, [reload])

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