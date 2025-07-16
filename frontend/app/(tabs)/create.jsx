import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from 'react-native-elements'

import { CreatePostView, DynamicButton } from '../../components'

const create = () => {

  return (
    <View>
      <CreatePostView />
    </View>
  )
}

export default create