import React, { createContext, useState, useEffect, useRef, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'
import * as Utils from '../services/util'
import * as Constants from '../services/constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//createContext only set up the format of the variable
const AuthContext = createContext(
  {
    signed: false,
    user: {},
    loading: false,
    signIn: (email, password) => { },
    signOut: () => { },
    errorMessage: false,
  }
)

export const AuthProvider = props => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  //notification states
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const loadStorageData = async () => {
      const storagedUser = await AsyncStorage.getItem('@QRSeg:user')
      const storagedToken = await AsyncStorage.getItem('@QRSeg:token')
      if (storagedUser && storagedToken) {
        api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`
        setUser(JSON.parse(storagedUser))
      }
      setLoading(false)
    }
    loadStorageData()
  }, [])

  useEffect(() => {
    AsyncStorage.getItem('@QRSeg:pushtoken')
      .then(data => {
        if (!data) {
          registerForPushNotificationsAsync().then(token => {
            AsyncStorage.setItem('@QRSeg:pushtoken', token).then()
          });
          notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            //console.log(notification)
          });
          responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            //console.log(response);
          });
          return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
          };
        }
      })
  })

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Falha no registro de notificações.');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Precisa ser um dispositivo físico para receber notificações.');
    }
    return token;
  }

  const signInHandler = async (email, password) => {
    if (!Utils.validateEmail(email)) {
      return setErrorMessage('Email não válido.')
    }
    if (password.length < Constants.MIN_PASSWORD_SIZE) {
      return setErrorMessage('Senha muito curta.')
    }
    setLoading(true)
    const pushToken = await AsyncStorage.getItem('@QRSeg:pushtoken')
    api.post('/api/user/login', {
      email: email.toLowerCase(),
      password: password,
      pushtoken: pushToken
    })
      .then(res => {
        const token = res.data.token
        const user = {
          name: res.data.name,
          id: res.data.userId,
          user_kind: res.data.user_kind,
          email: res.data.username,
          condo_id: res.data.condo_id,
          condo: res.data.condo,
          bloco_id: res.data.bloco_id,
          number: res.data.number,
        }
        setUser(user)
        api.defaults.headers['Authorization'] = `Bearer ${token}`
        setErrorMessage('')
        AsyncStorage.setItem('@QRSeg:user', JSON.stringify(user)).then()
        AsyncStorage.setItem('@QRSeg:token', token).then()


      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.message || 'Erro no login. Tente de novo.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const signOutHandler = async _ => {
    AsyncStorage.clear().then(() => {
      setUser(null)
    })
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn: signInHandler, signOut: signOutHandler, errorMessage: errorMessage }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = _ => {
  const context = useContext(AuthContext)
  return context
}