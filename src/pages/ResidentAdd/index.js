import React, {useState, Fragment, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
  } from 'react-native';
  import InputBox from '../../components/InputBox';
  import DateInputBox from '../../components/DateInputBox';
  import * as Constants from '../../services/constants'
  import * as Utils from '../../services/util'
  import FooterButtons from '../../components/FooterButtons';
  import ModalMessage from '../../components/ModalMessage';

const ResidentAdd = props => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [complement, setComplement] = useState('')
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [makerVehicle, setMakerVehicle] = useState('')
    const [modelVehicle, setModelVehicle] = useState('')
    const [colorVehicle, setColorVehicle] = useState('')
    const [plateVehicle, setPlateVehicle] = useState('')
    const [modal, setModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    
    const plateSizeValidator = value => {
      if(value.length <= 7){
        setPlateVehicle(value.toUpperCase())
      }
    }

    const addHandler = _ => {
      const errors = []
      let birthDate
      if(!name){
        errors.push('Nome não pode estar vazio.')
      }
      if(!Utils.validateEmail(email)){
        errors.push('Email não válido.')
      }
      if(!Utils.isValidDate(day, month, year)){
        errors.push('Esta data não é válida.')
      }
      else{
        birthDate = new Date(year, month-1, day)
        if(birthDate>new Date())
          errors.push('Esta data não é válida.')
      }
      if(errors.length){
        setErrorMessage(errors.join('\n'))
        setModal(true)
      }
      else{
        console.log('Salvando informações...')
      }
    }

    return (
        <SafeAreaView>
          <ScrollView style={styles.body}>
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
              text="Complemento:" 
              value={complement} 
              changed={value=>setComplement(value)}
              placeholder='Bloco, Apt...'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
            <DateInputBox 
              text="Data de Nascimento:" 
              value1={day} 
              value2={month} 
              value3={year} 
              changed1={value=>setDay(value)}
              changed2={value=>setMonth(value)}
              changed3={value=>setYear(value)}
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