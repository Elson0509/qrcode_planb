import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Text,
} from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MailDetails from '../../components/MailDetails'
import InputBox from '../../components/InputBox'
import ModalMessage from '../../components/ModalMessage'

const Tab = createBottomTabNavigator();

const MailList = (props) => {
  const [loading, setLoading] = useState(false)
  const [mails, setMails] = useState([])
  const [filter, setFilter] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedMail, setSelectedMail] = useState(null)

  //fetching mails
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchMails()
    })
    return willFocusSubscription
    
  }, [])

  const fetchMails = _ => {
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
  }

  const filterData = list => {
    let tempList = [...list]
    if (!!filter) {
      tempList = tempList.filter(el => {
        return el.tracking_code.toLowerCase().indexOf(Utils.removeAccent(filter.toLowerCase())) !== -1 ||
          Utils.removeAccent(el.notes.toLowerCase()).indexOf(Utils.removeAccent(filter.toLowerCase())) !== -1 ||
          Utils.printDateAndHour(new Date(el.createdAt)).indexOf(Utils.removeAccent(filter.toLowerCase())) !== -1
      })
    }
    return tempList
  }

  const classifyMailHandler = mail => {
    props.navigation.navigate('MailEdit', mail)
  }

  const deleteMailHandler = mail => {
    setSelectedMail(mail)
    setModalMessage(true)
  }

  const confirmDelHandler = () => {
    setModalMessage(false)
    setLoading(true)
    api.delete(`api/mail/${selectedMail.id}`)
      .then(()=>{
        Utils.toast('Correspondência apagada!')
        fetchMails()
      })
      .catch(()=>{
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MaD1)')
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  const mailList = list => {
    return !!list.length ?
      <SafeAreaView style={{ flex: 1 }} >
        <FlatList
          data={filterData(list)}
          keyExtractor={item => item.id}
          renderItem={(obj) => {
            return (
              <MailDetails
                mail={obj.item}
                classifyMailHandler={classifyMailHandler}
                deleteMailHandler={deleteMailHandler}
              />
            )
          }}
        />
      </SafeAreaView>
      :
      <Text style={{ padding: 10, textAlign: 'center' }}>Não há itens.</Text>
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
    <View style={{flex: 1}}>
      <View style={{ paddingHorizontal: 5 }}>
      <InputBox
          text=''
          colorLabel='black'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
          autoCapitalize='none'
          value={filter}
          changed={(val => setFilter(val))}
          placeholder='Pesquisar'
          borderWidth={1}
        />
        <ModalMessage
          modalVisible={modalMessage}
          setModalVisible={setModalMessage}
          title='Confirme'
          btn1Text='Apagar'
          btn2Text='Cancelar'
          message='Deseja realmente apagar esta correspondência?'
          btn1Pressed={confirmDelHandler}
        />
      </View>
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
      </View>
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