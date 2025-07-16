import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const DynamicButton = ({ text, styleContainer, handlePress }) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    className={`bg-secondary ${styleContainer} justify-center items-center
    min-h-[62px] rounded-xl`}>
      <Text className='font-psemibold text-lg'>{text}</Text>
    </TouchableOpacity>
  )
}

export default DynamicButton