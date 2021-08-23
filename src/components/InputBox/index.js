import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import * as Constants from '../../services/constants'

const InputBox = (props) => {
    return (
        <View style={[styles.box, {width: props.width || '100%'}]}>
            <Text style={[styles.labelStyle, {color: props.colorLabel || 'black'}]}>{props.text}</Text>
            <TextInput
                style={[
                  styles.txtInput, 
                  {
                    backgroundColor: props.backgroundColor || 'white', 
                    borderColor: props.borderColor || 'black',
                    color: props.colorInput || 'black',
                  }
                ]}
                placeholder={props.placeholder || ''}
                autoCapitalize={props.autoCapitalize || 'sentences'}
                autoFocus={ props.autoFocus || false}
                keyboardType={props.keyboard || "default"}
                value={props.value.toString()}
                autoCorrect={props.autoCorrect || true}
                onChangeText={props.changed}
                editable={props.editable === "0" ? false : true}
            />
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

export default InputBox;