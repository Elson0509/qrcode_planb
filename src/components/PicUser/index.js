import React, {useState} from 'react';
import * as Constants from '../../services/constants'
import {
    Image,
} from 'react-native';

const PicUser = (props) => {
    const [picUri, setPicUri] = useState({uri: `${Constants.apiurlPrefix}${Constants.apiurl}/img/${props.user.id}.jpg`})
   //console.log(`${Constants.apiurlPrefix}${Constants.apiurl}/img/${props.user.id}.jpg`)
    if(!!props.user.pic){
        return (
            <Image
                style={{width: props.width || 39, height: props.height || 52, marginRight: 5}}
                source={{uri: props.user.pic}}
            /> 
        )
    }
    if(!props.user.pic && props.user.id=="0"){
        return (
            <Image
                style={{width: props.width || 39, height: props.height || 52, marginRight: 5}}
                source={Constants.genericProfilePic}
            />
        )
    }
    if(!props.user.pic && props.user.id!="0"){
        
        return (
            <Image
                style={{width: props.width || 39, height: props.height || 52, marginRight: 5, resizeMode:'contain'}}
                source={picUri}
                onError={(err)=>{/*console.log(err.nativeEvent); */{setPicUri(Constants.genericProfilePic)}}}
            />
        )
    }
};

export default PicUser;