import React from 'react';
import * as Constants from '../../services/constants'
import {
  Image,
} from 'react-native';

const PicUser = (props) => {

  if (!!props.user.photo_id) {
    return (
      <Image
        style={{ width: props.width || 39, height: props.height || 52, marginRight: 5 }}
        source={{ uri: Constants.PREFIX_IMG_GOOGLE_CLOUD + props.user.photo_id }}
      />
    )
  }

  if (!!props.user.pic) {
    return (
      <Image
        style={{ width: props.width || 39, height: props.height || 52, marginRight: 5 }}
        source={{ uri: props.user.pic }}
      />
    )
  }

  if (!props.user.pic && props.user.id == "0") {
    return (
      <Image
        style={{ width: props.width || 39, height: props.height || 52, marginRight: 5 }}
        source={Constants.genericProfilePic}
      />
    )
  }

  return (
    <Image
      style={{ width: props.width || 39, height: props.height || 52, marginRight: 5 }}
      source={Constants.genericProfilePic}
    />
  )

};

export default PicUser;