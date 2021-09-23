import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableHighlight,
  } from 'react-native';
import Icon from '../Icon';
import * as Utils from '../../services/util'

const Greeting = (props) => {
    return (
        <View style={styles.container}>
            {/* <TouchableHighlight style={styles.shield} on>
                <Icon name="shield-alt" color='white' size={30}/>
            </TouchableHighlight> */}
            <Text style={styles.greeting}>{Utils.saudacaoHorario(props.user?.name)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    shield: {
        position: 'absolute',
        left: 0,
        padding: 5,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 5,
    },  
    greeting: {
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'white',
        width: '100%',
        //alignItems: 'center',
        //justifyContent: 'center',
        textAlign: 'center',
        letterSpacing: 0.5,
        fontSize: 20,
        marginTop: 10,
        //borderBottomColor: '#ccc',
        //borderBottomWidth: 1,
        marginBottom: 10
    },
})

export default Greeting;