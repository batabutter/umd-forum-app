import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react';
import Post from './Post'

const ListPosts = () => {

    const [currposts, setCurrPosts] = useState([]);

    const getPosts = async () => {
        try {
            const response = await fetch("http://192.168.1.156:5000/posts")
            const jsonData = await response.json()

            setCurrPosts(jsonData)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() =>{
        getPosts()
    }, [])

    console.log(currposts)
    return (
        <SafeAreaView>
            <FlatList
            
            />
        </SafeAreaView>
    )
}

export default ListPosts