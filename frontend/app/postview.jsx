import { View, Text } from 'react-native'
import React from 'react'
import { Header } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import PostViewContent from '../components/PostViewContent';

const postview = () => {
  const { post_title, post_content, post_upvotes, post_downvotes,
    numcomments, post_id } = useLocalSearchParams();

  return (
    <View className="flex-1" >
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
        backgroundColor='#222831'
      />
      
      <PostViewContent
        post_id={post_id}
      />

    </View>

  )
}

export default postview