import React from 'react';
import {
    View,
    Text,
    TextInput
  } from 'react-native';
import * as Constants from '../../services/constants'

const CommentBox = (props) => {

    const changeHandler = value => {
        if(value.length <= Constants.MAX_COMMENT_SIZE)
            props.setValue(value)
    }

    return (
        <View>
            <TextInput
                style={{
                    borderWidth:2,
                    backgroundColor:'white',
                    padding: 10,
                    borderRadius: 10,
                    maxHeight: 100
                }}
                value={props.value}
                onChangeText={text=>changeHandler(text)}
                multiline={true}
                underlineColorAndroid='transparent'
                autoCapitalize='sentences'
                placeholder={props.placeholder || ''}
            />
            <Text style={{textAlign: 'right', marginTop: 5, fontWeight: 'bold'}}>{Constants.MAX_COMMENT_SIZE-props.value.length}/{Constants.MAX_COMMENT_SIZE}</Text>
        </View>
    );
};

export default CommentBox;