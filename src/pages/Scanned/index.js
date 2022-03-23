import React, { useState, useEffect,} from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import api from '../../services/api'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import FooterButtons from '../../components/FooterButtons';
import Placa from '../../components/Placa';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import PicUser from '../../components/PicUser';
import ModalMessage from '../../components/ModalMessage';
import ModalGeneric from '../../components/ModalGeneric'

const Scanned = (props) => {
  const [dataFetched, setDataFetched] = useState(null)
  const [backgroundColorScreen, setbackgroundColorScreen] = useState('white')
  const [reading, setReading] = useState(null)
  const [userType, setUserType] = useState('Residente')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [modalEntrance, setModalEntrance] = useState(false)
  const [modalExit, setModalExit] = useState(false)
  const [modalGeneric, setModalGeneric] = useState(false)
  const [messageInfoModal, setMessageInfoModal] = useState('')
  const [messageErrorModal, setMessageErrorModal] = useState('')
  const [disableButtons, setDisableButtons] = useState(false)

  const typeData = props.route.params.typeInput
  const idData = props.route.params.dataInput

  const messageError = 'Esse QR Code não é válido ou o usuário não está cadastrado.'

  useEffect(() => {
    if (typeData != Constants.TYPE_DATA_QRCODE) {
      setLoading(false)
      setErrorMessage(messageError)
      return
    }
    const prefix = idData.substring(0, 4)
    if (prefix != Constants.QR_CODE_PREFIX) {
      setLoading(false)
      setErrorMessage(messageError)
      return
    }
    const dataParts = idData.split(':')
    if (dataParts.length != 2 || !Utils.isUUID(dataParts[1])) {
      setLoading(false)
      setErrorMessage(messageError)
      return
    }

    api.get(`api/reading/${dataParts[1]}`)
      .then(res => {
        setErrorMessage('')
        const fetchedDataApi = res.data.userFound || res.data.unitFound
        setDataFetched(fetchedDataApi)
        setReading(res.data.read)
        if (fetchedDataApi.user_kind_id == Constants.USER_KIND['RESIDENT']) {
          setbackgroundColorScreen(Constants.backgroundColors['Residents'])
          setUserType('Residente')
        }
        if (fetchedDataApi.user_kind_id == Constants.USER_KIND['SUPERINTENDENT']) {
          setbackgroundColorScreen(Constants.backgroundColors['Residents'])
          setUserType('Administrador')
        }
        if (fetchedDataApi.user_kind_id == Constants.USER_KIND['GUARD']) {
          setbackgroundColorScreen(Constants.backgroundColors['Guards'])
          setUserType('Colaborador')
        }
        if (fetchedDataApi.unit_kind_id && fetchedDataApi.unit_kind_id === Constants.USER_KIND['VISITOR']) {
          setbackgroundColorScreen(Constants.backgroundColors['Visitors'])
          setUserType('Visitantes')
        }
        if (fetchedDataApi.unit_kind_id && fetchedDataApi.unit_kind_id === Constants.USER_KIND['THIRD']) {
          setbackgroundColorScreen(Constants.backgroundColors['Thirds'])
          setUserType('Terceirizados')
        }
        setLoading(false)
      })
      .catch(err => {
        setErrorMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SC1)')
        setLoading(false)
      })
  }, [])

  const entranceHandler = _ => {
    setModalEntrance(true)
    setDisableButtons(true)
  }

  const exitHandler = _ => {
    setLoading(true)
    api.put(`api/reading/${reading.id}`)
      .then(resp => {
        setDisableButtons(true)
        setLoading(false)
        setModalExit(true)
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SC3)', Constants.TOAST_CONFIG)
        setLoading(false)
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

  const formatData = () => {
    //user || superintendent
    if (dataFetched && dataFetched.user_kind_id) {
      return (
        <View style={{ backgroundColor: backgroundColorScreen, alignItems: 'center', padding: 10 }}>
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, textDecorationLine: 'underline' }}>{userType}</Text>
          <PicUser user={dataFetched} height={240} width={200} />
          <Text style={{ marginTop: 8, fontSize: 18, fontWeight: 'bold' }}>{dataFetched.name}</Text>
          {!!dataFetched.Unit?.Bloco?.name && <Text style={{ marginTop: 4, fontSize: 18 }}>{`Bloco ${dataFetched.Unit.Bloco.name}`}</Text>}
          {!!dataFetched.Unit?.number && <Text style={{ marginTop: 4, fontSize: 18, marginBottom: 20 }}>{`Unidade ${dataFetched.Unit.number}`}</Text>}
          {!dataFetched.Unit?.Vehicles.length && <Text style={{ textDecorationLine: 'underline', fontSize: 15, }}>Não há veículos cadastrados.</Text>}
          {!!dataFetched.Unit?.Vehicles.length && <Text style={{ fontSize: 15, marginBottom: 0 }}>Veículos cadastrados:</Text>}
          {!!dataFetched.Unit?.Vehicles.length &&
            dataFetched.Unit?.Vehicles.map((el, ind) => {
              return (
                <View key={ind} style={{ borderBottomWidth: 1, padding: 12 }}>
                  <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>{`${el.maker} ${el.model} ${el.color}`}</Text>
                  <Placa placa={el.plate} />
                </View>
              )
            })}
        </View>
      )
    }
    //visitor or third
    if (dataFetched && dataFetched.unit_kind_id) {
      return (
        <View style={{ backgroundColor: backgroundColorScreen, padding: 10 }}>
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, textDecorationLine: 'underline' }}>{userType}</Text>
          <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 0 }}>Autorizado por {'\n'} Bloco {dataFetched.Bloco.name} Unidade {dataFetched.number}</Text>
          {dataFetched.Users.map((el, ind) => {
            return (
              <View key={el.id} style={{ flexDirection: 'row', marginVertical: 5, marginBottom: 4 }}>
                <View>
                  <PicUser user={el} height={120} width={90} />
                </View>
                <View>
                  {!!el.name && <Text style={{ marginTop: 4, fontSize: 18, fontWeight: 'bold' }}>{el.name}</Text>}
                  {!!el.company && <Text style={{ marginTop: 4, fontSize: 18 }}>Empresa: {el.company}</Text>}
                  {!!el.identification && <Text style={{ marginTop: 4, fontSize: 18 }}>{`Id: ${el.identification}`}</Text>}
                </View>
              </View>
            )
          })}

          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {!dataFetched.Vehicles.length && <Text style={{ textDecorationLine: 'underline', fontSize: 15, }}>Não há veículos cadastrados.</Text>}
            {!!dataFetched.Vehicles.length && <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 0, letterSpacing: 1, textDecorationLine: 'underline' }}>Veículos cadastrados</Text>}
            {!!dataFetched.Vehicles.length &&
              dataFetched.Vehicles.map((el, ind) => {
                return (
                  <View key={ind} style={{ padding: 12 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>{`${el.maker} ${el.model} ${el.color}`}</Text>
                    <Placa placa={el.plate} />
                  </View>
                )
              })}
          </View>
          <FooterButtons
            title1='Registrar ENTRADA'
            bgcolor1='#198754'
            title2='Registrar SAÍDA'
            bgcolor2='#ffc107'
            color2='black'
            fontSize={15}
            buttonPadding={15}
            borderRadius={12}
            backgroundColor={backgroundColorScreen}
            action1={() => entranceHandler()}
            action2={() => exitHandler()}
            disabled={disableButtons}
            marginButton={1}
            viewPadding={1}
          />
        </View>
      )
    }
  }

  if (loading)
    return (
      <SafeAreaView>
        <Spinner />
      </SafeAreaView>
    )

  if (errorMessage) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Constants.is_not_autorized_backgroundColor }}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Icon name='exclamation-triangle' color='white' size={100} />
          </View>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
        <FooterButtons
          title1="Escanear"
          title2="Cancelar"
          action1={() => props.navigation.goBack()}
          action2={() => props.navigation.navigate('Dashboard')}
          backgroundColor={Constants.is_not_autorized_backgroundColor}
        />
      </ScrollView>
    )
  }

  return (
    <SafeAreaView style={[styles.AndroidSafeArea, {backgroundColor: backgroundColorScreen}]}>
      <ScrollView style={{ flex: 1}}>
        {formatData()}
        <FooterButtons
          title1="Escanear"
          title2="Cancelar"
          action1={() => props.navigation.goBack()}
          action2={() => props.navigation.navigate('Dashboard')}
          backgroundColor={backgroundColorScreen}
          marginButton={1}
        />
        <ModalMessage
          modalVisible={modalEntrance}
          setModalVisible={setModalEntrance}
          title='Estacionamento'
          message={`Confirmado. ${userType} vão UTILIZAR uma vaga de estacionamento?`}
          btn1Text='Sim'
          btn2Text='Não'
          btn1Pressed={confirmSlotEntrance}
        />
        <ModalMessage
          modalVisible={modalExit}
          setModalVisible={setModalExit}
          title='Estacionamento'
          message={`Confirmado. ${userType} vão LIBERAR uma vaga de estacionamento?`}
          btn1Text='Sim'
          btn2Text='Não'
          btn1Pressed={confirmSlotExit}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: Constants.is_not_autorized_backgroundColor,
    padding: 40,
    paddingTop: 110,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  errorIcon: {
    marginBottom: 80,
  },
  errorMessage: {
    color: 'white',
    fontSize: 28,
    lineHeight: 42,
    textAlign: 'center',
  },
  errorMessageModal: {
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
  infoMessageModal: {
    color: '#77F',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#77F',
    padding: 5,
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
})

export default Scanned;