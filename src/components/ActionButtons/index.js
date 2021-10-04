import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    View,
    Text,
  } from 'react-native';
import { backgroundColors } from '../../services/constants';
import Icon from '../Icon';

const ActionButtons = (props) => {
    const IconSize = 32
    return (
        <View style={{flexDirection: props.flexDirection || 'row', justifyContent: 'center'}} >
            {props.noEditButton ? null : <TouchableOpacity style={{marginRight: 15, marginBottom: 0}}
                onPress={props.action1}
            >
                <Icon name={props.editIcon || "edit"} size={IconSize} color='#385165'/>
            </TouchableOpacity>}
            {props.noDeleteButton ? null : <TouchableOpacity style={{paddingTop: 2}}
                onPress={props.action2}
            >
                <Icon name={props.closeIcon || "window-close"} size={IconSize} color='red'/>
            </TouchableOpacity>}
            {props.qrCodeButton && <TouchableOpacity style={{marginLeft: 23, paddingTop: 2}}
                onPress={props.action3}
            >
                <View style={{backgroundColor:'white', padding: 2, paddingHorizontal: 4}}>
                    <Icon name="qrcode" size={IconSize-4} color='black'/>
                </View>
            </TouchableOpacity>}
        </View>
    );
};

export default ActionButtons;