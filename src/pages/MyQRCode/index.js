import React from 'react';
import QRCode from '../../components/QRCode';
import Greeting from '../../components/Greeting/Greeting';
import { StyleSheet,
    View,
    Text,
    } from 'react-native';

import * as Constants from '../../services/constants'
import THEME from '../../services/theme'

const MyQRCode = (props) => {
    const user = props.user || props.route.params.user
    
    return (
        <View style={[styles.container]}>
            <Greeting/>
            <Text style={[styles.obs, {fontFamily: THEME.FONTS.r500}]}>Use o código abaixo para seu acesso:</Text>
            <QRCode value={`${Constants.QR_CODE_PREFIX}${user?.id}`} backgroundColor={Constants.backgroundColors['MyQRCode']}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Constants.backgroundColors['MyQRCode']
    },
    greeting: {
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'black',
        letterSpacing: 1,
        fontSize: 20,
        marginTop: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 30
    },
    obs:{
        marginBottom: 22,
        color: 'black',
    }
})

export default MyQRCode;