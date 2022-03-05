import React from 'react';
import * as Constants from '../../services/constants'
import {
  Image,
} from 'react-native';

const PicUser = (props) => {
  const style = { 
    width: props.width || 39, 
    height: props.height || 52, 
    marginRight: 5 
  }

  if (!!props.user.photo_id) {
    return (
      <Image
        style={style}
        source={{ uri: Constants.PREFIX_IMG_GOOGLE_CLOUD + props.user.photo_id }}
        resizeMode='contain'
      />
    )
  }

  if (!!props.user.pic) {
    return (
      <Image
        style={style}
        source={{ uri: props.user.pic }}
        resizeMode='contain'
      />
    )
  }

  if (!props.user.pic && props.user.id == "0") {
    return (
      <Image
        style={style}
        source={Constants.genericProfilePic}
        resizeMode='contain'
      />
    )
  }

  return (
    <Image
      style={style}
      source={Constants.genericProfilePic}
      resizeMode='contain'
    />
  )

};

export default PicUser;