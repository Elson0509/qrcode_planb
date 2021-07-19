import React from 'react';
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Text,
    Animated,
    Keyboard
    } from 'react-native';

import { useAuth } from '../../contexts/auth';
import QRCode from '../../components/QRCode';
import * as utils from '../../services/util'

const Dashboard = () => {
    const {signOut, user} = useAuth()

    const handleSignOut = _ =>{
        signOut()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{utils.saudacaoHorario(user?.name)}</Text>
            <Text style={styles.obs}>Use o código abaixo para seu acesso:</Text>
            <QRCode value={user?.id}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0AE'
        //justifyContent: 'center',
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
        marginBottom: 10,
        color: 'white',
    }
})

export default Dashboard;