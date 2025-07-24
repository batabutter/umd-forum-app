import { View } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import PostViewContent from '../../components/post/PostViewContent';

const postview = () => {
  const { postId } = useLocalSearchParams();

  return (     
      <PostViewContent
        postId={postId}
      />

  )
}

export default postview