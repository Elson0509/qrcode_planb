import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, SafeAreaView, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import {Camera} from 'expo-camera'
import Icon from '../../components/Icon';

const CameraPic = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null)
    const camRef = useRef(null)
    const [capturedPhoto, setCapturedPhoto] = useState(null)

    console.log('CameraPic route params', props.route.params)
    //console.log('CameraPic props', props)

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

    const takePicture = async _ => {
        if(camRef){
            const data = await camRef.current.takePictureAsync();
            setCapturedPhoto(data.uri)
            //const [userBeingAdded, selectedBloco, selectedUnit] = props.route.params
            const userBeingAdded = props.route.params.userBeingAdded
            userBeingAdded.pic = data.uri
            props.navigation.navigate('ResidentAdd', {userBeingAdded, selectedBloco: props.route.params.selectedBloco, selectedUnit: props.route.params.selectedUnit})
            //console.log(data)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Camera
                style={{flex:6}}
                type={type}
                ref={camRef}
            >
                
            </Camera>
            <View style={{flex: 1, backgroundColor: 'black', flexDirection: 'row'}}>
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
                        onPress={()=> {takePicture()}}
                    >
                        <Icon name="camera" color="white" size={40}/>
                    </TouchableOpacity>
                </View>
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