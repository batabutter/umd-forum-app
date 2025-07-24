import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PostNavigation = () => {
    return (
        <Stack
            options={{
                headerShown: false
            }} >

            <Stack.Screen
                name="[postId]"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="commentview"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="editview"
                options={{ headerShown: false }}
            />

            
        </Stack>
    )
}

export default PostNavigation