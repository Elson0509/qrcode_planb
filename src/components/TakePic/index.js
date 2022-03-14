import React, { useState, useEffect, useRef, Fragment } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera'
import Icon from '../../components/Icon';
import * as Utils from '../../services/util'

const TakePic = (props) => {
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null)
    const [isTakingPic, setIsTakingPic] = useState(true)
    const [imgPath, setImgPath] = useState('')
    const camRef = useRef(null)

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    if (hasPermission === null) {
        return <View />
    }
    if (hasPermission === false) {
        return <Text>Você precisa autorizar o uso de câmera para este aplicativo.</Text>
    }

    const takePicture = async _ => {
        if (camRef) {
            const data = await camRef.current.takePictureAsync({ skipProcessing: true });
            setImgPath(data.uri)
            setIsTakingPic(false)
        }
    }

    const sendPhoto = async _ => {
        const result = await Utils.compressImage(imgPath)
        props.clicked(result.uri)
    }

    return (
        <SafeAreaView style={styles.container}>
            {isTakingPic &&
                <Fragment>
                    <Camera
                        style={{ flex: 5 }}
                        type={type}
                        ref={camRef}
                        autoFocus="off"
                        
                    >
                    </Camera>
                    <View style={{ flex: 1, backgroundColor: 'black', flexDirection: 'row', justifyContent: 'center', paddingTop: 15 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { setType(type == Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back) }}
                        >
                            <Icon name="exchange-alt" color="white" size={40} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonRight}
                            onPress={() => { takePicture() }}
                        >
                            <Icon name="camera" color="white" size={40} />
                        </TouchableOpacity>
                    </View>
                </Fragment>
            }
            {
                !isTakingPic &&
                <Fragment>
                    <Image
                        source={{ uri: imgPath }}
                        style={{ flex: 6 }}
                    />
                    <View style={{ flex: 1, backgroundColor: 'black', flexDirection: 'row', justifyContent: 'center', paddingTop: 15 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setIsTakingPic(true)}
                        >
                            <Icon name="redo-alt" color="white" size={40} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonRight}
                            onPress={() => { sendPhoto() }}
                        >
                            <Icon name="check" color="white" size={40} />
                        </TouchableOpacity>
                    </View>
                </Fragment>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        padding: 15,
        height: 80,
        justifyContent: 'center',
    },
    buttonRight: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginLeft: 20,
        height: 80,
        justifyContent: 'center',
    }
})

export default TakePic;