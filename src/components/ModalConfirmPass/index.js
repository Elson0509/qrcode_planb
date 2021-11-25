import React, {useState} from 'react';
import { StyleSheet, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import api from '../../services/api';
import ModalGeneric from '../ModalGeneric';
import InputBox from '../InputBox'
import {MIN_PASSWORD_SIZE} from '../../services/constants'

const ModalConfirmPass = props => {
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const confirmHandler = _ => {
    if(password.length < MIN_PASSWORD_SIZE){
        return setErrorMessage(`Senha muito curta. Pelo menos ${MIN_PASSWORD_SIZE} caracteres.`)
    }
    setErrorMessage('')
    setLoading(true)
    api.post(`api/user/confirmpass`,{password})
    .then(res=>{
        setLoading(false)
        setErrorMessage('')
        props.action()
    })
    .catch((err)=>{
        setLoading(false)
        setErrorMessage(err.response?.data?.message || 'Senha inválida.')
    })
  }
  
  return (
    <ModalGeneric
      modalVisible={props.modal}
      setModalVisible={props.setModal}
      btn1Text='Enviar'
      btn2Text='Cancelar'
      btn1Pressed={confirmHandler}
    >
      {
        loading &&
          <ActivityIndicator size="large" color="blue"/>
          ||
        <InputBox
          text='Confirme sua senha:'
          value={password}
          changed={setPassword}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
          width={250}
        />
      }
      {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  errorMessage:{
      color: '#F77',
      backgroundColor: 'white',
      marginTop: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 12,
      borderWidth: 1,
      borderColor: '#F77',
      padding: 2,
  },  
})

export default ModalConfirmPass;