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
import ActionButtons from '../../components/ActionButtons';
import * as Constants from '../../services/constants'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import PicUser from '../../components/PicUser';
import InputBox from '../../components/InputBox';
import ModalConfirmPass from '../../components/ModalConfirmPass';
import Placa from '../../components/Placa'
import { useAuth } from '../../contexts/auth';

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

  useEffect(() => {
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  const fetchUsers = _ => {
    api.get(`api/user/condo/${props.route.params.user.condo_id}/${Constants.USER_KIND["RESIDENT"]}`)
      .then(resp => {
        setUnits(resp.data)
      })
      .catch(err => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RS1)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delUnitModal = unit => {
    if (!unit.residents.length && !unit.vehicles.length) {
      return Toast.show('Unidade sem moradores para apagar.', Constants.configToast)
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
        Toast.show(res.data.message, Constants.configToast)
        fetchUsers()
      })
      .catch((err) => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL2)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editHandler = unit => {
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
        return el.residents.some(res => res.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) ||
          el.vehicles.some(vei => vei.plate.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) ||
          el.bloco_name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 ||
          el.number.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1
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
          placeholder='Pesquisa por nome, placa, bloco ou número'
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
              <Text style={styles.listText}>Bloco {obj.item.bloco_name} Unidade {obj.item.number}</Text>
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
                  <View>
                    {(!obj.item.residents || obj.item.residents.length === 0) && <Text style={{ marginTop: 10, textDecorationLine: 'underline' }}>Unidade sem moradores</Text>}
                    {obj.item.residents.length > 0 && <Text style={styles.subTitle}>Moradores</Text>}
                    {
                      obj.item.residents.map((res) => {
                        return (
                          <View key={res.id} style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 15 }}>
                            <View>
                              <PicUser user={res} />
                            </View>
                            <View>
                              <Text style={{ fontSize: 18, marginLeft: 7 }}>{res.name}</Text>
                              {!!res.email && <Text style={{ fontSize: 16, marginLeft: 7 }}>Email: {res.email}</Text>}
                              {!!res.identification && <Text style={{ fontSize: 16, marginLeft: 7 }}>Id: {res.identification}</Text>}
                            </View>
                          </View>
                        )
                      })
                    }
                  </View>
                  <View>
                    {obj.item.vehicles?.length > 0 && <Text style={styles.subTitle}>Veículos</Text>}
                    {(!obj.item.vehicles || obj.item.vehicles.length === 0) && <Text style={{ marginTop: 10, textDecorationLine: 'underline' }}>Sem veículos cadastrados</Text>}
                    {
                      obj.item.vehicles?.map((car, ind) => {
                        return (
                          <View key={ind} style={styles.plateDiv}>
                            <Text>{`${car.maker} ${car.model} ${car.color}`}</Text>
                            <Placa placa={car.plate} />
                          </View>
                        )
                      })
                    }
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
        btn1Pressed={modalConfirmPassHandler}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modal}
        setModalVisible={setModal}
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
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  subTitle: {
    fontWeight: 'bold',
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