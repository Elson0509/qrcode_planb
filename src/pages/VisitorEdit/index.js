import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    ActivityIndicator,
  } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import AddVisitorsGroup from '../../components/AddVisitorsGroup';
import AddCarsGroup from '../../components/AddCarsGroup';
import SelectBlocoGroup from '../../components/SelectBlocoGroup';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import FooterButtons from '../../components/FooterButtons';
import SelectDatesVisitorsGroup from '../../components/SelectDatesVisitorsGroup';
import Toast from 'react-native-root-toast';
import api from '../../services/api';

const VisitorEdit = props => {
    const currentDate = new Date()

    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [blocos, setBlocos] = useState([])
    const [modalSelectBloco, setModalSelectBloco] = useState(false)
    const [modalSelectUnit, setModalSelectUnit] = useState(false)
    const [selectedBloco, setSelectedBloco] = useState(props.route?.params?.selectedBloco || null)
    const [selectedUnit, setSelectedUnit] = useState(props.route?.params?.selectedUnit || null)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorAddResidentMessage, setErrorAddResidentMessage] = useState('')
    const [errorSetDateMessage, setErrorSetDateMessage] = useState('')
    const [errorAddVehicleMessage, setErrorAddVehicleMessage] = useState('')
    const [residents, setResidents] = useState(props.route?.params?.residents?.map(el=>{return {...el, initial_date: new Date(el.initial_date), final_date: new Date(el.final_date)}}) || [])
    const [vehicles, setVehicles] = useState(props.route?.params?.vehicles || [])
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({id:'0', maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState(props.route?.params?.userBeingAdded || {id:'0', name: '', identification: '', pic: ''})
    const [dateInit, setDateInit] = useState({day: new Date(props.route.params.residents[0].initial_date).getDate(), month: new Date(props.route.params.residents[0].initial_date).getMonth()+1, year: new Date(props.route.params.residents[0].initial_date).getFullYear()})
    const [dateEnd, setDateEnd] = useState({day: new Date(props.route.params.residents[0].final_date).getDate(), month: new Date(props.route.params.residents[0].final_date).getMonth()+1, year: new Date(props.route.params.residents[0].final_date).getFullYear()})
    const [selectedDateInit, setSelectedDateInit] = useState(new Date(props.route.params.residents[0].initial_date))
    const [selectedDateEnd, setSelectedDateEnd] = useState(new Date(props.route.params.residents[0].final_date))
    const [screen, setScreen]= useState(props.route?.params?.screen || 'VisitorEdit')

    //fetching blocos
    useEffect(()=>{
      api.get(`api/condo/${props.route.params.user.condo_id}`)
        .then(res=>{
          setBlocos(res.data)
        })
        .catch(err=>{
          Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VE1)', Constants.configToast)
        })
        .finally(()=>{
          setLoading(false)
        })
      setLoading(false)
    },[])

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

    const removeResident = index => {
      const residentsCopy = [...residents]
      residentsCopy.splice(index, 1)
      setResidents(residentsCopy)
    }

    const removeVehicle = index => {
      const vehiclesCopy = [...vehicles]
      vehiclesCopy.splice(index, 1)
      setVehicles(vehiclesCopy)
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      const compressed = await Utils.compressImage(result.uri)
      if (!result.cancelled) {
        setUserBeingAdded(prev=> {return {...prev, pic:compressed.uri}})
      }
    };

    const addResidentHandler = _ =>{
      if(!userBeingAdded.name){
        setErrorAddResidentMessage('Nome não pode estar vazio.')
        return false
      }
      setResidents(prev=> [...prev, userBeingAdded])
      setErrorAddResidentMessage('')
      setUserBeingAdded({id: "0", name: '', identification: '', pic: ''})
      return true
    }

    const selectDatesHandler = _ =>{
      if(!Utils.isValidDate(dateInit.day, dateInit.month, dateInit.year) ){
        setErrorSetDateMessage('Data inicial não é válida.')
        return false
      }
      if(!Utils.isValidDate(dateEnd.day, dateEnd.month, dateEnd.year) ){
        setErrorSetDateMessage('Data final não é válida.')
        return false
      }
      const dateInicial = new Date(dateInit.year, dateInit.month-1, dateInit.day)
      const dateFinal = new Date(dateEnd.year, dateEnd.month-1, dateEnd.day)
      if(dateFinal<dateInicial){
        setErrorSetDateMessage('Data final precisa ser após a data inicial')
        return false
      }
      setSelectedDateInit(dateInicial)
      setSelectedDateEnd(dateFinal)
      return true
    }

    const cancelDatesHandler = _ =>{
      setSelectedDateInit('')
      setSelectedDateEnd('')
    }

    const cancelAddResidentHandler = _ => {
      setUserBeingAdded({id:'0', name: '', identification: '', email: '', pic: ''})
    }

    const addVehicleHandler = _ =>{
      if(!vehicleBeingAdded.maker){
        setErrorAddVehicleMessage('Fabricante não pode estar vazio.')
        return false
      }
      if(!vehicleBeingAdded.model){
        setErrorAddVehicleMessage('Modelo não pode estar vazio.')
        return false
      }
      if(!vehicleBeingAdded.color){
        setErrorAddVehicleMessage('Cor não pode estar vazia.')
        return false
      }
      if(!vehicleBeingAdded.plate){
        setErrorAddVehicleMessage('Placa não pode estar vazia.')
        return false
      }
      if(!Utils.validatePlateFormat(vehicleBeingAdded.plate)){
        setErrorAddVehicleMessage('Formato de placa inválido.')
        return false
      }
      setVehicles(prev=> [...prev, vehicleBeingAdded])
      setErrorAddVehicleMessage('')
      setVehicleBeingAdded({id: '0', maker:'', model:'', color:'', plate:''})
      return true
    }

    const cancelVehicleHandler = _ => {
      setVehicleBeingAdded({id:'0', maker:'', model:'', color:'', plate:''})
    }

    const photoClickHandler = _ => {
      props.navigation.navigate('CameraPic', {
        userBeingAdded, 
        selectedBloco, 
        selectedUnit, 
        vehicles, 
        residents: JSON.stringify(residents), 
        user:props.route.params.user,
        screen
      })
    }

    const selectBlocoHandler = bloco => {
      setSelectedBloco(bloco)
      setModalSelectBloco(false)
      setModalSelectUnit(true)
    }

    const selectUnitHandler = unit => {
      setSelectedUnit(unit)
      setModalSelectUnit(false)
      setDateEnd({day: '', month: '', year: ''})
    }

    const clearUnit = _ =>{
      setSelectedBloco(null)
      setSelectedUnit(null)
    }

    const cancelHandler = _ =>{
      clearUnit()
      setResidents([])
      setVehicles([])
      props.navigation.goBack()
    }

    //saving...
    const confirmHandler = _ =>{
      //checking if there is date selected and at least one visitor
      if(!selectedDateInit || !selectedDateEnd){
        return setErrorMessage('É preciso selecionar um prazo.')
      }
      if(!residents.length)
        return setErrorMessage('É preciso adicionar visitantes.')
      setErrorMessage('')
      setLoading(true)
      //storing unit for kind Visitor
      api.put('api/user/person', {
        residents,
        unit_id: selectedUnit.id,
        selectedDateInit,
        selectedDateEnd,
        unit_kind_id: Constants.USER_KIND.VISITOR,
        user_id_last_modify: props.route.params.user.id,
        condo_id: props.route.params.user.condo_id,
      })
      .then(res=>{
        uploadImgs(res.data.addedResidents)
        //updating vehicles
        api.post('api/vehicle/unit', {
          unit_id: selectedUnit.id,
          vehicles,
          user_id_last_modify: props.route.params.user.id,
        })
        .then(res2=>{
          Toast.show(res2.data.message, Constants.configToast)
        })
        .catch(err2=>{
          Toast.show(err2.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VE2)', Constants.configToast)
        })
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VE3)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
        props.navigation.navigate('VisitorList')
      })
    }

    const uploadImgs = newResidents =>{
      const residentsPics = []
      newResidents.forEach(nr => {
        residents.forEach(re => {
          if( nr.name === re.name && 
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

    const backgroundColorBoxes = '#8381EC'
    const backgroundColorButtonBoxes = '#B6BFD8'

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return(
      <SafeAreaView style={styles.body}>
        <ScrollView style={{flex: 1, padding:10,}} keyboardShouldPersistTaps="handled">
          <SelectBlocoGroup 
            backgroundColor={backgroundColorBoxes}
            backgroundColorButtons={backgroundColorButtonBoxes}
            pressed={()=>setModalSelectBloco(true)}
            selectedBloco={selectedBloco}
            selectedUnit={selectedUnit}
            clearUnit={clearUnit}
          />
          {!!selectedUnit &&
            <View>
              <AddVisitorsGroup 
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
              />
              <SelectDatesVisitorsGroup
                selectedDateInit={Utils.printDate(selectedDateInit)}
                selectedDateEnd={Utils.printDate(selectedDateEnd)}
                selectDatesHandler={selectDatesHandler}
                cancelDatesHandler={cancelDatesHandler}
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
                dateInit={dateInit}
                setDateInit={setDateInit}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                errorMessage={errorSetDateMessage}
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
                backgroundLightColor={Constants.backgroundLightColors['Visitors']}
                backgroundDarkColor={Constants.backgroundDarkColors['Visitors']}
              />
              <FooterButtons
                backgroundColor={Constants.backgroundColors['Visitors']}
                title1="Confirmar"
                title2="Cancelar"
                errorMessage={errorMessage}
                buttonPadding={15}
                fontSize={17}
                action1={confirmHandler}
                action2={cancelHandler}
              />
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
          backgroundItem={'#EDE5FF'}
        />
        <ModalSelectUnit
          bloco={selectedBloco}
          modalVisible={modalSelectUnit}
          setModalVisible={setModalSelectUnit}
          selectUnitHandler={selectUnitHandler}
          backgroundItem={'#EDE5FF'}
        />
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body:{
      backgroundColor: Constants.backgroundColors['Visitors'],
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

export default VisitorEdit