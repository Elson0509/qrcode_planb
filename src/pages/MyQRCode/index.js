import React from 'react';
import QRCode from '../../components/QRCode';
import * as utils from '../../services/util'
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Text,
    FlatList,
    Animated,
    Keyboard,
    } from 'react-native';

const MyQRCode = (props) => {
    const user = props.user || props.route.params.user
    console.log(user)
    
    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{utils.saudacaoHorario(user?.name)}</Text>
            <Text style={styles.obs}>Use o código abaixo para seu acesso:</Text>
            <QRCode value={user?.id}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#00AAEE'
    },
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
    obs:{
        marginBottom: 22,
        color: 'white',
    }
})

export default MyQRCode;