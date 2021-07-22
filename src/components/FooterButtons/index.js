import React from 'react';
import { StyleSheet, Text, View, Modal, Button, Image, ScrollView, TouchableOpacity } from 'react-native';

const FooterButtons = (props) => {
    return (
        <View style={styles.groupButtons}>
            {!!props.title1 && <TouchableOpacity style={[styles.button, {backgroundColor: props.bgcolor1 || '#006DE3'}]} onPress={()=> props.action1()}>
                <Text style={[styles.text]}>{props.title1}</Text>
            </TouchableOpacity>}
            {!!props.title2 && <TouchableOpacity style={[styles.button, {backgroundColor: props.bgcolor2 || '#CF142B'}]} onPress={()=> props.action2()}>
                <Text style={[styles.text]}>{props.title2}</Text>
            </TouchableOpacity>}
        </View>
    );
};

const styles = StyleSheet.create({
    groupButtons:{
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff'
    },
    button:{
        padding: 25,
        borderRadius: 28,
    },
    text:{
        color: 'white',
        fontSize: 20
    }
});

export default FooterButtons;