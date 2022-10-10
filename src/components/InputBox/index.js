import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import * as Constants from '../../services/constants'
import THEME from '../../services/theme';

const InputBox = (props) => {
    return (
        <View style={[styles.box, {width: props.width || '100%'}]}>
            {
              !!props.text &&
              <Text style={[styles.labelStyle, {color: props.colorLabel || 'black', fontFamily: THEME.FONTS.r700}]}>{props.text}</Text>
            }
            <TextInput
                style={[
                  styles.txtInput, 
                  {
                    backgroundColor: props.backgroundColor || 'white', 
                    borderColor: props.borderColor || 'black',
                    color: props.colorInput || 'black',
                    borderRadius: props.borderRadius || 6,
                    fontFamily: THEME.FONTS.r500,
                    borderWidth: props.borderWidth || Constants.borderTextInputWidth,
                  }
                ]}
                placeholder={props.placeholder || ''}
                autoCapitalize={props.autoCapitalize || 'sentences'}
                //characters || words || sentences || none
                autoFocus={ props.autoFocus || false}
                keyboardType={props.keyboard || "default"}
                //default || number-pad || decimal-pad || numeric || email-address || phone-pad
                secureTextEntry={props.secureTextEntry || false}
                value={props.value.toString()}
                autoCorrect={props.autoCorrect || false}
                onChangeText={props.changed}
                editable={props.editable === "0" ? false : true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    box:{
      marginVertical: 5,
    },
    txtInput:{
      width:'100%',
      fontSize: 14,
      textAlign:'left',
      paddingLeft: 10,
      height: 45,
      letterSpacing: 1
    },
    labelStyle:{
      fontSize:15,
      marginBottom:5,
      marginLeft:5,
      color:'white'
    }
});

export default InputBox;