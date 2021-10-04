import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableHighlight,
  } from 'react-native';
import {withBadge, Icon} from 'react-native-elements'
import IconApp from '../Icon';
import * as Utils from '../../services/util'
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native'

const Greeting = (props) => {
    const [newMessagesQtt, setNewMessagesQtt] = useState(0)

    const navigation = useNavigation();

    useEffect(()=>{
        fetchQttNewMessages()
      const willFocusSubscription = navigation.addListener('focus', ()=> {
        fetchQttNewMessages()
      })
      return willFocusSubscription
    },[])

    const fetchQttNewMessages = _ => {
        api.get(`api/message/count/${props.user.id}`)
        .then(res=> {
            setNewMessagesQtt(res.data.count)
        })
        .catch((err)=> {
            console.log(err)
        })
    }

    const clickMessageHandler = _ => {
        navigation.navigate('Messages', {user: props.user})
    }

    const BadgedIcon  = withBadge(newMessagesQtt)(Icon)

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{Utils.saudacaoHorario(props.user?.name)}</Text>
            <TouchableHighlight style={styles.iconMessage} onPress={()=> clickMessageHandler()}>
                {newMessagesQtt === 0 ?
                <IconApp name="envelope" color='white' size={26}/>
                :
                <BadgedIcon type="font-awesome-5" name="envelope" color='white'/>
                }
            </TouchableHighlight>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    iconMessage: {
        position: 'absolute',
        right: 12,
        padding: 5,
        //borderWidth: 3,
        //borderColor: 'white',
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