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
import Icon from '../Icon';

const ActionButtons = (props) => {
    const IconSize = 28
    return (
        <View style={{flexDirection: props.flexDirection || 'row', justifyContent: 'center'}} >
            {props.noEditButton ? null : <TouchableOpacity style={{marginRight: 15, marginBottom: 0}}
                onPress={props.action1}
            >
                <Icon name="edit" size={IconSize} color='#385165'/>
            </TouchableOpacity>}
            {props.noDeleteButton ? null : <TouchableOpacity
                onPress={props.action2}
            >
                <Icon name="window-close" size={IconSize} color='red'/>
            </TouchableOpacity>}
        </View>
    );
};

export default ActionButtons;