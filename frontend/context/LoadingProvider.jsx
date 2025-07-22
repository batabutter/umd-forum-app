import { View, Text } from 'react-native'
import LottieView from 'lottie-react-native';
import React, { createContext, useContext, useState } from 'react'

const LoadingContext = createContext()

const LoadingProvider = ({ children}) => {

    const [isLoading, setIsLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const LoadingSpin = ({ styleContainer }) => {

    return (
        <View className='justify-center items-center'>
            <LottieView
                source={require('../assets/animations/loading.json')} // 👈 path to your Lottie file
                autoPlay
                loop
                style={styleContainer}
            />
        </View>
    )

}

export const useLoadingContext = () => useContext(LoadingContext)

export default LoadingProvider 