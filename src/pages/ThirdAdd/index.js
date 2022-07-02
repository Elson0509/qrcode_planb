import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import TakePic from '../../components/TakePic';
import ModalMessage from '../../components/ModalMessage';
import AddThirdsGroup from '../../components/AddThirdsGroup';
import AddCarsGroup from '../../components/AddCarsGroup';
import SelectBlocoGroup from '../../components/SelectBlocoGroup';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import ModalSelectResident from '../../components/ModalSelectResident';
import FooterButtons from '../../components/FooterButtons';
import SelectDatesVisitorsGroup from '../../components/SelectDatesVisitorsGroup';
import ModalQRCode from '../../components/ModalQRCode';
import api from '../../services/api';
import { useAuth } from '../../contexts/auth';

const ThirdAdd = props => {
  const currentDate = new Date()
  const { user } = useAuth()

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [blocos, setBlocos] = useState([])
  const [modalSelectBloco, setModalSelectBloco] = useState(false)
  const [modalSelectUnit, setModalSelectUnit] = useState(false)
  const [modalSelectResident, setModalSelectResident] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState(user.user_kind === Constants.USER_KIND['RESIDENT'] ? {} : null)
  const [selectedUnit, setSelectedUnit] = useState(user.user_kind === Constants.USER_KIND['RESIDENT'] ? {} : null)
  const [selectedResident, setSelectedResident] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
  const [errorSetDateMessage, setErrorSetDateMessage] = useState('')
  const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
  const [residents, setResidents] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [vehicleBeingAdded, setVehicleBeingAdded] = useState({ maker: '', model: '', color: '', plate: '' })
  const [userBeingAdded, setUserBeingAdded] = useState({ name: '', identification: '', company: '', pic: '' })
  const [dateInit, setDateInit] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [dateEnd, setDateEnd] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [selectedDateInit, setSelectedDateInit] = useState('')
  const [selectedDateEnd, setSelectedDateEnd] = useState('')
  const [showModalQRCode, setShowModalQRCode] = useState(false)
  const [unitIdModalQRCode, setUnitIdModalQRCode] = useState('')
  const [addingUser, setAddingUser] = useState(false)
  const [addingDates, setAddingDates] = useState(false)
  const [addingVehicle, setAddingVehicle] = useState(false)
  const [isTakingPic, setIsTakingPic] = useState(false)
  const [isNoUnits, setIsNoUnits] = useState(false)

  //fetching blocos
  useEffect(() => {
    if (user.user_kind !== Constants.USER_KIND['RESIDENT']) {
      setLoading(true)
      api.get(`api/condo/${props.route.params.user.condo_id}`)
        .then(res => {
          setBlocos(res.data)
          if (res.data.length === 0) {
            setIsNoUnits(true)
          }
        })
        .catch(err => {
          Utils.toastTimeoutOrErrorMessage(err, err.response.data.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Desculpe, mas precisamos de permissão da câmera. Verifique as configurações.');
        }
      }
    })();
  }, []);

  const removeResident = async index => {
    if (await Utils.handleNoConnection(setLoading)) return
    const residentsCopy = [...residents]
    residentsCopy.splice(index, 1)
    setResidents(residentsCopy)
  }

  const removeVehicle = async index => {
    if (await Utils.handleNoConnection(setLoading)) return
    const vehiclesCopy = [...vehicles]
    vehiclesCopy.splice(index, 1)
    setVehicles(vehiclesCopy)
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(Constants.ImagePickerOptions);
    const compressed = await Utils.compressImage(result.uri)
    if (!result.cancelled) {
      setUserBeingAdded(prev => { return { ...prev, pic: compressed.uri } })
    }
  }

  const addResidentHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!userBeingAdded.name) {
      setErrorAddResidentMessage('Nome não pode estar vazio.')
      return false
    }
    if(userBeingAdded.name.length < Constants.MIN_NAME_SIZE){
      setErrorAddResidentMessage(`Nome deve ter no mínimo ${Constants.MIN_NAME_SIZE} caracteres.`)
      return false
    }
    if (!userBeingAdded.identification) {
      setErrorAddResidentMessage('Documento não pode estar vazio.')
      return false
    }
    if (!userBeingAdded.company) {
      setErrorAddResidentMessage('Empresa não pode estar vazio.')
      return false
    }
    // if (!userBeingAdded.pic) {
    //   setErrorAddResidentMessage('É necessário adicionar uma foto.')
    //   return false
    // }
    setResidents(prev => [...prev, userBeingAdded])
    setErrorAddResidentMessage('')
    setUserBeingAdded({ id: "0", name: '', company: '', identification: '', pic: '' })
    return true
  }

  const selectDatesHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!Utils.isValidDate(dateInit.day, dateInit.month, dateInit.year)) {
      setErrorSetDateMessage('Data inicial não é válida.')
      return false
    }
    if (!Utils.isValidDate(dateEnd.day, dateEnd.month, dateEnd.year)) {
      setErrorSetDateMessage('Data final não é válida.')
      return false
    }
    const dateInicial = new Date(dateInit.year, dateInit.month - 1, dateInit.day)
    const dateFinal = new Date(dateEnd.year, dateEnd.month - 1, dateEnd.day)
    if (dateFinal < dateInicial) {
      setErrorSetDateMessage('Data final precisa ser após a data inicial')
      return false
    }
    setSelectedDateInit(dateInicial)
    setSelectedDateEnd(dateFinal)
    return true
  }

  const cancelDatesHandler = _ => {
    setSelectedDateInit('')
    setSelectedDateEnd('')
  }

  const cancelAddResidentHandler = _ => {
    setUserBeingAdded({ name: '', identification: '', company: '', email: '', pic: '' })
    setErrorAddResidentMessage('')
  }

  const addVehicleHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!vehicleBeingAdded.maker) {
      setErrorAddVehicleMessage('Fabricante não pode estar vazio.')
      return false
    }
    if (!vehicleBeingAdded.model) {
      setErrorAddVehicleMessage('Modelo não pode estar vazio.')
      return false
    }
    if (!vehicleBeingAdded.color) {
      setErrorAddVehicleMessage('Cor não pode estar vazia.')
      return false
    }
    if (!vehicleBeingAdded.plate) {
      setErrorAddVehicleMessage('Placa não pode estar vazia.')
      return false
    }
    if (!Utils.validatePlateFormat(vehicleBeingAdded.plate)) {
      setErrorAddVehicleMessage('Formato de placa inválido.')
      return false
    }
    setVehicles(prev => [...prev, vehicleBeingAdded])
    setErrorAddVehicleMessage('')
    setVehicleBeingAdded({ maker: '', model: '', color: '', plate: '' })
    return true
  }

  const cancelVehicleHandler = _ => {
    setVehicleBeingAdded({ maker: '', model: '', color: '', plate: '' })
    setErrorAddVehicleMessage('')
  }

  const photoTaken = photoUri => {
    setIsTakingPic(false)
    setUserBeingAdded(prev => { return { ...prev, pic: photoUri } })
  }

  const photoClickHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    setIsTakingPic(true)
  }

  const selectBlocoHandler = bloco => {
    setSelectedBloco(bloco)
    setModalSelectBloco(false)
    setModalSelectUnit(true)
  }

  const selectUnitHandler = unit => {
    setSelectedUnit(unit)
    setModalSelectUnit(false)
    //setDateEnd({ day: '', month: '', year: '' })
    setModalSelectResident(true)
  }

  const selectResidentHandler = res => {
    setSelectedResident(res)
    setModalSelectResident(false)
  }

  const clearUnit = _ => {
    setSelectedBloco(null)
    setSelectedUnit(null)
    setResidents([])
    setVehicles([])
    cancelDatesHandler()
  }

  const cancelHandler = _ => {
    clearUnit()
    setResidents([])
    setVehicles([])
    props.navigation.navigate('Thirds')
  }

  //saving...
  const confirmHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    //checking if there is date selected and at least one visitor
    if (!selectedDateInit || !selectedDateEnd) {
      return setErrorMessage('É preciso selecionar um prazo.')
    }
    if (!residents.length)
      return setErrorMessage('É preciso adicionar terceirizados.')
    setErrorMessage('')
    setLoading(true)
    //storing unit for kind Visitor
    api.post(`api/user/person/unit`, {
      residents,
      number: user.user_kind === Constants.USER_KIND['RESIDENT'] ? user.number : selectedUnit.number,
      vehicles,
      bloco_id: user.user_kind === Constants.USER_KIND['RESIDENT'] ? user.bloco_id : selectedBloco.id,
      selectedDateInit,
      selectedDateEnd,
      user_permission: user.user_kind === Constants.USER_KIND['RESIDENT'] ? user.id : selectedResident.id,
      unit_kind_id: Constants.USER_KIND.THIRD,
      user_id_last_modify: props.route.params.user.id,
    })
      .then(res => {
        uploadImgs(res.data.personsAdded)
        Utils.toast(res.data.message)
        setSelectedUnit(null)
        setSelectedBloco(null)
        setSelectedResident(null)
        setResidents([])
        setVehicles([])
        setLoading(false)
        //showing QRCode
        setUnitIdModalQRCode(Constants.QR_CODE_PREFIX + res.data.newUnit.id)
        setShowModalQRCode(true)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const uploadImgs = newResidents => {
    const residentsPics = []
    newResidents.forEach(nr => {
      residents.forEach(re => {
        if (nr.name === re.name &&
          nr.identification === re.identification &&
          re.pic != "")
          residentsPics.push({ id: nr.id, pic: re.pic })
      })
    })
    residentsPics.forEach(el => {
      const formData = new FormData()
      formData.append('img', {
        uri: el.pic,
        type: 'image/jpg',
        name: el.id + '.jpg'
      })
      api.post(`api/user/image/${el.id}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',

        }
      })
        .then(res => {
          console.log('success', res.data)
        })
        .catch(err => {
          console.log('error', err.response)
        })
    })
  }

  const backgroundColorBoxes = '#FF6666'
  const backgroundColorButtonBoxes = '#FFA0A0'

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  if (isNoUnits) {
    return <SafeAreaView style={styles.body}>
      <Text style={{ textAlign: 'center', padding: 10 }}>Não há unidades ou residentes cadastrados.</Text>
    </SafeAreaView>
  }

  return (
    isTakingPic ?
      <TakePic
        clicked={photoTaken}
      />
      :
      <SafeAreaView style={styles.body}>
        <ScrollView style={{ flex: 1, padding: 10, }} keyboardShouldPersistTaps="handled">
          {
            user.user_kind !== Constants.USER_KIND['RESIDENT'] ?
              <SelectBlocoGroup
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
                pressed={() => setModalSelectBloco(true)}
                selectedBloco={selectedBloco}
                selectedUnit={selectedUnit}
                clearUnit={clearUnit}
                resident={selectedResident}
              />
              :
              null
          }
          {!!selectedUnit &&
            <View>
              <AddThirdsGroup
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
                residents={residents}
                userBeingAdded={userBeingAdded}
                setUserBeingAdded={setUserBeingAdded}
                photoClickHandler={photoClickHandler}
                pickImage={pickImage}
                errorAddResidentMessage={errorAddResidentMessage}
                addResidentHandler={addResidentHandler}
                cancelAddResidentHandler={cancelAddResidentHandler}
                removeResident={removeResident}
                addingUser={addingUser}
                setAddingUser={setAddingUser}
                buttonText='Incluir Terc.'
              />
              <SelectDatesVisitorsGroup
                selectedDateInit={Utils.printDate(selectedDateInit)}
                selectedDateEnd={Utils.printDate(selectedDateEnd)}
                selectDatesHandler={selectDatesHandler}
                cancelDatesHandler={cancelDatesHandler}
                backgroundColorInput={Constants.backgroundLightColors["Thirds"]}
                borderColor={Constants.backgroundDarkColors["Thirds"]}
                colorInput={Constants.backgroundDarkColors["Thirds"]}
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
                dateInit={dateInit}
                setDateInit={setDateInit}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                errorMessage={errorSetDateMessage}
                addingDates={addingDates}
                setAddingDates={setAddingDates}
              />
              <AddCarsGroup
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
                data={vehicles}
                vehicleBeingAdded={vehicleBeingAdded}
                setVehicleBeingAdded={setVehicleBeingAdded}
                errorAddVehicleMessage={errorAddVehicleMessage}
                addVehicleHandler={addVehicleHandler}
                cancelVehicleHandler={cancelVehicleHandler}
                removeVehicle={removeVehicle}
                backgroundLightColor={Constants.backgroundLightColors['Thirds']}
                backgroundDarkColor={Constants.backgroundDarkColors['Thirds']}
                addingVehicle={addingVehicle}
                setAddingVehicle={setAddingVehicle}
              />
              {
                !addingDates && !addingUser && !addingVehicle &&
                <FooterButtons
                  backgroundColor={Constants.backgroundColors['Thirds']}
                  title1="Confirmar"
                  title2="Cancelar"
                  errorMessage={errorMessage}
                  buttonPadding={15}
                  fontSize={17}
                  action1={confirmHandler}
                  action2={cancelHandler}
                />
              }
            </View>
          }
        </ScrollView>
        <ModalMessage
          message={errorMessage}
          title="Atenção"
          modalVisible={modal}
          setModalVisible={setModal}
        />
        <ModalSelectBloco
          selectBlocoHandler={selectBlocoHandler}
          blocos={blocos}
          modalVisible={modalSelectBloco}
          setModalVisible={setModalSelectBloco}
          backgroundItem={'#FFE5E5'}
          text='Mostrando apenas blocos com residentes'
        />
        <ModalSelectUnit
          bloco={selectedBloco}
          modalVisible={modalSelectUnit}
          setModalVisible={setModalSelectUnit}
          selectUnitHandler={selectUnitHandler}
          backgroundItem={'#FFE5E5'}
          text='Mostrando apenas unidades com residentes'
        />
        {
          !!selectedUnit &&
          <ModalSelectResident
            modalVisible={modalSelectResident}
            setModalVisible={setModalSelectResident}
            users={selectedUnit.Users}
            backgroundItem={'#FFE5E5'}
            selectResidentHandler={selectResidentHandler}
          />
        }
        <ModalQRCode
          text={`QR Code dos ${"\n"}terceirizados adicionados`}
          modalVisible={showModalQRCode}
          setModalVisible={setShowModalQRCode}
          value={unitIdModalQRCode}
          action2={() => {setShowModalQRCode(false); props.navigation.navigate('Thirds')}}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['Thirds'],
    flex: 1
  },
  fontTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    paddingBottom: 5,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  box: {
    marginBottom: 20
  },
  borderBottomTitle: {
    borderBottomColor: 'white',
    borderBottomWidth: 3,
  },
  marginTop: {
    marginTop: 15,
  },
  borderTop: {
    borderTopColor: 'white',
    borderTopWidth: 1,
  },
  resultText: {
    paddingTop: 15,
    color: 'white',
    textAlign: 'center',
  },
  sizeText: {
    fontSize: 20
  },
  sizeResult: {
    fontSize: 40
  }
});

export default ThirdAdd