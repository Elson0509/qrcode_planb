import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
  } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import AddThirdsGroup from '../../components/AddThirdsGroup';
import AddCarsGroup from '../../components/AddCarsGroup';
import SelectBlocoGroup from '../../components/SelectBlocoGroup';
import SelectDatesVisitorsGroup from '../../components/SelectDatesVisitorsGroup';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import FooterButtons from '../../components/FooterButtons';
import dummyBlocos from '../../../dummyDataBlocos.json'
import dummyEditUsers from '../../../dummyEditUsers.json'

const ThirdEdit = props => {
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
    const [errorDatesMessage, setErrorDatesMessage] = useState('')
    const [residents, setResidents] = useState([])
    const [vehicles, setVehicles] = useState(props.route?.params?.vehicles || [])
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState(props.route?.params?.userBeingAdded || {name: '', identification: '', pic: '', empresa: ''})
    const [dateInit, setDateInit] = useState({day: new Date().getDate(), month: new Date().getMonth()+1, year: new Date().getFullYear()})
    const [dateEnd, setDateEnd] = useState({day: '', month: '', year: ''})
    const [selectedDateInit, setSelectedDateInit] = useState(props.route?.params?.setSelectedDateInit || null)
    const [selectedDateEnd, setSelectedDateEnd] = useState(props.route?.params?.setSelectedDateEnd || null)

    //fetching data from the unit
    useEffect(()=>{
      const data = dummyEditUsers.data
      //console.log('dummyEditUsers', data)
      const unit = {}
      unit.number = props.route.params.id.unidade
      const bloco = {}
      bloco.bloco = props.route.params.id.bloco
      setSelectedUnit(unit)
      setSelectedBloco(bloco)
      console.log('data.residents',data.residents)
      setResidents(data.residents)
      setVehicles(data.veiculos)
      setLoading(false)
    },[])

    
    //fetching blocos
    useEffect(()=>{
      const data = dummyBlocos.data
      setBlocos(data)
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
      if (!result.cancelled) {
        setUserBeingAdded(prev=> {return {...prev, pic:result.uri}})
      }
    };

    const addResidentHandler = _ =>{
      if(!userBeingAdded.name){
        setErrorAddResidentMessage('Nome não pode estar vazio.')
        return false
      }
      // if(!userBeingAdded.email){
      //   setErrorAddResidentMessage('Email não pode estar vazio.')
      //   return false
      // }
      // if(!Utils.validateEmail(userBeingAdded.email)){
      //   setErrorAddResidentMessage('Email não é válido.')
      //   return false
      // }
      setResidents(prev=> [...prev, userBeingAdded])
      setErrorAddResidentMessage('')
      setUserBeingAdded({name: '', identification: '', pic: '', empresa: ''})
      return true
    }

    const cancelAddResidentHandler = _ => {
      setUserBeingAdded({name: '', identification: '', pic: '', empresa: ''})
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
      setVehicleBeingAdded({maker:'', model:'', color:'', plate:''})
      return true
    }

    const cancelVehicleHandler = _ => {
      setVehicleBeingAdded({maker:'', model:'', color:'', plate:''})
    }

    const photoClickHandler = _ => {
      props.navigation.navigate('CameraPic', {userBeingAdded, selectedBloco, selectedUnit, vehicles, selectedDateInit, selectedDateEnd, screen:'ThirdEdit'})
    }

    const selectBlocoHandler = bloco => {
      setSelectedBloco(bloco)
      setModalSelectBloco(false)
      setModalSelectUnit(true)
    }

    const selectUnitHandler = unit => {
      setSelectedUnit(unit)
      setModalSelectUnit(false)
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

    //saving...
    const confirmHandler = _ =>{
      
    }

    const selectDatesHandler = _ => {
      if(!Utils.isValidDate(dateInit.day, dateInit.month, dateInit.year) ){
        setErrorDatesMessage('Data inicial não é válida.')
        return false
      }
      if(!Utils.isValidDate(dateEnd.day, dateEnd.month, dateEnd.year) ){
        setErrorDatesMessage('Data final não é válida.')
        return false
      }
      const dateInicial = new Date(dateInit.year, dateInit.month-1, dateInit.day)
      const dateFinal = new Date(dateEnd.year, dateEnd.month-1, dateEnd.day)
      if(dateFinal<dateInicial){
        setErrorDatesMessage('Data final precisa ser após a data inicial')
        return false
      }
      setSelectedDateInit(dateInicial)
      setSelectedDateEnd(dateFinal)
      return true
    }

    const cancelDatesHandler = _ => {
      setSelectedDateInit(null)
      setSelectedDateEnd(null)
      setDateInit({day: new Date().getDate(), month: new Date().getMonth()+1, year: new Date().getFullYear()})
      setDateEnd({day: '', month: '', year: ''})
    }

    const backgroundColorBoxes = '#FF7070'
    const backgroundColorButtonBoxes = '#DDAAAA'

    return(
      <SafeAreaView style={styles.body}>
        <ScrollView style={{flex: 1, padding:10,}}>
          <View>
            
          </View>
          <SelectBlocoGroup 
            noEdit
            pressed={()=>setModalSelectBloco(true)}
            selectedBloco={selectedBloco}
            selectedUnit={selectedUnit}
            clearUnit={clearUnit}
            backgroundColor={backgroundColorBoxes}
            backgroundColorButtons={backgroundColorButtonBoxes}
          />
          {!!selectedUnit &&
            <View>
              <AddThirdsGroup 
                residents={residents} 
                userBeingAdded={userBeingAdded}
                setUserBeingAdded={setUserBeingAdded}
                photoClickHandler={photoClickHandler}
                pickImage={pickImage}
                errorAddResidentMessage={errorAddResidentMessage}
                addResidentHandler={addResidentHandler}
                cancelAddResidentHandler={cancelAddResidentHandler}
                removeResident={removeResident}
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
              />
              <SelectDatesVisitorsGroup
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
                dateInit={dateInit}
                dateEnd={dateEnd}
                setDateInit={setDateInit}
                setDateEnd={setDateEnd}
                selectedDateInit={Utils.printDate(selectedDateInit)}
                selectedDateEnd={Utils.printDate(selectedDateEnd)}
                selectDatesHandler={selectDatesHandler}
                errorMessage={errorDatesMessage}
                cancelDatesHandler={cancelDatesHandler}
                backgroundColorInput={Constants.backgroundLightColors['Thirds']}
                borderColor={Constants.backgroundDarkColors['Thirds']}
                colorInput={Constants.backgroundDarkColors['Thirds']}
              />
              <AddCarsGroup 
                data={vehicles} 
                vehicleBeingAdded={vehicleBeingAdded}
                setVehicleBeingAdded={setVehicleBeingAdded}
                errorAddVehicleMessage={errorAddVehicleMessage}
                addVehicleHandler={addVehicleHandler}
                cancelVehicleHandler={cancelVehicleHandler}
                removeVehicle={removeVehicle}
                backgroundLightColor={Constants.backgroundLightColors['Thirds']}
                backgroundDarkColor={Constants.backgroundDarkColors['Thirds']}
                backgroundColor={backgroundColorBoxes}
                backgroundColorButtons={backgroundColorButtonBoxes}
              />
              {
                !!selectedUnit && residents.length > 0 &&
                  <FooterButtons
                    backgroundColor={Constants.backgroundColors['Thirds']}
                    title1="Confirmar"
                    title2="Cancelar"
                    buttonPadding={15}
                    fontSize={17}
                    action1={confirmHandler}
                    action2={()=>props.navigation.goBack()}
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
    body:{
      backgroundColor: Constants.backgroundColors['Thirds'],
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

export default ThirdEdit