import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import {Camera} from 'expo-camera'
import Icon from '../Icon';

const ModalPhoto = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null)
    const camRef = useRef(null)

    console.log('abriu')

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
            props.setPickPath(data.uri)
        }
    }

    return (
        <Modal
          visible={props.modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={()=> props.setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <Camera
                    style={{flex:1}}
                    type={type}
                    ref={camRef}
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
                            onPress={()=> {takePicture()}}
                        >
                            <Icon name="camera" color="white" size={40}/>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        </Modal>
            
    );
};

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalTitle:{
      marginBottom: 10,
      textAlign: "center",
      fontSize: 23,
    },
});

export default ModalPhoto;