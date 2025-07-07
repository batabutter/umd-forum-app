import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';

const postview = () => {
  const { post_title, post_content } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <View>
        <Text>{post_title}</Text>
      </View>
    </SafeAreaView>
  )
}

export default postview