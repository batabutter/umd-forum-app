import { View, Text, TouchableOpacity } from 'react-native'
import { Header } from 'react-native-elements'
import React from 'react'
import SwitchAccountButton from './buttons/SwitchAccountButton'

const ProfileView = () => {
    return (
        <View>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
                backgroundColor='#222831'
            />

            <View className="justify-center items-center flex-col mt-28">

                <SwitchAccountButton
                    text="Account 1"
                    styleContainer="border rounded-sm"
                    username="michaelmorton"
                />

                <SwitchAccountButton
                    text="Account 2"
                    styleContainer="border rounded-sm"
                    username="sushi"
                />

            </View>
        </View>
    )
}

export default ProfileView