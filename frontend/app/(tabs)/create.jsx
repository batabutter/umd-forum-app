import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CreatePostView }  from '../../components'

const create = () => {

  return (
    <SafeAreaView>
      <Text>
        Curr account: 
      </Text>

      <CreatePostView/>
    </SafeAreaView>
  )
}

export default create