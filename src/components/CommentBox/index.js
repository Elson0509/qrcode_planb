import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import * as Constants from '../../services/constants'
import THEME from '../../services/theme';

const CommentBox = (props) => {
  const changeHandler = value => {
    if (value.length <= Constants.MAX_COMMENT_SIZE)
      props.setValue(value)
  }

  return (
    <View>
      {props.text && <Text style={[styles.labelStyle, { color: props.colorLabel || 'black', fontFamily: THEME.FONTS.r700 }]}>{props.text}</Text>}
      <TextInput
        style={[
          styles.txtInput,
          {
            borderWidth: 2,
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 10,
            maxHeight: 100,
            backgroundColor: props.backgroundColor || 'white',
            borderColor: props.borderColor || 'black',
            color: props.colorInput || 'black',
            fontFamily: THEME.FONTS.r500,
          }
        ]}
        value={props.value}
        onChangeText={text => changeHandler(text)}
        multiline={true}
        underlineColorAndroid='transparent'
        autoCapitalize='sentences'
        placeholder={props.placeholder || ''}
      />
      <Text style={{ textAlign: 'right', marginTop: 5, fontWeight: 'bold' }}>{Constants.MAX_COMMENT_SIZE - props.value.length}/{Constants.MAX_COMMENT_SIZE}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 7,
  },
  txtInput: {
    borderWidth: Constants.borderTextInputWidth,
    borderRadius: 20,
    fontSize: 12,
    textAlign: 'left',
    paddingLeft: 10,
    fontWeight: '700',
  },
  labelStyle: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    color: 'white'
  }
});

export default CommentBox;