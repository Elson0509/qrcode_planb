import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage'
import AddResidentsGroup from '../../components/AddResidentsGroup'
import AddCarsGroup from '../../components/AddCarsGroup'
import SelectBlocoGroup from '../../components/SelectBlocoGroup'
import ModalSelectBloco from '../../components/ModalSelectBloco'
import ModalSelectUnit from '../../components/ModalSelectUnit'
import FooterButtons from '../../components/FooterButtons'
import api from '../../services/api'
import { useAuth } from '../../contexts/auth'

const ResidentAdd = props => {
  const { user } = useAuth()

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [blocos, setBlocos] = useState([])
  const [modalSelectBloco, setModalSelectBloco] = useState(false)
  const [modalSelectUnit, setModalSelectUnit] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState(props.route?.params?.selectedBloco || null)
  const [selectedUnit, setSelectedUnit] = useState(props.route?.params?.selectedUnit || null)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
  const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
  const [residents, setResidents] = useState(props.route?.params?.residents ? props.route.params.residents.map(el=> {return {...el, dob: new Date(el.dob)}}) : [])
  const [vehicles, setVehicles] = useState(props.route?.params?.vehicles || [])
  const [vehicleBeingAdded, setVehicleBeingAdded] = useState({ id: "0", maker: '', model: '', color: '', plate: '' })
  const [userBeingAdded, setUserBeingAdded] = useState(props.route?.params?.userBeingAdded || { id: "0", name: '', identification: '', email: '', pic: '', phone: '', dob: null })
  const [dobBeingAdded, setDobBeingAdded] = useState({ day: '', month: '', year: '' })
  const [screen, setScreen] = useState(props.route?.params?.screen || 'ResidentAdd')
  const [addingUser, setAddingUser] = useState(false)
  const [addingVehicle, setAddingVehicle] = useState(false)

  //fetching blocos
  useEffect(() => {
    api.get(`api/condo/all/${props.route.params.user.condo_id}`)
      .then(res => {
        setBlocos(res.data)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)')
      })
      .finally(() => {
        setLoading(false)
      })
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
    let residentsCopy = [...residents]
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
  };

  const addResidentHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!userBeingAdded.name) {
      setErrorAddResidentMessage('Nome não pode estar vazio.')
      return false
    }
    if (userBeingAdded.name.length < Constants.MIN_NAME_SIZE) {
      setErrorAddResidentMessage(`Nome deve ter no mínimo ${Constants.MIN_NAME_SIZE} caracteres.`)
      return false
    }
    // if(!userBeingAdded.email){
    //   setErrorAddResidentMessage('Email não pode estar vazio.')
    //   return false
    // }
    if (!!userBeingAdded.email && !Utils.validateEmail(userBeingAdded.email)) {
      setErrorAddResidentMessage('Email não é válido.')
      return false
    }
    if (!!userBeingAdded.phone && !Utils.phone_validation(userBeingAdded.phone)) {
      setErrorAddResidentMessage('Telefone não válido.')
      return false
    }
    if ((!!dobBeingAdded.day || !!dobBeingAdded.year) && !Utils.isValidDate(dobBeingAdded.day, dobBeingAdded.month, dobBeingAdded.year)) {
      setErrorAddResidentMessage('Data não válida.')
      return false
    }
    const dob = user.condo.resident_has_dob && !!dobBeingAdded.day && !!dobBeingAdded.year ? new Date(dobBeingAdded.year, dobBeingAdded.month - 1, dobBeingAdded.day, 0, 0, 0) : null
    if ((!!dobBeingAdded.day || !!dobBeingAdded.year) && dob > new Date()) {
      return setErrorAddResidentMessage('Data não é válida.')
    }
    setResidents(prev => [...prev, { ...userBeingAdded, dob }])
    setErrorAddResidentMessage('')
    setUserBeingAdded({ id: "0", name: '', identification: '', email: '', pic: '', phone: '', dob: null })
    setDobBeingAdded({ day: '', month: '', year: '' })
    return true
  }

  const cancelAddResidentHandler = _ => {
    setUserBeingAdded({ id: '0', name: '', identification: '', email: '', pic: '', phone: '', dob: null })
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
    setVehicleBeingAdded({ id: '0', maker: '', model: '', color: '', plate: '' })
    return true
  }

  const cancelVehicleHandler = _ => {
    setVehicleBeingAdded({ id: '0', maker: '', model: '', color: '', plate: '' })
    setErrorAddVehicleMessage('')
  }

  const photoClickHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    props.navigation.navigate('CameraPic', {
      userBeingAdded,
      selectedBloco,
      selectedUnit,
      vehicles,
      residents,
      user: props.route.params.user,
      screen
    })
  }

  const selectBlocoHandler = bloco => {
    setSelectedBloco(bloco)
    setModalSelectBloco(false)
    setModalSelectUnit(true)
  }

  const selectUnitHandler = async unit => {
    setSelectedUnit(unit)
    setModalSelectUnit(false)
    setLoading(true)
    if (await Utils.handleNoConnection(setLoading)) return
    api.get(`api/user/unit/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
      .then(res => {
        const fetchedResidents = res.data.map(el => { return { ...el, dob: el.dob ? new Date(el.dob) : null } })
        setResidents(fetchedResidents)
        api.get(`api/vehicle/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
          .then(res2 => {
            setVehicles(res2.data)
          })
          .catch(err2 => {
            Utils.toastTimeoutOrErrorMessage(err, err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA2)')
            setSelectedUnit(null)
            setSelectedBloco(null)
          })
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA3)')
        setSelectedUnit(null)
        setSelectedBloco(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const clearUnit = _ => {
    setSelectedBloco(null)
    setSelectedUnit(null)
  }

  const cancelHandler = _ => {
    clearUnit()
    setResidents([])
    setVehicles([])
  }

  const uploadImgs = newResidents => {
    const residentsPics = []
    newResidents.forEach(nr => {
      residents.forEach(re => {
        if ((nr.email === re.email || (!nr.email && !re.email)) &&
          nr.name === re.name &&
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

  //saving...
  const confirmHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    setLoading(true)
    api.post('api/user/resident/unit', {
      unit_id: selectedUnit.id,
      residents,
      condo_id: props.route.params.user.condo_id,
      user_id_last_modify: props.route.params.user.id
    })
      .then(res => {
        uploadImgs(res.data.addedResidents)
        Utils.toast(res.data.message)
        setSelectedUnit(null)
        setModalSelectBloco(null)
      })
      .then(_ => {
        api.post('api/vehicle/unit', {
          unit_id: selectedUnit.id,
          vehicles,
        })
          .catch(err2 => {
            Utils.toastTimeoutOrErrorMessage(err, err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA4)')
          })
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA5)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={{ flex: 1, padding: 10, }} keyboardShouldPersistTaps="handled">
        <SelectBlocoGroup
          pressed={() => setModalSelectBloco(true)}
          selectedBloco={selectedBloco}
          selectedUnit={selectedUnit}
          clearUnit={clearUnit}
        />
        {!!selectedUnit &&
          <View>
            <AddResidentsGroup
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
              buttonText='Incluir morador'
              dobBeingAdded={dobBeingAdded}
              setDobBeingAdded={setDobBeingAdded}
            />
            <AddCarsGroup
              data={vehicles}
              vehicleBeingAdded={vehicleBeingAdded}
              setVehicleBeingAdded={setVehicleBeingAdded}
              errorAddVehicleMessage={errorAddVehicleMessage}
              addVehicleHandler={addVehicleHandler}
              cancelVehicleHandler={cancelVehicleHandler}
              removeVehicle={removeVehicle}
              addingVehicle={addingVehicle}
              setAddingVehicle={setAddingVehicle}
            />
            {
              !addingUser && !addingVehicle &&
              <FooterButtons
                backgroundColor={Constants.backgroundColors['Residents']}
                title1="Confirmar"
                title2="Cancelar"
                buttonPadding={15}
                fontSize={17}
                action1={confirmHandler}
                action2={props.navigation.goBack}
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
      />
      <ModalSelectUnit
        bloco={selectedBloco}
        modalVisible={modalSelectUnit}
        setModalVisible={setModalSelectUnit}
        selectUnitHandler={selectUnitHandler}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['Residents'],
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

export default ResidentAdd