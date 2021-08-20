import React, {useState} from 'react';
import { StyleSheet, Text, View, Modal, Button, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import InputBox from '../InputBox';
import * as Constants from '../../services/constants'

const ModalEditUnit = (props) => {
  const [message, setMessage] = useState('')

  const confirmHandler = _ =>{
    if(!props.unitWillUpdate.bloco_name.trim())
      setMessage('Bloco não pode estar em branco.')
    if(!props.unitWillUpdate.unit_number.trim())
      setMessage('Unidade não pode estar em branco.')
    else{
      setMessage('')
      props.btn1Pressed()
    }
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
                <Text style={styles.modalTitle}>Editar unidade:</Text>
                <InputBox 
                  text="Bloco:" 
                  width={190}
                  value={props.unitWillUpdate.bloco_name} 
                  changed={value=>props.setUnitWillUpdate({...props.unitWillUpdate, bloco_name:value})}
                  backgroundColor={Constants.backgroundLightColors['Units']}
                  borderColor={Constants.backgroundDarkColors['Units']}
                  colorInput={Constants.backgroundDarkColors['Units']}
                />
                <InputBox 
                  text="Apartamento:" 
                  width={190}
                  value={props.unitWillUpdate.unit_number} 
                  changed={value=>props.setUnitWillUpdate({...props.unitWillUpdate, unit_number:value})}
                  backgroundColor={Constants.backgroundLightColors['Units']}
                  borderColor={Constants.backgroundDarkColors['Units']}
                  colorInput={Constants.backgroundDarkColors['Units']}
                />
                <View style={[styles.buttonGroup]}>
                  <Pressable
                    style={[styles.button, { backgroundColor: props.btn1BgColor || '#2323FF' }]}
                    onPress={confirmHandler}
                  >
                    <Text style={styles.textStyle}>Confirmar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, { backgroundColor: props.btn2BgColor || '#FF2323' }]}
                    onPress={() => props.setModalVisible(false)}
                  >
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </Pressable>
                </View>
                {!!message && <Text style={styles.modalMessage}>{message}</Text>}
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
      fontSize: 23,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
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
      flexDirection: 'row'
    },
    button: {
      borderRadius: 20,
      padding: 12,
      elevation: 2,
      marginLeft: 10
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    modalMessage:{
      color:'red',
      textAlign:'center',
      marginTop:12
    }
  });

export default ModalEditUnit;