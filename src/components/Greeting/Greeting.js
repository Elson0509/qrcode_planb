import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';
import { withBadge, Icon } from 'react-native-elements'
import IconApp from '../Icon';
import * as Utils from '../../services/util'
import * as Constants from '../../services/constants'
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native'
import THEME from '../../services/theme'
import { useAuth } from '../../contexts/auth';

const Greeting = _ => {
  const [newMessagesQtt, setNewMessagesQtt] = useState(0)
  const { user } = useAuth()
  const navigation = useNavigation();

  useEffect(() => {
    fetchQttNewMessages()
    const willFocusSubscription = navigation.addListener('focus', () => {
      fetchQttNewMessages()
    })
    return willFocusSubscription
  }, [])

  const fetchQttNewMessages = _ => {
    api.get(`api/message/count/${user.id}`)
      .then(res => {
        setNewMessagesQtt(res.data.count)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const clickMessageHandler = _ => {
    navigation.navigate('Messages', { user })
  }

  const BadgedIcon = withBadge(newMessagesQtt)(Icon)

  return (
    <View style={styles.container}>
      <View>
        {
          user.condo?.Partner ?
          <Image
            style={styles.logoPartner}
            source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${user.condo.Partner.photo_id}` }}
            resizeMode='contain'
          />
          :
          <Image
            style={styles.logo}
            source={Constants.logoPic}
            resizeMode='contain'
          />
        }
      </View>
      <View>
        <Text style={[styles.greeting, { fontFamily: THEME.FONTS.r700 }]}>
          {Utils.saudacaoHorario(user.name)}
        </Text>
      </View>
      <View style={{ marginRight: 17 }}>
        {
          Utils.canShowMessage(user) ?
            <TouchableHighlight onPress={() => clickMessageHandler()}>
              {newMessagesQtt === 0 ?
                <IconApp name="envelope" color='white' size={26} />
                :
                <BadgedIcon type="font-awesome-5" name="envelope" color='white' />
              }
            </TouchableHighlight>
            :
            <View />
        }
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  divLogo: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  logo: {
    padding: 5,
    borderRadius: 5,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
  },
  logoPartner: {
    padding: 5,
    borderRadius: 2,
    width: 50,
    height: 50,
    backgroundColor: 'black',
  },
  iconMessage: {
    position: 'absolute',
    right: 12,
    padding: 5,
    borderRadius: 5,
  },
  greeting: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10
  },
})

export default Greeting;