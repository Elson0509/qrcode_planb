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
    return (
        <View style={{flexDirection: props.flexDirection || 'row'}} >
            <TouchableOpacity style={{marginRight: 10, marginBottom: 10}}
                onPress={props.action1}
            >
                <Icon name="edit" size={30} color='#385165'/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={props.action2}
            >
                <Icon name="window-close" size={30} color='red'/>
            </TouchableOpacity>
        </View>
    );
};

export default ActionButtons;