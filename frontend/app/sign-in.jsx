import { router } from 'expo-router';
import { Image, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";


import DynamicButton from "../components/DynamicButton";
import { images } from '../constants';
const SignIn = () => {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="items-center">
        <Text className="text-center">
          Sign in 
        </Text>
        <DynamicButton
          text="Continue to Home page"
          styleContainer="w-[200px] mt-20 bg-secondary"
          handlePress={() => router.push("/homepage")}
        />
      </View>
    </SafeAreaView>
  )
}

export default SignIn