import { Redirect, Stack } from "expo-router";
import { Image, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";


import DynamicButton from "../../components/DyanmicButton";
import { images } from '../../constants';
const AuthLayout = () => {
  return (
     <Stack
      screenOptions={{
        headerShown: false,  
      }}
    />
  )
}

export default AuthLayout 