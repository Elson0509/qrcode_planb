import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, SafeAreaView, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import {Camera} from 'expo-camera'
import Icon from '../../components/Icon';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

const CameraPic = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null)
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

    const compressImage = async (uri, format = SaveFormat.JPEG) => {
        //https://docs.expo.dev/versions/latest/sdk/imagemanipulator/
        //https://stackoverflow.com/questions/37639360/how-to-optimise-an-image-in-react-native
        const result = await manipulateAsync(
            uri,
            [{ resize: { width: 1200 } }],
            { compress: 0.5, format }
        );
    
        return  { name: `${Date.now()}.${format}`, type: `image/${format}`, ...result };
    };

    const takePicture = async _ => {
        if(camRef){
            const data = await camRef.current.takePictureAsync();
            const userBeingAdded = props.route.params.userBeingAdded
            const result = await compressImage(data.uri)
            userBeingAdded.pic = result.uri
            props.navigation.navigate(props.route.params.screen || 'ResidentAdd', 
                {
                    userBeingAdded, 
                    selectedBloco: props.route.params.selectedBloco, 
                    selectedUnit: props.route.params.selectedUnit, 
                    vehicles: props.route.params.vehicles,
                    selectedDateInit: props.route.params.selectedDateInit,
                    selectedDateEnd: props.route.params.selectedDateEnd
                }
            )
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