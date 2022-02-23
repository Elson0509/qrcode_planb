import React from 'react';
import { StyleSheet, Text, View, Modal, Button, Image, ScrollView, TouchableOpacity } from 'react-native';

const FooterButtons = (props) => {
  return (
    <View>
      {!!props.errorMessage && <Text style={styles.errorMessage}>{props.errorMessage}</Text>}
      <View style={[styles.groupButtons, { padding: props.viewPadding || 20, backgroundColor: props.backgroundColor || '#fff' }]}>
        {!!props.title2 &&
          <TouchableOpacity disabled={props.disabled || false} style={[{ margin: props.marginButton || 10, backgroundColor: props.bgcolor2 || '#CF142B', padding: props.buttonPadding || 25, borderRadius: props.borderRadius || 20, }]}
            onPress={() => props.action2()}>
            <Text style={[styles.text, { fontSize: props.fontSize || 20, color: props.color2 || 'white' }]}>{props.title2}</Text>
          </TouchableOpacity>}
        {!!props.title1 &&
          <TouchableOpacity disabled={props.disabled || false} style={[{ margin: props.marginButton || 10, backgroundColor: props.bgcolor1 || '#006DE3', padding: props.buttonPadding || 25, borderRadius: props.borderRadius || 20, }]}
            onPress={() => props.action1()}>
            <Text style={[styles.text, { fontSize: props.fontSize || 20, color: props.color1 || 'white' }]}>{props.title1}</Text>
          </TouchableOpacity>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    color: '#F77',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#F77',
    padding: 5,
  },
  groupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
  }
});

export default FooterButtons;