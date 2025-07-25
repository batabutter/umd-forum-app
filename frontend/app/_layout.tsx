import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';

import GlobalProvider from "../context/GlobalProvider"
import LoadingProvider from "../context/LoadingProvider"
import { StatusBar } from 'react-native';


export default function RootLayout() {

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync()

  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null


  return (

    <GlobalProvider>
      <LoadingProvider>


        <Stack
          screenOptions={{
            headerShown: false,
          }}>

          <Stack.Screen name="index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen name="sign-in"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="(postview)"
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(home)"
            options={{
              headerShown: false
            }}
          />

        </Stack>
      </LoadingProvider>
    </GlobalProvider>
  )
}
