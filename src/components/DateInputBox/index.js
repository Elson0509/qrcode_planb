import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import * as Constants from '../../services/constants'

const DateInputBox = (props) => {

  const onCheckDayLimit = value => {
    if(value==''){
      props.changed1('')
      return
    }
    const day = Number.parseInt(value)
    if(Number.isNaN(day)){
      props.changed1(1)
    } else if (day > 31) {
      props.changed1(31)
    } else if (day < 1) {
      props.changed1(1)
    } else {
      props.changed1(day)
    }
  }
  const onCheckMonthLimit = value => {
    if(value==''){
      props.changed2('')
      return
    }
    const month = Number.parseInt(value)
    if(Number.isNaN(month)){
      props.changed2(1)
    } else if (month > 12) {
      props.changed2(12)
    } else if (month < 1) {
      props.changed2(1)
    } else {
      props.changed2(month)
    }
  }
  const onCheckYearLimit = value => {
    if(value.length<=4){
      props.changed3(value)
    }
    const year = Number.parseInt(value)
    if(Number.isNaN(year)){
      props.changed3(2000)
    } else if (year > new Date().getFullYear()) {
      props.changed3(new Date().getFullYear())
    }
  }

  return (
      <View style={styles.box}>
          <Text style={[styles.labelStyle, {color: props.colorLabel || 'black'}]}>{props.text}</Text>
          <View style={styles.dateView}>
            <TextInput
                style={[
                  styles.txtInput, 
                  {
                    backgroundColor: props.backgroundColor || 'white', 
                    borderColor: props.borderColor || 'black',
                    color: props.colorInput || 'black',
                  }
                ]}
                placeholder="Dia"
                keyboardType={"number-pad"}
                value={props.value1.toString()}
                onChangeText={onCheckDayLimit}
            />
            <TextInput
                style={[
                  styles.txtInput, 
                  {
                    backgroundColor: props.backgroundColor || 'white', 
                    borderColor: props.borderColor || 'black',
                    color: props.colorInput || 'black',
                  }
                ]}
                placeholder="Mês"
                keyboardType={"number-pad"}
                value={props.value2.toString()}
                onChangeText={onCheckMonthLimit}
            />
            <TextInput
                style={[
                  styles.txtInput, 
                  {
                    backgroundColor: props.backgroundColor || 'white', 
                    borderColor: props.borderColor || 'black',
                    color: props.colorInput || 'black',
                  }
                ]}
                placeholder="Ano"
                keyboardType={"number-pad"}
                value={props.value3.toString()}
                onChangeText={onCheckYearLimit}
            />
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
    box:{
      marginBottom: 7
    },
    txtInput:{
      width:'31%',
      borderWidth:Constants.borderTextInputWidth,
      borderRadius:20,
      fontWeight:'bold',
      fontSize:14,
      textAlign:'left',
      paddingLeft: 10,
      marginRight: 11
    },
    labelStyle:{
      fontSize:15,
      fontWeight:'bold',
      marginBottom:5,
      marginLeft:5,
    },
    dateView:{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
});

export default DateInputBox;