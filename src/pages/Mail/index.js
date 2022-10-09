import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';

import { useAuth } from '../../contexts/auth';
import Icon from '../../components/Icon';
import * as Constants from '../../services/constants'
import Greeting from '../../components/Greeting/Greeting';
import THEME from '../../services/theme';

const menuOptions = [
  { menuName: "Receber", icon: 'folder-plus', key: 'mailadd', screen: 'MailAdd' },
  { menuName: "Dar baixa", icon: 'folder-minus', key: 'mailDel', screen: 'MailDel' },
  { menuName: "Listar", icon: 'list', key: 'mailList', screen: 'MailList' },
]

const Mail = (props) => {
  const { user } = useAuth()

  return (
    <View style={[styles.container]}>
      <Greeting />
      <FlatList
        data={menuOptions}
        numColumns={2}
        style={{width: '100%'}}
        renderItem={(obj) => {
          return (
            <TouchableOpacity style={styles.menuItem} onPress={() => { props.navigation.navigate(`${obj.item.screen}`) }}>
              <View style={[styles.menuIcon, { backgroundColor: Constants.backgroundColors['Residents'] }]}>
                <Icon name={obj.item.icon} size={85} color='white' />
              </View>
              <Text style={[{ fontFamily: THEME.FONTS.r500 }, styles.menuItemText]}>{obj.item.menuName}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Constants.backgroundColors['Dashboard'],
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  menuItem: {
    width: '46%',
    height: 140,
    marginLeft: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  menuIcon: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuItemText: {
    marginTop: 5,
    fontSize: 16,
    letterSpacing: 1
  }
})

export default Mail;