import { View, Text } from 'react-native'
import { Header } from 'react-native-elements'
import React from 'react'


import "../global.css";
import Post from '../components/Post';
import ListPosts from '../components/ListPosts';

const homepage = () => {
    return (
        <View>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
            <ListPosts/>
        </View>
    )
}

export default homepage