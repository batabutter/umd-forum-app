import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import PostViewContent from '../components/PostViewContent';

const postview = () => {
  const { post_title, post_content } = useLocalSearchParams();
  return (
    <SafeAreaView className="bg-primary flex-1" >
      <PostViewContent
        post_title={post_title}
      />
    </SafeAreaView>

  )
}

export default postview