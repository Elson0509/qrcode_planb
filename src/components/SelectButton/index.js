import React from 'react'
import * as Constants from '../../services/constants'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native'
import THEME from '../../services/theme';

const SelectButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.action()}>
      {
        !!props.label &&
        <Text style={[styles.labelStyle, { color: props.colorLabel || 'black', fontFamily: THEME.FONTS.r700 }]}>{props.label}</Text>
      }
      <View>
        <Text style={{
          textAlign: 'center',
          borderWidth: Constants.borderTextInputWidth,
          padding: 10,
          backgroundColor: Constants.backgroundLightColors[props.backgroundColor || 'Visitors'],
          borderRadius: 10,
          //color: 'white',
          fontSize: 16
        }}
        >
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    color: 'white'
  }
});

export default SelectButton;