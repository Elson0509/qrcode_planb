import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import * as Constants from '../../services/constants'
import THEME from '../../services/theme';

const InputBox = (props) => {
  return (
    <View style={[styles.box, { width: props.width || '100%' }]}>
      <Text style={[styles.labelStyle, { color: props.colorLabel || 'black', fontFamily: THEME.FONTS.r700 }]}>{props.text}</Text>
      <TouchableOpacity onPress={props.changed}>
        <View
          style={[
            styles.txtInput,
            {
              backgroundColor: props.backgroundColor || 'white',
              borderColor: props.borderColor || 'black',
              borderRadius: props.borderRadius || 6,
              flexDirection: 'row',
              alignItems: 'center',
            }
          ]}
        >
          <Text style={{color: props.colorInput || 'black', fontFamily: THEME.FONTS.r500}}>
            {props.value ? 'Sim' : 'Não'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 7,
  },
  txtInput: {
    width: '100%',
    borderWidth: Constants.borderTextInputWidth,
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 10,
    height: 45,
    letterSpacing: 1
  },
  labelStyle: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    color: 'white'
  }
});

export default InputBox;