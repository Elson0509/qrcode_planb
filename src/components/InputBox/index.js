import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

const InputBox = (props) => {
    return (
        <View style={styles.box}>
            <Text style={styles.labelStyle}>{props.text}</Text>
            <TextInput
                style={styles.txtInput}
                autoFocus={true}
                keyboardType="numeric"
                value={props.value.toString()}
                onChangeText={props.changed}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    box:{
      marginBottom: 20
    },
    txtInput:{
      width:'100%',
      borderWidth:3,
      borderColor:'white',
      borderRadius:20,
      color:'white',
      fontWeight:'bold',
      fontSize:14,
      textAlign:'center',
      backgroundColor:'#a77fba'
    },
    labelStyle:{
      fontSize:14,
      marginBottom:5,
      color:'white'
    }
});

export default InputBox;