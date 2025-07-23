import { View } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import PostViewContent from '../../components/post/PostViewContent';

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