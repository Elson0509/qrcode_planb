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
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage'
import api from '../../services/api'
import ActionButtons from '../../components/ActionButtons'
import THEME from '../../services/theme'

const CondoList = props => {
  const [condos, setCondos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCondo, setSelectedCondo] = useState(null)

  useEffect(() => {
    fetchCondos()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchCondos()
    })
    return willFocusSubscription
  }, [])

  const fetchCondos = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    api.get(`api/condo`)
      .then(resp => {
        setCondos(resp.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delCondo = on => {
    setSelectedCondo(on)
    setModal(true)
  }

  const deleteCondoConfirmed = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    setModal(false)
    setLoading(true)
    api.delete(`api/condo/${selectedCondo.id}`)
      .then(res => {
        Utils.toast(res.data.message || 'Condomínio apagado com sucesso.')
        fetchCondos()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchCondos()
    setRefreshing(false)
  }

  const editHandler = async condo => {
    if (await Utils.handleNoConnection(setLoading)) return
    props.navigation.navigate('CondoEdit',
      {
        condoBeingAdded: {
          address: condo.address,
          city: condo.city,
          freeslots: condo.freeslots,
          guard_can_messages: condo.guard_can_messages,
          guard_can_thirds: condo.guard_can_thirds,
          guard_can_visitors: condo.guard_can_visitors,
          id: condo.id,
          name: condo.name,
          photo_id: condo.photo_id,
          resident_can_messages: condo.resident_can_messages,
          resident_can_ocorrences: condo.resident_can_ocorrences,
          resident_can_thirds: condo.resident_can_thirds,
          resident_can_visitors: condo.resident_can_visitors,
          resident_has_dob: condo.resident_has_dob,
          resident_has_owner_field: condo.resident_has_owner_field,
          resident_has_phone: condo.resident_has_phone,
          guard_see_dob: condo.guard_see_dob,
          guard_see_phone: condo.guard_see_phone,
          condo_has_classifieds: condo.condo_has_classifieds,
          condo_has_guard_routes: condo.condo_has_guard_routes,
          condo_has_mail: condo.condo_has_mail,
          condo_has_news: condo.condo_has_news,
          condo_has_reservations: condo.condo_has_reservations,
          slots: condo.slots,
          state: condo.state,
        },
        screen: 'CondoEdit'
      }
    )
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <FlatList
        data={condos}
        keyExtractor={item => item.id}
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
                  action1={() => { editHandler(obj.item) }}
                  action2={() => { delCondo(obj.item) }}
                />
              </View>
              <View style={{ justifyContent: 'space-between', flexDirection: 'column', width: '100%' }}>
                <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5, width: '100%', borderColor: Constants.backgroundDarkColors["Residents"] }}>
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Nome:</Text> {obj.item.name}</Text>
                    <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Endereço:</Text> {obj.item.address}, {obj.item.city} - {obj.item.state}</Text>
                    <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Vagas de estacionamento:</Text> {obj.item.slots}</Text>
                    <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Ativo desde </Text> {Utils.printDate(new Date(obj.item.createdAt))}</Text>
                    <View>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 14, marginTop: 12, textAlign: 'center' }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Colaboradores</Text></Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem ver mensagens? </Text> {obj.item.guard_can_messages ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem cadastrar terceirizados? </Text> {obj.item.guard_can_thirds ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem cadastrar visitantes? </Text> {obj.item.guard_can_visitors ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem ver telefone de moradores? </Text> {obj.item.guard_see_phone ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem ver nascimento de moradores? </Text> {obj.item.guard_see_dob ? ' Sim' : ' Não'}</Text>
                    </View>
                    <View>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 14, marginTop: 12, textAlign: 'center' }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Residentes</Text></Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem ver mensagens? </Text> {obj.item.resident_can_messages ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem cadastrar terceirizados? </Text> {obj.item.resident_can_thirds ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem cadastrar visitantes? </Text> {obj.item.resident_can_visitors ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Podem registrar ocorrências? </Text> {obj.item.resident_can_ocorrences ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possuem telefone? </Text> {obj.item.resident_has_phone ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possuem data de nascimento? </Text> {obj.item.resident_has_dob ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possuem campo de alugado/dono? </Text> {obj.item.resident_has_owner_field ? ' Sim' : ' Não'}</Text>
                    </View>
                    <View>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 14, marginTop: 12, textAlign: 'center' }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Condomínio</Text></Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possui controle de correspondência? </Text> {obj.item.condo_has_mail ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possui classificados? </Text> {obj.item.condo_has_classifieds ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possui ronda de vigilantes? </Text> {obj.item.condo_has_guard_routes ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possui notícias? </Text> {obj.item.condo_has_news ? ' Sim' : ' Não'}</Text>
                      <Text style={{ fontFamily: THEME.FONTS.r400, fontSize: 12, marginLeft: 7 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Possui reservas? </Text> {obj.item.condo_has_reservations ? ' Sim' : ' Não'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        }}
      />
      <ModalMessage
        message={`Tem certeza que quer excluir este condomínio?`}
        title="Confirme"
        btn1Pressed={deleteCondoConfirmed}
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
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: Constants.backgroundColors['Residents'],
    flex: 1,
  },
  menuItem: {
    borderWidth: 1,
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Residents'],
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

export default CondoList