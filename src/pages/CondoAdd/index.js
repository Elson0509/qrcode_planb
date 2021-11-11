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
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import FooterButtons from '../../components/FooterButtons';

const CondoAdd = props => {
  const [loading, setLoading] = useState(false)
  const [condoBeingAdded, setCondoBeingAdded] = useState(props.route?.params?.condoBeingAdded || {id: "0", name: '', address: '', city: '', state: ''})
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
    setLoading(true)
    api.post('api/condo', {
      name: condoBeingAdded.name,
      address: condoBeingAdded.address,
      city: condoBeingAdded.city,
      state: condoBeingAdded.state,
    })
    .then((res)=>{
      setErrorMessage('')
      Toast.show('Cadastro realizado', Constants.configToast)
      setCondoBeingAdded({id: "0", name: '', address: '', city: '', state: ''})
    })
    .catch((err)=> {
      Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA1)', Constants.configToast)
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
        {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <FooterButtons
          title1="Adicionar"
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

export default CondoAdd