import { View, Text } from 'react-native'
import React from 'react'
import { Header } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import PostViewContent from '../components/PostViewContent';

const postview = () => {
  const { post_title, post_content } = useLocalSearchParams();
  return (
    <View className="bg-primary flex-1" >
      <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
      <PostViewContent
        post_title={post_title}
      />
    </View>

  )
}

export default postview