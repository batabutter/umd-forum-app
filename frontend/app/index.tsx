import { router } from 'expo-router';
import { Image, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import ".././global.css";


import DynamicButton from "../components/DynamicButton";
import { images } from '../constants';

export default function App() {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="items-center">
        <Image
          source={images.umdLogo}
          className="w-[150px] h-[150px] mt-6"
          resizeMode="contain"
        />
        <Text
          className="mt-16 text-center 
        font-psemibold text-3xl text-gray-100"
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.9)',
            textShadowOffset: { width: 5, height: 5 },
            textShadowRadius: 8
          }}>
          Welcome to the UMD Course Forum
        </Text>

        <DynamicButton
          text="Continue to Sign in"
          styleContainer="w-[200px] mt-20 bg-secondary"
          handlePress={() => router.push("/sign-in")}
        />
      </View>
    </SafeAreaView>
  );
}
