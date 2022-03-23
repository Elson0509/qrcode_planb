import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text,
  } from 'react-native';
import InputBox from '../../components/InputBox';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import FooterButtons from '../../components/FooterButtons';

const CondoEdit = props => {
  const [loading, setLoading] = useState(false)
  const [condoBeingAdded, setCondoBeingAdded] = useState(props.route?.params?.condoBeingAdded || {id: "0", name: '', address: '', city: '', state: '', slots: ''})
  const [errorMessage, setErrorMessage] = useState('')

  const addHandler = _ => {
    if(!condoBeingAdded.name){
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if(!condoBeingAdded.address){
      return setErrorMessage('Endereço não pode estar vazio.')
    }
    if(!condoBeingAdded.city){
      return setErrorMessage('Cidade não pode estar vazio.')
    }
    if(!condoBeingAdded.state){
      return setErrorMessage('Estado não pode estar vazio.')
    }
    if(isNaN(condoBeingAdded.slots) || !condoBeingAdded.slots || Number(condoBeingAdded.slots) < 0){
      return setErrorMessage('Quantidade de vagas inválida.')
    }
    setLoading(true)
    api.put(`api/condo/${condoBeingAdded.id}`, {
      name: condoBeingAdded.name,
      address: condoBeingAdded.address,
      city: condoBeingAdded.city,
      state: condoBeingAdded.state,
    })
    .then((res)=>{
      setErrorMessage('')
      Utils.toast('Cadastro realizado')
      props.navigation.goBack()
    })
    .catch((err)=> {
      Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA1)')
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  if(loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white"/>
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <InputBox 
          text="Nome*:" 
          value={condoBeingAdded.name} 
          changed={value=>setCondoBeingAdded({...condoBeingAdded, name:value})}
          autoCapitalize='words'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox 
          text="Endereço*:" 
          value={condoBeingAdded.address} 
          changed={value=>setCondoBeingAdded({...condoBeingAdded, address:value})}
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox 
          text="Cidade*:" 
          value={condoBeingAdded.city} 
          changed={value=>setCondoBeingAdded({...condoBeingAdded, city:value})}
          autoCapitalize='words'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox 
          text="Estado*:" 
          value={condoBeingAdded.state} 
          changed={value=>setCondoBeingAdded({...condoBeingAdded, state:value})}
          autoCapitalize='characters'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox 
          text="Vagas de estacionamento*:" 
          keyboard='numeric'
          value={condoBeingAdded.slots} 
          changed={value=>setCondoBeingAdded({...condoBeingAdded, slots:value})}
          autoCapitalize='characters'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <FooterButtons
          title1="Atualizar"
          title2="Cancelar"
          buttonPadding={15}
          backgroundColor={Constants.backgroundColors['Residents']}
          action1={addHandler}
          action2={props.navigation.goBack}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body:{
    padding:10,
    backgroundColor: Constants.backgroundColors['Residents'],
    minHeight:'100%'
  },
  errorMessage:{
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
  buttonAddPhotoGroup:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title:{
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
  buttonAddphotoIsClicked:{
    borderRadius: 8,
    backgroundColor: Constants.backgroundLightColors['Residents'],
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
});

export default CondoEdit