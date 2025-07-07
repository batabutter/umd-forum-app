import { router } from 'expo-router';
import { Image, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";


import DynamicButton from "../../components/DyanmicButton";
import { images } from '../../constants';
const SignIn = () => {
  return (
    <SafeAreaView className="bg-white ">
      <View className="items-center">
        <Text className="text-center">
          Sign in 
        </Text>
        <DynamicButton
          text="Continue to Home page"
          styleContainer="w-[200px] mt-20"
          handlePress={() => router.push("/homepage")}
        />
      </View>
    </SafeAreaView>
  )
}

export default SignIn