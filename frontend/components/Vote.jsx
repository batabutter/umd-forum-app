import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useCallback } from 'react'
import EntypoIcon from "react-native-vector-icons/Entypo"
import { useFocusEffect } from 'expo-router';
import { useEffect } from 'react'

const Vote = ({ post_id, account_id, vote_ratio, setReload }) => {

    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)

    const vote = async (upvote) => {

        try {

            let vote = upvote ? "upvote" : "downvote"
            console.log("Vote > " + vote)

            const res = await fetch(`http://192.168.1.156:5000/posts/${post_id}/${vote}/${account_id}`,
                {
                    method: "POST",
                });
            if (!res.ok)
                throw new Error(`Server error ${res.status}`)

            console.log("In here")
            getVoted()

            setReload(true)
        } catch (error) {
            console.log(error.message)
        }

    }

    const getVoted = async () => {
        try {
            const res = await fetch(`http://192.168.1.156:5000/posts/${post_id}/vote/${account_id}`);
            const json = await res.json()

            console.log("Curr id >" + post_id)

            if (!res.ok)
                throw new Error(`Server error ${res.status}`)

            setUpvoted(json.upvoted)
            console.log("upvoted  > " + json.upvoted)
            console.log("Downvoted  > " + json.downvoted)
            setDownvoted(json.downvoted)

            setReload(true)
        } catch (error) {
            console.log(error.message)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getVoted()
            console.log(`Rendering post page with id ${post_id}...`)
        }, [])
    )


    return (
        <View className="min-h-10 justify-center flex-row items-center">

            <View className="border border-gray-600 rounded-md flex-row">

                <TouchableOpacity
                    onPress={() => vote(true)}
                >
                    <EntypoIcon
                        name="arrow-bold-up"
                        size={20}
                        color={upvoted ? "red" : "black"}
                    />
                </TouchableOpacity>

                <Text
                    className="px-5 ">
                    {vote_ratio} |
                </Text>

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


        </View>
    )
}

export default Vote