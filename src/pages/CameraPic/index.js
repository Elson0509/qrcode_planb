import React, {useState, useEffect, useRef, Fragment} from 'react';
import { StyleSheet, SafeAreaView, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import {Camera} from 'expo-camera'
import Icon from '../../components/Icon';
import * as Utils from '../../services/util'

const CameraPic = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null)
    const [isTakingPic, setIsTakingPic] = useState(true)
    const [imgPath, setImgPath] = useState('')
    const camRef = useRef(null)


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
            setImgPath(data.uri)
            setIsTakingPic(false)
        }
    }

    const sendPhoto = async _ => {
        const userBeingAdded = props.route.params.userBeingAdded
        const result = await Utils.compressImage(imgPath)
        userBeingAdded.pic = result.uri
        props.navigation.navigate(props.route.params.screen || 'ResidentAdd', 
            {
                userBeingAdded, 
                selectedBloco: props.route?.params?.selectedBloco, 
                selectedUnit: props.route?.params?.selectedUnit, 
                vehicles: props.route?.params?.vehicles,
                user: props.route.params?.user,
                selectedDateInit: props.route.params?.selectedDateInit,
                selectedDateEnd: props.route.params?.selectedDateEnd,
                screen: props.route.params?.screen,
                pic: result.uri
            }
        )
    }

    return (
            <SafeAreaView style={styles.container}>
                {isTakingPic &&
                <Fragment>
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
                </Fragment>
                }
                {
                    !isTakingPic &&
                    <Fragment>
                        <Image
                            source={{uri: imgPath}}
                            style={{flex: 6}}
                        />
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
                                onPress={()=> setIsTakingPic(true)}
                            >
                                <Icon name="redo-alt" color="white" size={40}/>
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
                                onPress={()=> {sendPhoto()}}
                            >
                                <Icon name="check" color="white" size={40}/>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                }
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