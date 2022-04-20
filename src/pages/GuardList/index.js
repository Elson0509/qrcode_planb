import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import ActionButtons from '../../components/ActionButtons'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage'
import api from '../../services/api'
import PicUser from '../../components/PicUser'
import ModalPhoto from '../../components/ModalPhoto'
import THEME from '../../services/theme'

const GuardList = props => {
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [userSelected, setUserSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)

  useEffect(() => {
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  const fetchUsers = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    api.get(`api/user/kind/${Constants.USER_KIND["GUARD"]}`)
      .then(resp => {
        setResidents(resp.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GL1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delUser = async user => {
    if(await Utils.handleNoConnection(setLoading)) return
    setMessage(`Excluir segurança ${user.name}?`)
    setUserSelected(user)
    setModal(true)
  }

  const deleteUnitConfirmed = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    setModal(false)
    setLoading(true)
    api.delete(`api/user/${userSelected.id}`)
      .then(res => {
        Utils.toast(res.data.message)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GL2)')
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

  const onClickPhotoHandler = async item => {
    if(await Utils.handleNoConnection(setLoading)) return
    if (!item.photo_id)
      return
    setSelectedUser(item)
    setIsModalPhotoActive(true)
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      {
        residents.length > 0 ?
          <FlatList
            data={residents}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefreshHandler()}
              />
            }
            renderItem={(obj) => {
              return (
                <View style={styles.menuItem}>
                  <View>
                    <ActionButtons
                      flexDirection='row'
                      noEditButton
                      action2={() => delUser(obj.item)}
                    />
                  </View>
                  <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5 }}>
                      <TouchableOpacity onPress={() => onClickPhotoHandler(obj.item)}>
                        <PicUser user={obj.item} />
                      </TouchableOpacity>
                      <View>
                        <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r500 }}>{obj.item.name}</Text>
                        {!!obj.item.identification && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Id: {obj.item.identification}</Text>}
                        {!!obj.item.company && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Empresa: {obj.item.company}</Text>}
                        {!!obj.item.email && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Email: {obj.item.email}</Text>}
                      </View>
                    </View>
                  </View>
                </View>
              )
            }}
          />
          :
          <Text style={{ textAlign: 'center', padding: 10, fontFamily: THEME.FONTS.r400 }}>Sem colaboradores cadastrados.</Text>
      }
      <ModalMessage
        message={message}
        title="Confirme"
        btn1Pressed={deleteUnitConfirmed}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modal}
        setModalVisible={setModal}
      />
      <ModalPhoto
        modalVisible={isModalPhotoActive}
        setModalVisible={setIsModalPhotoActive}
        id={selectedUser?.photo_id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['Guards'],
    flex: 1
  },
  menuItem: {
    borderBottomWidth: 1,
    borderColor: Constants.backgroundDarkColors['Guards'],
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Guards'],
  },
});

export default GuardList