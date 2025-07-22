import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Header } from 'react-native-elements'

import "../../global.css";
import Post from '../../components/Post';
import { useGlobalContext } from '../../context/GlobalProvider';
import MainPage from '../../components/MainPage';

const homepage = () => {
    const { user } = useGlobalContext()
    return (
        <>

            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: user, style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
                backgroundColor='#222831'
            />
            <MainPage />

        </>
    )
}

export default homepage