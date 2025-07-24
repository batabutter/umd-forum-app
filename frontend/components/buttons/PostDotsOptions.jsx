import { View, Text, TouchableOpacity, Animated, useAnimatedValue, Modal } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-elements'
import EditPostButton from './EditPostButton';
import DeletePostButton from './DeletePostButton';

const PostDotsOptions = ({ styleContiner, postId }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <View className="h-full">

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                    statusBarTranslucent={true}
                >
                    <View className="flex-1 justify-end">
                        <View className="bg-black-100 h-1/3 rounded-t-md border">
                            <View className="w-full items-end justify-center py-5 px-5 gap-2">
                                <TouchableOpacity

                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Icon name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View className="w-full items-center">
                                <View className="border-b-2 w-11/12 border-gray-500 rounded-md" />
                            </View>
                            <View className="h-2/3 justify-between ml-10 py-10">
                                <EditPostButton postId={postId}/>
                                <DeletePostButton postId={postId}/>
                            </View>
                        </View>
                    </View>

                </Modal>
                <View className="items-center">
                    <TouchableOpacity

                        onPress={() => setModalVisible(!modalVisible)}

                    >
                        <Icon name="more-vert" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default PostDotsOptions