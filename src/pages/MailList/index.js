import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import { useAuth } from '../../contexts/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MailDetails from '../../components/MailDetails'

const Tab = createBottomTabNavigator();

const MailList = () => {
  const [loading, setLoading] = useState(false)
  const [mails, setMails] = useState([])

  //fetching mails
  useEffect(() => {
    api.get(`api/mail`)
      .then(res => {
        setMails(res.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const mailList = list => {
    return !!list.length ?
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={list}
          keyExtractor={item => item.id}
          renderItem={(obj) => {
            return (
              <MailDetails
                mail={obj.item}
              />
            )
          }}
        />
      </SafeAreaView>
      :
      <Text style={{padding: 10, textAlign: 'center'}}>Não há itens.</Text>
  }

  function EmEsperaScreen() {
    const pickedMails = mails.filter(el => el.MailStatus.id === Constants.MAIL_STATUS['Em espera'])
    return mailList(pickedMails)
  }

  function ColetadasScreen() {
    const pickedMails = mails.filter(el => el.MailStatus.id === Constants.MAIL_STATUS['Entregue'])
    return mailList(pickedMails)
  }

  function NegadasScreen() {
    const pickedMails = mails.filter(el => el.MailStatus.id === Constants.MAIL_STATUS['Recusado'])
    return mailList(pickedMails)
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Em espera':
              iconName = focused ? 'alarm-outline' : 'time-outline'
              break
            case 'Coletadas':
              iconName = focused ? 'checkmark-done-outline' : 'checkmark-outline'
              break
            case 'Negadas':
              iconName = focused ? 'close-circle-outline' : 'close-outline'
              break
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Em espera" component={EmEsperaScreen} />
      <Tab.Screen name="Coletadas" component={ColetadasScreen} />
      <Tab.Screen name="Negadas" component={NegadasScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['Residents'],
    flex: 1
  },
  errorMessage: {
    color: '#F77',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#F77',
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
});

export default MailList