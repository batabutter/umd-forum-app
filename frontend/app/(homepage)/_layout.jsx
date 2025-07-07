import { View, Text } from 'react-native'
import { Redirect, Stack } from "expo-router";
import React from 'react'

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="homepage"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default _layout