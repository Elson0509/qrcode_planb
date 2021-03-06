import React, {useState, useEffect} from 'react';
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
import ModalMessage from '../../components/ModalMessage';
import AddResidentsGroup from '../../components/AddResidentsGroup';
import AddCarsGroup from '../../components/AddCarsGroup';
import SelectBlocoGroup from '../../components/SelectBlocoGroup';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import FooterButtons from '../../components/FooterButtons';
import api from '../../services/api';

const ResidentAdd = props => {
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
    const [residents, setResidents] = useState(props.route?.params?.residents || [])
    const [vehicles, setVehicles] = useState(props.route?.params?.vehicles || [])
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({id: "0", maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState(props.route?.params?.userBeingAdded || {id: "0", name: '', identification: '', email: '', pic: ''})
    const [screen, setScreen]= useState(props.route?.params?.screen || 'ResidentAdd')
    const [addingUser, setAddingUser] = useState(false)
    const [addingVehicle, setAddingVehicle] = useState(false)

    //fetching blocos
    useEffect(()=>{
      api.get(`api/condo/all/${props.route.params.user.condo_id}`)
        .then(res=>{
          setBlocos(res.data)
        })
        .catch(err=>{
          Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)')
        })
        .finally(()=>{
          setLoading(false)
        })
    },[])

    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Desculpe, mas precisamos de permiss??o da c??mera. Verifique as configura????es.');
          }
        }
      })();
    }, []);

    const removeResident = async index => {
      if(await Utils.handleNoConnection(setLoading)) return
      let residentsCopy = [...residents]
      residentsCopy.splice(index, 1)
      setResidents(residentsCopy)
    }

    const removeVehicle = async index => {
      if(await Utils.handleNoConnection(setLoading)) return
      const vehiclesCopy = [...vehicles]
      vehiclesCopy.splice(index, 1)
      setVehicles(vehiclesCopy)
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync(Constants.ImagePickerOptions);
      const compressed = await Utils.compressImage(result.uri)
      if (!result.cancelled) {
        setUserBeingAdded(prev=> {return {...prev, pic:compressed.uri}})
      }
    };

    const addResidentHandler = async _ =>{
      if(await Utils.handleNoConnection(setLoading)) return
      if(!userBeingAdded.name){
        setErrorAddResidentMessage('Nome n??o pode estar vazio.')
        return false
      }
      if(userBeingAdded.name.length < Constants.MIN_NAME_SIZE){
        setErrorAddResidentMessage(`Nome deve ter no m??nimo ${Constants.MIN_NAME_SIZE} caracteres.`)
        return false
      }
      // if(!userBeingAdded.email){
      //   setErrorAddResidentMessage('Email n??o pode estar vazio.')
      //   return false
      // }
      if(userBeingAdded.email && !Utils.validateEmail(userBeingAdded.email)){
        setErrorAddResidentMessage('Email n??o ?? v??lido.')
        return false
      }
      setResidents(prev=> [...prev, userBeingAdded])
      setErrorAddResidentMessage('')
      setUserBeingAdded({id: "0", name: '', identification: '', email: '', pic: ''})
      return true
    }

    const cancelAddResidentHandler = _ => {
      setUserBeingAdded({id: '0', name: '', identification: '', email: '', pic: ''})
      setErrorAddResidentMessage('')
    }

    const addVehicleHandler = async _ =>{
      if(await Utils.handleNoConnection(setLoading)) return
      if(!vehicleBeingAdded.maker){
        setErrorAddVehicleMessage('Fabricante n??o pode estar vazio.')
        return false
      }
      if(!vehicleBeingAdded.model){
        setErrorAddVehicleMessage('Modelo n??o pode estar vazio.')
        return false
      }
      if(!vehicleBeingAdded.color){
        setErrorAddVehicleMessage('Cor n??o pode estar vazia.')
        return false
      }
      if(!vehicleBeingAdded.plate){
        setErrorAddVehicleMessage('Placa n??o pode estar vazia.')
        return false
      }
      if(!Utils.validatePlateFormat(vehicleBeingAdded.plate)){
        setErrorAddVehicleMessage('Formato de placa inv??lido.')
        return false
      }
      setVehicles(prev=> [...prev, vehicleBeingAdded])
      setErrorAddVehicleMessage('')
      setVehicleBeingAdded({id: '0', maker:'', model:'', color:'', plate:''})
      return true
    }

    const cancelVehicleHandler = _ => {
      setVehicleBeingAdded({id: '0', maker:'', model:'', color:'', plate:''})
      setErrorAddVehicleMessage('')
    }

    const photoClickHandler = async _ => {
      if(await Utils.handleNoConnection(setLoading)) return
      props.navigation.navigate('CameraPic', {
        userBeingAdded, 
        selectedBloco, 
        selectedUnit, 
        vehicles, 
        residents, 
        user:props.route.params.user,
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
      if(await Utils.handleNoConnection(setLoading)) return
      api.get(`api/user/unit/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
        .then(res=>{
          setResidents(res.data)
          api.get(`api/vehicle/${unit.id}/${Constants.USER_KIND.RESIDENT}`)
            .then(res2=>{
              setVehicles(res2.data)
            })
            .catch(err2=>{
              Utils.toastTimeoutOrErrorMessage(err, err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA2)')
              setSelectedUnit(null)
              setSelectedBloco(null)
            })
        })
        .catch(err=>{
          Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA3)')
          setSelectedUnit(null)
          setSelectedBloco(null)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const clearUnit = _ =>{
      setSelectedBloco(null)
      setSelectedUnit(null)
    }

    const cancelHandler = _ =>{
      clearUnit()
      setResidents([])
      setVehicles([])
    }

    const uploadImgs = newResidents =>{
      const residentsPics = []
      newResidents.forEach(nr => {
        residents.forEach(re => {
          if ((nr.email === re.email || (!nr.email && !re.email)) &&
              nr.name === re.name && 
              nr.identification === re.identification &&
              re.pic != "")
              residentsPics.push({id:nr.id, pic: re.pic})
        })
      })
      residentsPics.forEach(el=>{
        const formData = new FormData()
        formData.append('img', {
          uri: el.pic,
          type: 'image/jpg',
          name:el.id+'.jpg'
        })
        api.post(`api/user/image/${el.id}`, formData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        })
        .then(res=>{
          console.log('success', res.data)
        })
        .catch(err=>{
          console.log('error', err.response)
        })
      })
    }

    //saving...
    const confirmHandler = async _ =>{
      setLoading(true)
      if(await Utils.handleNoConnection(setLoading)) return
      api.post('api/vehicle/unit', {
        unit_id: selectedUnit.id,
        vehicles,
        user_id_last_modify: props.route.params.user.id
      })
      .then((res)=>{
        api.post('api/user/resident/unit', {
          unit_id: selectedUnit.id,
          residents, 
          condo_id: props.route.params.user.condo_id, 
          user_id_last_modify: props.route.params.user.id
        })
          .then(res2=>{
            uploadImgs(res2.data.addedResidents)
            Utils.toast(res2.data.message)
            setSelectedUnit(null)
            setModalSelectBloco(null)
          })
          .catch(err2=>{
            Utils.toastTimeoutOrErrorMessage(err, err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA4)')
          })
        })
        .catch((err)=>{
          Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA5)')
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return(
      <SafeAreaView style={styles.body}>
        <ScrollView style={{flex: 1, padding:10,}} keyboardShouldPersistTaps="handled">
          <SelectBlocoGroup 
            pressed={()=>setModalSelectBloco(true)}
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
          title="Aten????o"
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
    body:{
      backgroundColor: Constants.backgroundColors['Residents'],
      flex: 1
    },
    fontTitle:{
      textAlign:'center',
      color:'white',
      fontSize:16,
      paddingBottom: 5,
      fontFamily:'serif',
      fontWeight:'bold',
      letterSpacing:2,
    },
    box:{
      marginBottom: 20
    },
    borderBottomTitle:{
      borderBottomColor:'white',
      borderBottomWidth: 3,
    },
    marginTop:{
      marginTop:15,
    },
    borderTop:{
      borderTopColor:'white',
      borderTopWidth: 1,
    },
    resultText:{
      paddingTop: 15,
      color:'white',
      textAlign:'center',
    },
    sizeText:{
      fontSize:20
    },
    sizeResult:{
      fontSize:40
    }
  });

export default ResidentAdd