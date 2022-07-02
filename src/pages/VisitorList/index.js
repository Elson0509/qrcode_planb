import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
} from 'react-native'
import ActionButtons from '../../components/ActionButtons'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage'
import ModalInfo from '../../components/ModalInfo'
import api from '../../services/api'
import ModalQRCode from '../../components/ModalQRCode'
import ModalGeneric from '../../components/ModalGeneric'
import InputBox from '../../components/InputBox'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../contexts/auth'
import THEME from '../../services/theme'
import CarsView from '../../components/CarsView';
import ResidentsView from '../../components/ResidentsView'

const VisitorList = props => {
  const { user } = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [unitSelected, setUnitSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showModalQRCode, setShowModalQRCode] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [unitIdModalQRCode, setUnitIdModalQRCode] = useState('')
  const [entranceExitModal, setEntranceExitModal] = useState(false)
  const [modalEntrance, setModalEntrance] = useState(false)
  const [modalExit, setModalExit] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [messageInfoModal, setMessageInfoModal] = useState('')
  const [messageErrorModal, setMessageErrorModal] = useState('')
  const [modalGeneric, setModalGeneric] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [modalConfirmDeleteUser, setModalConfirmDeleteUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  let beginOfDay = new Date()
  beginOfDay.setHours(0)
  beginOfDay.setMinutes(0)
  beginOfDay.setSeconds(0)
  beginOfDay.setMilliseconds(0)

  const modalQRCodeHandler = id => {
    setUnitIdModalQRCode(Constants.QR_CODE_PREFIX + id)
    setShowModalQRCode(true)
  }

  const fetchUsers = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    api.get(`api/user/condo/${props.route.params.user.condo_id}/${Constants.USER_KIND["VISITOR"]}`)
      .then(resp => {
        setUnits(resp.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delUnitModal = async unit => {
    if (await Utils.handleNoConnection(setLoading)) return
    setUnitSelected(unit)
    setMessage(`Excluir visitantes e veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
    setModal(true)
  }

  const deleteUnitConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`api/user/unit/${unitSelected.id}`, {
      data: {
        user_id_last_modify: props.route.params.user.id,
      }
    })
      .then(res => {
        Utils.toast(res.data.message)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editHandler = async unit => {
    if (await Utils.handleNoConnection(setLoading)) return
    props.navigation.navigate('VisitorEdit',
      {
        user: props.route.params.user,
        selectedBloco: {
          id: unit.bloco_id,
          name: unit.bloco_name
        },
        selectedUnit: {
          id: unit.id,
          number: unit.number
        },
        selectedResident: {
          id: unit.residents[0].User.id,
          name: unit.residents[0].User.name,
        },
        residents: unit.residents,
        vehicles: unit.vehicles,
        screen: 'VisitorEdit'
      }
    )
  }

  const generateInfoUnits = _ => {
    let unitsInfo = []
    units.forEach(bloco => {
      bloco.Units.forEach(unit => {
        const unitInfo = {}
        unitInfo.bloco_id = bloco.id
        unitInfo.bloco_name = bloco.name
        unitInfo.residents = unit.Users
        unitInfo.vehicles = unit.Vehicles
        unitInfo.number = unit.number
        unitInfo.id = unit.id
        unitsInfo.push(unitInfo)
      })
    })

    if (!!nameFilter) {
      unitsInfo = unitsInfo.filter(el => {
        return el.residents.some(res => Utils.removeAccent(res.name.toLowerCase()).indexOf(Utils.removeAccent(nameFilter.toLowerCase())) !== -1) ||
          el.vehicles.some(vei => Utils.removeAccent(vei.plate.toLowerCase()).indexOf(Utils.removeAccent(nameFilter.toLowerCase())) !== -1) ||
          // el.bloco_name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          Utils.removeAccent(el.number.toLowerCase()).indexOf(Utils.removeAccent(nameFilter.toLowerCase())) !== -1
      })
    }

    return unitsInfo
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchUsers()
    setRefreshing(false)
  }

  const carIconHandler = async unit => {
    if (await Utils.handleNoConnection(setLoading)) return
    setUnitSelected(unit)
    //valid user?
    if (!(new Date(unit.residents[0].final_date) >= beginOfDay && new Date(unit.residents[0].initial_date) <= beginOfDay)) {
      return Utils.toast('Visitantes fora da data de autorização.')
    }
    setEntranceExitModal(true)
  }

  const exitHandler = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setLoading(true)
    api.get(`api/reading/${unitSelected.id}/0`)
      .then(res => {
        setLoading(false)
        let message = 'Confirmado. Visitantes vão LIBERAR uma vaga de estacionamento? '
        setMessageInfoModal(message)
        setModalExit(true)
        setEntranceExitModal(false)
      })
      .catch(err => {
        setLoading(false)
        setEntranceExitModal(false)
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VS3)')
      })
  }

  const entranceHandler = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setLoading(true)
    api.get(`api/reading/${unitSelected.id}/1`)
      .then(res => {
        setLoading(false)
        let message = 'Confirmado. '
        if (res.data.freeslots === 0) {
          //there are not free slots
          message += 'Mas não há vagas de estacionamento disponíveis.'
          setMessageErrorModal(message)
          setModalMessage(true)
        }
        else {
          //there are free slots
          message += res.data.freeslots > 1 ? `Há ${res.data.freeslots} vagas livres. Visitantes vão OCUPAR uma vaga?` : 'Há uma vaga livre. Visitantes vão ocupar esta vaga?'
          setMessageInfoModal(message)
          setModalEntrance(true)
        }
        setEntranceExitModal(false)
      })
      .catch(err => {
        setLoading(false)
        setEntranceExitModal(false)
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VS2)')
      })
  }

  const confirmSlotEntrance = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setModalEntrance(false)
    setModalGeneric(true)
    setLoadingMessage(true)
    api.get(`api/condo/occupyslot`)
      .then(resp => {
        const freeslots = resp.data.freeslots
        let message = resp.data.message + ' '
        if (freeslots > 0) {
          message += `Ainda ${freeslots > 1 ? `restam ${freeslots} vagas` : 'resta 1 vaga'}.`
        }
        else {
          message += 'Não restam mais novas vagas.'
        }

        setMessageInfoModal(message)
      })
      .catch(err => {
        setMessageErrorModal(err.response?.data?.message)
      })
      .finally(() => {
        setLoadingMessage(false)
      })
  }

  const confirmSlotExit = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setModalExit(false)
    setModalGeneric(true)
    setLoadingMessage(true)
    api.get(`api/condo/freeslot`)
      .then(resp => {
        const freeslots = resp.data.freeslots
        const message = resp.data.message + ` Ainda ${freeslots > 1 ? `restam ${freeslots} vagas` : 'resta 1 vaga'}.`
        setMessageInfoModal(message)
      })
      .catch(err => {
        setMessageErrorModal(err.response?.data?.message)
      })
      .finally(() => {
        setLoadingMessage(false)
      })
  }

  const editUserHandler = async resident => {
    if(await Utils.handleNoConnection(setLoading)) return
    props.navigation.navigate('EditVisitor',
      {
        resident
      }
    )
  }

  const deleteUserHandler = resident => {
    setSelectedUser(resident)
    setModalConfirmDeleteUser(true)
  }

  const confirmDeleteUserHandler = _ => {
    api.delete(`api/user/${selectedUser.id}`)
      .then(res => {
        Utils.toast(res.data?.message || 'Usuário apagado.')
        setModalConfirmDeleteUser(false)
        fetchUsers()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (DU)')
      })
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <View style={{ paddingHorizontal: 10 }}>
        <InputBox
          text=''
          colorLabel='black'
          backgroundColor={Constants.backgroundLightColors['Visitors']}
          borderColor={Constants.backgroundDarkColors['Visitors']}
          colorInput={Constants.backgroundDarkColors['Visitors']}
          autoCapitalize='words'
          value={nameFilter}
          changed={(val => setNameFilter(val))}
          placeholder='Pesquisa por nome, placa ou número'
        />
      </View>
      <FlatList
        data={generateInfoUnits()}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefreshHandler()}
          />
        }
        renderItem={(obj) => {
          //don't show if there is not visitors and vehicles
          if (obj.item.residents.length === 0 && obj.item.vehicles.length === 0)
            return null

          return (
            <View style={styles.menuItem}>
              <Text style={[styles.listText, { fontFamily: THEME.FONTS.r700 }]}>Bloco {obj.item.bloco_name}</Text>
              <Text style={[styles.listText, { fontFamily: THEME.FONTS.r700 }]}>Unidade {obj.item.number}</Text>
              <View>
                {
                  user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] || user.user_kind === Constants.USER_KIND['RESIDENT'] ?
                  <ActionButtons
                    flexDirection='row'
                    action1={() => editHandler(obj.item)}
                    action2={() => delUnitModal(obj.item)}
                    action3={() => modalQRCodeHandler(obj.item.id)}
                    qrCodeButton={true}
                  />
                  : null
                }
                {
                  user.user_kind === Constants.USER_KIND['GUARD'] &&
                  <ActionButtons
                    flexDirection='row'
                    noDeleteButton
                    editIcon='people-arrows'
                    action1={() => carIconHandler(obj.item)}
                  />
                }
              </View>
              <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                <View>
                  <ResidentsView
                    residents={obj.item.residents}
                    type='Visitantes'
                    editUserHandler={editUserHandler}
                    deleteUserHandler={deleteUserHandler}
                  />
                  <CarsView
                    vehicles={obj.item.vehicles}
                  />
                </View>
              </View>
            </View>
          )
        }}
      />
      <ModalMessage
        message={message}
        title="Confirme"
        btn1Pressed={deleteUnitConfirmed}
        btn1Text='Apagar'
        btn2Text='Cancelar'
        modalVisible={modal}
        setModalVisible={setModal}
      />
      <ModalMessage
        message='Confirma a exclusão deste visitante?'
        title='Apagar visitante'
        btn1Pressed={confirmDeleteUserHandler}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modalConfirmDeleteUser}
        setModalVisible={setModalConfirmDeleteUser}
      />
      <ModalQRCode
        modalVisible={showModalQRCode}
        setModalVisible={setShowModalQRCode}
        value={unitIdModalQRCode}
      />
      <ModalMessage
        message={'Deseja registrar entrada ou saída de visitantes?'}
        modalVisible={entranceExitModal}
        setModalVisible={setEntranceExitModal}
        title='Entrada/Saída'
        btn1Text='ENTRADA'
        btn2Text='SAÍDA'
        btn1Pressed={() => entranceHandler()}
        btn2Pressed={() => exitHandler()}
      />
      <ModalMessage
        message={messageInfoModal}
        modalVisible={modalEntrance}
        setModalVisible={setModalEntrance}
        btn1Text='Sim'
        btn2Text='Não'
        btn1Pressed={() => confirmSlotEntrance()}
      />
      <ModalMessage
        message={messageInfoModal}
        modalVisible={modalExit}
        setModalVisible={setModalExit}
        btn1Text='Sim'
        btn2Text='Não'
        btn1Pressed={() => confirmSlotExit()}
      />
      <ModalInfo
        modalVisible={modalMessage}
        setModalVisible={setModalMessage}
        message={messageErrorModal}
        btn1Text='Entendido'
      />
      <ModalGeneric
        modalVisible={modalGeneric}
        setModalVisible={setModalGeneric}
      >
        {
          loadingMessage &&
          <View>
            <Spinner />
          </View>
          ||
          <View>
            {
              !!messageInfoModal &&
              <Text style={styles.infoMessageModal}>
                {messageInfoModal}
              </Text>
            }
            {
              !!messageErrorModal &&
              <Text style={styles.errorMessageModal}>
                {messageErrorModal}
              </Text>
            }
          </View>
        }
      </ModalGeneric>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['Visitors'],
    flex: 1
  },
  menuItem: {
    borderBottomWidth: 8,
    borderColor: Constants.backgroundDarkColors['Visitors'],
    padding: 15,
    backgroundColor: Constants.backgroundLightColors['Visitors'],
  },
  listText: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center'
  },
  errorMessageModal: {
    color: '#F77',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#F77',
    padding: 5,
  },
  infoMessageModal: {
    color: '#77F',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#77F',
    padding: 5,
  },
  plateDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10
  }
});

export default VisitorList