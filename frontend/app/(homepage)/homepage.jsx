import { View, Text } from 'react-native'
import { Header } from 'react-native-elements'
import React from 'react'


import "../../global.css";
import Post from '../../components/Post';

const homepage = () => {
    return (
        <View>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
            <View>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </View>
        </View>
    )
}

export default homepage