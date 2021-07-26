import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
  } from 'react-native';
  import InputBox from '../../components/InputBox';
  import * as Constants from '../../services/constants'
  import * as Utils from '../../services/util'
  import FooterButtons from '../../components/FooterButtons';
  import ModalMessage from '../../components/ModalMessage';
  import comp from '../../../dummyDataComp.json'
  import AddResidentsGroup from '../../components/AddResidentsGroup';
  import AddCarsGroup from '../../components/AddCarsGroup';
  import {Picker} from '@react-native-picker/picker'

const ResidentAdd = props => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [complement, setComplement] = useState('')
    const [makerVehicle, setMakerVehicle] = useState('')
    const [modelVehicle, setModelVehicle] = useState('')
    const [colorVehicle, setColorVehicle] = useState('')
    const [plateVehicle, setPlateVehicle] = useState('')
    const [modal, setModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [listCompAddress, setListCompAddress] = useState([])
    const [residents, setResidents] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [compAddress, setCompAddress] = useState('')

    useEffect(()=>{
      let comps = comp.data
      comps.sort((a, b) => {
        return a.toLowerCase(). localeCompare(b. toLowerCase());
      })
      setListCompAddress(comps)
    },[])
    
    const plateSizeValidator = value => {
      if(value.length <= 7){
        setPlateVehicle(value.toUpperCase())
      }
    }

    const addHandler = _ => {
      const errors = []
      if(!name){
        errors.push('Nome não pode estar vazio.')
      }
      if(!Utils.validateEmail(email)){
        errors.push('Email não válido.')
      }
      if(errors.length){
        setErrorMessage(errors.join('\n'))
        setModal(true)
      }
      else{
        console.log('Salvando informações...')
        const newUser = {
          name,
          email, 
          complement,
          makerVehicle,
          modelVehicle,
          colorVehicle,
          plateVehicle,
        }
        console.log(newUser)
      }
    }

    return (
        <SafeAreaView style={styles.body}>
          <ScrollView >
            <Text style={[{color: 'black', fontWeight: 'bold'}]}>Complemento (Bloco, Apt...)</Text>
            <Picker
              style={styles.picker}
              selectedValue={compAddress}
              onValueChange={(itemValue, itemIndex) => {
                setCompAddress(itemValue)
              }}
            >
              <Picker.Item label="Adicionar" value="add"/>
              {listCompAddress.map((el, ind) =><Picker.Item key={ind} label={el} value={el}/>)}
            </Picker>

            <InputBox 
              text="Complemento:" 
              value={complement} 
              changed={value=>setComplement(value)}
              placeholder='Bloco, Apt...'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <AddResidentsGroup data={residents} setData={setResidents}/>
            <AddCarsGroup data={vehicles} setData={setVehicles}/>
            <InputBox 
              text="Nome*:" 
              value={name} 
              changed={value=>setName(value)}
              autoCapitalize="words"
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <InputBox 
              text="Email*:" 
              value={email} 
              autoCapitalize="none"
              changed={value=>setEmail(value)}
              keyboard='email-address'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            
            <InputBox 
              text="Marca do Veículo:" 
              value={makerVehicle} 
              changed={value=>setMakerVehicle(value)}
              placeholder='Toyota, Hyundai, Ford...'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <InputBox 
              text="Modelo do Veículo:" 
              value={modelVehicle} 
              changed={value=>setModelVehicle(value)}
              placeholder='Corolla, HB20, Focus...'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <InputBox 
              text="Cor do Veículo:" 
              value={colorVehicle} 
              changed={value=>setColorVehicle(value)}
              placeholder='Preto, Branco, Prata...'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <InputBox 
              text="Placa do Veículo:" 
              value={plateVehicle} 
              changed={value=>plateSizeValidator(value)}
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <FooterButtons
              title1="Adicionar"
              title2="Cancelar"
              buttonPadding={15}
              backgroundColor={Constants.backgroundColors['Residents']}
              action1={addHandler}
              action2={props.navigation.goBack}
            />
          </ScrollView>
          <ModalMessage
            message={errorMessage}
            title="Atenção"
            modalVisible={modal}
            setModalVisible={setModal}
          />
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Residents'],
      minHeight:'100%'
    },
    picker:{
      //backgroundColor:Constants.backgroundLightColors['Residents'],
      //borderColor:Constants.backgroundDarkColors['Residents'],
      borderColor:'black',
      borderWidth: 2,
      color:Constants.backgroundDarkColors['Residents'],
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