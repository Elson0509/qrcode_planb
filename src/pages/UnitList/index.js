import React, { useState, Fragment, useEffect } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  ActivityIndicator
} from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ActionButtons from '../../components/ActionButtons'
import ModalMessage from '../../components/ModalMessage'
import ModalEditUnit from '../../components/ModalEditUnit'
import api from '../../services/api'
import ModalConfirmPass from '../../components/ModalConfirmPass'
import THEME from '../../services/theme'

const UnitList = props => {
  const [blocos, setBlocos] = useState([])
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modalEdit, setModalEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [unitSelected, setUnitSelected] = useState({})
  const [unitWillUpdate, setUnitWillUpdate] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [passModal, setPassModal] = useState(false)

  useEffect(() => {
    listUnits()
  }, [])

  const listUnits = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    api.get(`api/condo/all/${props.route.params.user.condo_id}`)
      .then(resp => {
        setBlocos(resp.data)
        setLoading(false)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UL1)')
        setLoading(false)
      })
  }

  const unitList = _ => {
    const units = []
    blocos.forEach(elbloco => {
      elbloco.Units.forEach(elunit => {
        const unit = {}
        unit.bloco_id = elbloco.id
        unit.bloco_name = elbloco.name
        unit.unit_id = elunit.id
        unit.unit_number = elunit.number
        units.push(unit)
      })
    })
    return units
  }

  const delUnitModal = async unit => {
    if(await Utils.handleNoConnection(setLoading)) return
    setUnitSelected(unit)
    setMessage(`Excluir unidade ${unit.unit_number} do bloco ${unit.bloco_name}, seus moradores e visitantes?`)
    setModal(true)
  }

  const deleteUnitConfirmed = _ => {
    setPassModal(false)
    setLoading(true)
    api.delete(`/api/unit`, {
      data: {
        user_id_last_modify: props.route.params.user.id,
        bloco_id: unitSelected.bloco_id,
        number: unitSelected.unit_number
      }
    })
      .then((resp) => {
        Utils.toast(resp.data.message)
        listUnits()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UL2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const modalConfirmPassHandler = () => {
    setModal(false)
    setPassModal(true)
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    listUnits()
    setRefreshing(false)
  }

  const editUnitModal = async unit => {
    if(await Utils.handleNoConnection(setLoading)) return
    setUnitSelected(unit)
    setUnitWillUpdate(unit)
    setModalEdit(true)
  }

  const editUnitConfirmed = _ => {
    setModalEdit(false)
    setLoading(true)
    api.post('/api/unit/bloco', {
      unitSelected,
      unitWillUpdate,
    })
      .then((resp) => {
        Utils.toast(resp.da)
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UL3)')
      })
      .finally(() => {
        setLoading(false)
        listUnits()
      })
  }

  return (
    <SafeAreaView style={styles.body}>
      {
        loading ?
          <ActivityIndicator size="large" color="white" />
          :
          unitList().length > 0 ? (
            <FlatList
              data={unitList()}
              keyboardShouldPersistTaps="handled"
              keyExtractor={item => item.unit_id}
              refreshControl={
                <RefreshControl
                  enabled={true}
                  refreshing={refreshing}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              renderItem={(obj) => {
                return (
                  <View
                    style={styles.menuItem}
                  >
                    <Text style={[styles.listText, {fontFamily: THEME.FONTS.r400}]}>{`Bloco ${obj.item.bloco_name} Unidade ${obj.item.unit_number}`}</Text>
                    <ActionButtons
                      action1={() => editUnitModal(obj.item)}
                      action2={() => delUnitModal(obj.item)}
                    />
                  </View>
                )
              }}
            />
          )
            :
            (
              <Text style={{ textAlign: 'center', padding: 10 }}>Sem unidades cadastradas.</Text>
            )
      }
      <ModalMessage
        message={message}
        title="Confirme"
        btn1Pressed={modalConfirmPassHandler}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modal}
        setModalVisible={setModal}
      />
      <ModalEditUnit
        btn1Pressed={editUnitConfirmed}
        modalVisible={modalEdit}
        setModalVisible={setModalEdit}
        unitWillUpdate={unitWillUpdate}
        setUnitWillUpdate={setUnitWillUpdate}
      />
      <ModalConfirmPass
        modal={passModal}
        setModal={setPassModal}
        action={deleteUnitConfirmed}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: 90,
    backgroundColor: Constants.backgroundColors['Units'],
    minHeight: '100%',
  },
  
  menuItem: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor:  Constants.backgroundDarkColors['Units'],
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Constants.backgroundLightColors['Units'],
  },
  listText: {
    color: 'black',
    fontSize: 16
  }
});

export default UnitList