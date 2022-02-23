import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Image,
  Text,
} from 'react-native';
import ActionButtons from '../../components/ActionButtons';
import * as Constants from '../../services/constants'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import PicUser from '../../components/PicUser';

const SindicoList = props => {
  const [sindicos, setSindicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sindicoSelected, setSindicoSelected] = useState(null)
  const [userSelected, setUserSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  const fetchUsers = _ => {
    api.get(`api/user/adms`)
      .then(resp => {
        setSindicos(resp.data)
      })
      .catch(err => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SL1)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delSindicoModal = user => {
    setSindicoSelected(user)
    setMessage(`Excluir síndico ${user.name}?`)
    setModal(true)
  }

  const deleteSindicoConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`api/user/${sindicoSelected.id}`)
      .then(res => {
        Toast.show(res.data.message, Constants.configToast)
        fetchUsers()
      })
      .catch((err) => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SL2)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchUsers()
    setRefreshing(false)
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <FlatList
        data={sindicos}
        keyExtractor={item => item.id}
        style={{ marginBottom: 80, paddingRight: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefreshHandler()}
          />
        }
        renderItem={(obj) => {
          return (
            <View
              style={styles.menuItem}
            >
              <View>
                <ActionButtons
                  flexDirection='row'
                  action1={() => console.log(obj.item)}
                  action2={() => delSindicoModal(obj.item)}
                />
              </View>
              <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                <View>
                  <View>
                    <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5 }}>
                      <View>
                        {
                          !!obj.item.photo_id ?
                            <Image
                              style={{ width: 55, height: 73, marginRight: 5 }}
                              source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${obj.item.photo_id}` }}
                            />
                            :
                            <Image
                              style={{ width: 55, height: 73, marginRight: 5 }}
                              source={Constants.genericProfilePic}
                            />
                        }
                      </View>
                      <View style={{ marginLeft: 7 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{obj.item.name}</Text>
                        {!!obj.item.Condo.name && <Text style={{ fontSize: 15 }}>Condomínio: {obj.item.Condo.name}</Text>}
                        {!!obj.item.identification && <Text style={{ fontSize: 15 }}>Id: {obj.item.identification}</Text>}
                        {!!obj.item.email && <Text style={{ fontSize: 15 }}>Email: {obj.item.email}</Text>}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        }}
      />
      <ModalMessage
        message={message}
        title="Confirme"
        btn1Pressed={deleteSindicoConfirmed}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modal}
        setModalVisible={setModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['Visitors'],
    minHeight: '100%'
  },
  menuItem: {
    borderWidth: 1,
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Visitors'],
    borderRadius: 20,
    marginBottom: 10,
  },
  listText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 5,
  }
});

export default SindicoList