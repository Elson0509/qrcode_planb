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
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import THEME from '../../services/theme';

const SindicoList = props => {
  const [sindicos, setSindicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sindicoSelected, setSindicoSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  const fetchUsers = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    api.get(`api/user/adms`)
      .then(resp => {
        setSindicos(resp.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SL1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delSindicoModal = async user => {
    if(await Utils.handleNoConnection(setLoading)) return
    setSindicoSelected(user)
    setMessage(`Excluir síndico ${user.name}?`)
    setModal(true)
  }

  const deleteSindicoConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`api/user/${sindicoSelected.id}`)
      .then(res => {
        Utils.toast(res.data.message)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SL2)')
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
                  noEditButton
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
                        <Text style={{ fontSize: 16, fontFamily: THEME.FONTS.r700 }}>{obj.item.name}</Text>
                        {!!obj.item.Condo.name && <Text style={{ fontSize: 15, fontFamily: THEME.FONTS.r400 }}>Condomínio: {obj.item.Condo.name}</Text>}
                        {!!obj.item.phone && <Text style={{ fontSize: 15, fontFamily: THEME.FONTS.r400 }}>Telefone: {obj.item.phone}</Text>}
                        {!!obj.item.identification && <Text style={{ fontSize: 15, fontFamily: THEME.FONTS.r400 }}>Id: {obj.item.identification}</Text>}
                        {!!obj.item.email && <Text style={{ fontSize: 15, fontFamily: THEME.FONTS.r400 }}>Email: {obj.item.email}</Text>}
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
});

export default SindicoList