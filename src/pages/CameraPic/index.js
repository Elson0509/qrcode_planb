import React, {useState, useEffect} from 'react';
import { StyleSheet, SafeAreaView, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import {Camera} from 'expo-camera'
import Icon from '../../components/Icon';

const CameraPic = () => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null)

    useEffect(()=>{
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    if(hasPermission === null){
        return <View/>
    }
    if(hasPermission === false){
        return <Text>Você precisa autorizar o uso de câmera para este aplicativo.</Text>
    }

    return (
        <SafeAreaView style={styles.container}>
            <Camera
                style={{flex:1}}
                type={type}
            >
                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 100,
                            borderWidth: 1,
                            borderColor: 'white',
                            padding: 10
                        }}
                        onPress={()=> {setType(type==Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}}
                    >
                        <Icon name="exchange-alt" color="white" size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 190,
                            borderWidth: 1,
                            borderColor: 'white',
                            padding: 10
                        }}
                        onPress={()=> {setType(type==Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}}
                    >
                        <Icon name="camera" color="white" size={40}/>
                    </TouchableOpacity>
                </View>
            </Camera>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center'
    }
})

export default CameraPic;