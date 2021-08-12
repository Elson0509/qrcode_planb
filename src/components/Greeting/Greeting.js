import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
  } from 'react-native';
import * as Utils from '../../services/util'

const Greeting = (props) => {
    return (
        <View>
            <Text style={styles.greeting}>{Utils.saudacaoHorario(props.user?.name)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    greeting: {
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'white',
        letterSpacing: 1,
        fontSize: 20,
        marginTop: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 30
    },
})

export default Greeting;