import { View, Text } from 'react-native'
import { Stack } from "expo-router";
import React from 'react'


const PostViewLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  
      }}
    />
  )
}

export default PostViewLayout