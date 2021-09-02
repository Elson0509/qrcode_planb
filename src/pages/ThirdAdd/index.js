import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    View,
    Text,
  } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import AddCarsGroup from '../../components/AddCarsGroup';
import AddThirdsGroup from '../../components/AddThirdsGroup';
import SelectBlocoGroup from '../../components/SelectBlocoGroup';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import FooterButtons from '../../components/FooterButtons';
import Toast from 'react-native-root-toast';
import api from '../../services/api';

const ThirdAdd = props => {
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
    const [vehicleBeingAdded, setVehicleBeingAdded] = useState({id:"0", maker:'', model:'', color:'', plate:''})
    const [userBeingAdded, setUserBeingAdded]= useState(props.route?.params?.userBeingAdded || {id: "0", name: '', identification: '', pic: '', empresa: ''})
    const [dateInit, setDateInit] = useState({day: new Date().getDate(), month: new Date().getMonth()+1, year: new Date().getFullYear()})
    const [dateEnd, setDateEnd] = useState({day: '', month: '', year: ''})
    const [selectedDateInit, setSelectedDateInit] = useState(props.route?.params?.setSelectedDateInit || null)
    const [selectedDateEnd, setSelectedDateEnd] = useState(props.route?.params?.setSelectedDateEnd || null)
    const [screen, setScreen]= useState(props.route?.params?.screen || 'ThirdAdd')

    //fetching blocos
    useEffect(()=>{
      api.get(`api/condo/${props.route.params.user.condo_id}`)
        .then(res=>{
          setBlocos(res.data)
        })
        .catch(err=>{
          Toast.show(err.response.data.message, Constants.configToast)
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

      const newVisitor = {
        ...userBeingAdded,
        id: "0",
        initial_date: dateInicial,
        final_date: dateFinal
      }
      setResidents(prev=> [...prev, newVisitor])
      setErrorAddResidentMessage('')
      setUserBeingAdded({id: "0", name: '', identification: '', pic: '', empresa: ''})
      return true
    }

    const cancelAddResidentHandler = _ => {
      setUserBeingAdded({id: "0", name: '', identification: '', email: '', pic: '', empresa: ''})
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
      setVehicleBeingAdded({id:"0", maker:'', model:'', color:'', plate:''})
      return true
    }

    const cancelVehicleHandler = _ => {
      setVehicleBeingAdded({id:"0", maker:'', model:'', color:'', plate:''})
    }

    const photoClickHandler = _ => {
      props.navigation.navigate('CameraPic', {userBeingAdded, selectedBloco, selectedUnit, vehicles, selectedDateInit, selectedDateEnd, screen:'ThirdAdd'})
    }

    const selectBlocoHandler = bloco => {
      setSelectedBloco(bloco)
      setModalSelectBloco(false)
      setModalSelectUnit(true)
    }

    const selectUnitHandler = unit => {
      setSelectedUnit(unit)
      setModalSelectUnit(false)
      setLoading(true)
      setDateEnd({day: '', month: '', year: ''})

      let unitFound
      //search for unit of kind Visitor
      api.get(`api/unit/${selectedBloco.id}/${unit.number}/${Constants.USER_KIND.THIRD}`)
        .then(res=>{
          if(res.data){
            unitFound=res.data
          }
          else{
            unitFound=unit
          }
          api.get(`api/user/unit/${unitFound.id}/${Constants.USER_KIND.THIRD}`)
            .then(res=>{
              const users = res.data
              const usersAdjustedDate = users.map(el=> {return {...el, final_date: new Date(el.final_date), initial_date: new Date(el.initial_date)}})
              
              setResidents(usersAdjustedDate)
              api.get(`api/vehicle/${unitFound.id}/${Constants.USER_KIND.THIRD}`)
                .then(res2=>{
                  setVehicles(res2.data)
                })
                .catch(err2=>{
                  Toast.show(err2.response.data.message, Constants.configToast)
                  setSelectedUnit(null)
                  setSelectedBloco(null)
                })
            })
            .catch(err=>{
              Toast.show(err.response.data.message, Constants.configToast)
              setSelectedUnit(null)
              setSelectedBloco(null)
            })
        })
        .catch(err=>{
          Toast.show(err.response.data.message, Constants.configToast)
          return
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

    //saving...
    const confirmHandler = _ =>{
      setLoading(true)
      //storing unit for kind Visitor
      api.post(`api/unit`,{
        number: selectedUnit.number,
        bloco_id: selectedBloco.id,
        bloco_name: selectedBloco.name,
        unit_kind_id: Constants.USER_KIND.THIRD,
        user_id_last_modify: props.route.params.user.id,
        condo_id: props.route.params.user.condo_id
      })
      .then(res=>{
        //in case of unit kind Third already stored
        storeVehiclesAndVisitors(res.data.unit.id)
      })
      .catch(err=>{
        //in case of unit kind Third not already stored
        if(err.response.data.unit){
          storeVehiclesAndVisitors(err.response.data.unit.id)
        }
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const storeVehiclesAndVisitors = unit_id => {
      console.log(1, {
        unit_id,
        vehicles,
        user_id_last_modify: props.route.params.user.id
      })
      api.post('api/vehicle/unit', {
        unit_id,
        vehicles,
        user_id_last_modify: props.route.params.user.id
      })
      .then((res)=>{
        console.log(2, {
          unit_id,
          residents, 
          condo_id: props.route.params.user.condo_id, 
          user_kind_id: Constants.USER_KIND.THIRD,
          user_id_last_modify: props.route.params.user.id
        })
        api.post('api/user/person/unit', {
          unit_id,
          residents, 
          condo_id: props.route.params.user.condo_id, 
          user_kind_id: Constants.USER_KIND.THIRD,
          user_id_last_modify: props.route.params.user.id
        })
          .then(res2=>{
            uploadImgs(res2.data.addedResidents)
            Toast.show(res2.data.message, Constants.configToast)
            setSelectedUnit(null)
            setModalSelectBloco(null)
          })
          .catch(err2=>{
            Toast.show(err2.response.data.message, Constants.configToast)
          })
        })
        .catch((err)=>{
          Toast.show(err.response.data.message, Constants.configToast)
        })
    }

    const backgroundColorBoxes = '#FF6666'
    const backgroundColorButtonBoxes = '#FFA0A0'

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
                dateInit={dateInit}
                dateEnd={dateEnd}
                setDateInit={setDateInit}
                setDateEnd={setDateEnd}
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
              />
              <FooterButtons
                backgroundColor={Constants.backgroundColors['Thirds']}
                title1="Confirmar"
                title2="Cancelar"
                errorMessage={errorDatesMessage}
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
          backgroundItem={backgroundColorButtonBoxes}
        />
        <ModalSelectUnit
          bloco={selectedBloco}
          modalVisible={modalSelectUnit}
          setModalVisible={setModalSelectUnit}
          selectUnitHandler={selectUnitHandler}
          backgroundItem={backgroundColorButtonBoxes}
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

export default ThirdAdd