import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import PostViewContent from '../../components/PostViewContent';

const postview = () => {
  const { postId } = useLocalSearchParams();

  return (
    <View className="flex-1" >      
      <PostViewContent
        postId={postId}
      />

    </View>

  )
}

export default postview