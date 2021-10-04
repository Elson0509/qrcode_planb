import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet
  } from 'react-native';
import * as Constants from '../../services/constants'


const CommentBox = (props) => {

    const changeHandler = value => {
        if(value.length <= Constants.MAX_COMMENT_SIZE)
            props.setValue(value)
    }

    return (
        <View>
            {props.text && <Text style={[styles.labelStyle, {color: props.colorLabel || 'black'}]}>{props.text}</Text>}
            <TextInput
                style={{
                    borderWidth:2,
                    backgroundColor:'white',
                    padding: 10,
                    borderRadius: 10,
                    maxHeight: 100,
                    width:props.width || 250,
                    backgroundColor: props.backgroundColor || 'white', 
                    borderColor: props.borderColor || 'black',
                    color: props.colorInput || 'black',
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


const styles = StyleSheet.create({
    box:{
      marginBottom: 7,
    },
    txtInput:{
      width:'100%',
      borderWidth:Constants.borderTextInputWidth,
      borderRadius:20,
      fontWeight:'bold',
      fontSize:12,
      textAlign:'left',
      paddingLeft: 10
    },
    labelStyle:{
      fontSize:11,
      fontWeight:'bold',
      marginBottom:5,
      marginLeft:5,
      color:'white'
    }
});

export default CommentBox;