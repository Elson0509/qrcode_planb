import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import ActionButtons from '../../components/ActionButtons'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage'
import api from '../../services/api'
import InputBox from '../../components/InputBox'
import ModalConfirmPass from '../../components/ModalConfirmPass'
import { toast } from '../../services/util'
import { useAuth } from '../../contexts/auth'
import CarsView from '../../components/CarsView';
import ResidentsView from '../../components/ResidentsView';
import THEME from '../../services/theme'

const ResidentSearch = props => {
  const { user } = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [unitSelected, setUnitSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [passModal, setPassModal] = useState(false)
  const [modalConfirmDeleteUser, setModalConfirmDeleteUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  const fetchUsers = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    api.get(`api/user/condo/${props.route.params.user.condo_id}/${Constants.USER_KIND["RESIDENT"]}`)
      .then(resp => {
        setUnits(resp.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RS1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delUnitModal = async unit => {
    if(await Utils.handleNoConnection(setLoading)) return
    if (!unit.residents.length && !unit.vehicles.length) {
      return toast('Unidade sem moradores para apagar.')
    }
    setUnitSelected(unit)
    setMessage(`Excluir moradores e veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
    setModal(true)
  }

  const deleteUnitConfirmed = _ => {
    setPassModal(false)
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
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editHandler = async unit => {
    if(await Utils.handleNoConnection(setLoading)) return
    props.navigation.navigate('ResidentEdit',
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
        residents: unit.residents,
        vehicles: unit.vehicles,
        screen: 'ResidentEdit'
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

  const modalConfirmPassHandler = () => {
    setModal(false)
    setPassModal(true)
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchUsers()
    setRefreshing(false)
  }

  const editUserHandler = async resident => {
    if(await Utils.handleNoConnection(setLoading)) return
    props.navigation.navigate('EditResident',
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
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
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
          return (
            <View style={styles.menuItem}>
              <Text style={[styles.listText, { fontFamily: THEME.FONTS.r700 }]}>Bloco {obj.item.bloco_name}</Text>
              <Text style={[styles.listText, { fontFamily: THEME.FONTS.r700 }]}>Unidade {obj.item.number}</Text>
              <View>
                {
                  user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] &&
                  <ActionButtons
                    flexDirection='row'
                    action1={() => editHandler(obj.item)}
                    action2={() => delUnitModal(obj.item)}
                  />
                }
              </View>
              <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                <View>
                  <ResidentsView
                    residents={obj.item.residents}
                    type='Moradores'
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
        btn1Pressed={modalConfirmPassHandler}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modal}
        setModalVisible={setModal}
      />
      <ModalMessage
        message='Confirma a exclusão deste morador?'
        title='Apagar morador'
        btn1Pressed={confirmDeleteUserHandler}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modalConfirmDeleteUser}
        setModalVisible={setModalConfirmDeleteUser}
      />
      <ModalConfirmPass
        modal={passModal}
        setModal={setPassModal}
        action={deleteUnitConfirmed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['Residents'],
    flex: 1
  },
  menuItem: {
    borderBottomWidth: 8,
    borderColor: Constants.backgroundDarkColors['Residents'],
    padding: 15,
    backgroundColor: Constants.backgroundLightColors['Residents'],
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
  plateDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10
  }
});

export default ResidentSearch