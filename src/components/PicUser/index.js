import React, {useState} from 'react';
import * as Constants from '../../services/constants'
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Text,
    FlatList,
    Animated,
    Keyboard,
    Button,
} from 'react-native';

const PicUser = (props) => {
    const [picUri, setPicUri] = useState({uri: `http://${Constants.apiurl}/img/${props.user.id}.jpg`})

    if(!!props.user.pic){
        return (
            <Image
                style={{width: 39, height: 52, marginRight: 5}}
                source={{uri: props.user.pic}}
            /> 
        )
    }
    if(!props.user.pic && props.user.id=="0"){
        return (
            <Image
                style={{width: 39, height: 52, marginRight: 5}}
                source={Constants.genericProfilePic}
            />
        )
    }
    if(!props.user.pic && props.user.id!="0"){
        return (
            <Image
                style={{width: 39, height: 52, marginRight: 5}}
                source={picUri}
                onError={()=>setPicUri(Constants.genericProfilePic)}
            />
        )
    }
};

export default PicUser;