import React, {useState} from 'react';
import { StyleSheet, Text, ActivityIndicator, Pressable, Modal, View } from 'react-native';
import api from '../../services/api';
import InputBox from '../InputBox'
import { validateEmail } from '../../services/util'

const ModalForgetPassword = props => {
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [buttonDisable, setButtonDisable] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [email, setEmail] = useState('')

  const submitHandler = _ => {
    if (!validateEmail(email))
        return setErrorMessage('Email não válido')
    setSpinner(true)
    setErrorMessage('')
    api.post('api/user/forgotpass', {email})
      .then(res => {
          setSpinner(false)
          setButtonDisable(true)
          setSuccessMessage(res.data.message)
      })
      .catch(err => {
          setSpinner(false)
          setErrorMessage(err.response?.data?.message || 'Um erro ocorreu.')
      })
  } 
  
  return (
    <Modal
      visible={props.modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={()=> props.setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
          <Text style={styles.modalTitle}>Esqueci minha senha</Text>
          {
            !successMessage &&
            <View>
              <InputBox
                text='Digite seu email para resetar a senha:'
                autoCapitalize='none'
                keyboardType='email-address'
                value={email}
                changed={value=>setEmail(value)}
                borderRadius={3}
              />
              {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            </View>
          }
          {!!successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
          </View>
          <View>
          {
            spinner &&
            <ActivityIndicator size="large" color="blue"/>
          }
          { !successMessage && !spinner &&
            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.button, { backgroundColor: '#2323FF' }]}
                onPress={submitHandler}
              >
                <Text style={styles.textStyle}>Enviar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor: '#FF2323' }]}
                onPress={() => props.setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          }
          {!!successMessage && 
            <Pressable
              style={[styles.button, { backgroundColor: '#FF2323' }]}
              onPress={() => props.setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Entendido</Text>
            </Pressable>
          }
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalTitle:{
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#eee',
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonGroup:{
    flexDirection: 'row',
    marginTop: 15
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
      padding: 2,
  },  
  button: {
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    margin: 5
  },
  successMessage:{
      color: '#080',
      backgroundColor: 'white',
      marginTop: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 12,
      borderWidth: 1,
      borderColor: '#080',
      padding: 2,
  },  
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
})

export default ModalForgetPassword;