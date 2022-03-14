import React from 'react';
import { StyleSheet, Text, View, Modal, Button, Pressable, ActivityIndicator } from 'react-native';
import InputBox from '../InputBox';
import * as Constants from '../../services/constants'

const ModalNewSmartBloco = (props) => {
  return (
    <Modal
      visible={props.modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => props.setModalVisible(false)}
    >
      <View style={styles.centeredView}>

        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Novo Bloco</Text>
          <View>
            <InputBox
              text="Nome do novo bloco:"
              value={props.newBlockAnalysed}
              changed={value => props.setNewBlockAnalysed(value)}
              backgroundColor={Constants.backgroundLightColors['Units']}
              borderColor={Constants.backgroundDarkColors['Units']}
              colorInput={Constants.backgroundDarkColors['Units']}
            />
          </View>
          {!!props.errornewBlockAnalysedMessage && <Text style={styles.modalMessage}>{props.errornewBlockAnalysedMessage}</Text>}
          {
            props.loadingAddingSmartBloco ?
              <ActivityIndicator size="small" color="blue" />
              :
              <View style={[styles.buttonGroup]}>
                <Pressable
                  style={[styles.button, { backgroundColor: props.btn2BgColor || '#FF2323' }]}
                  onPress={() => props.setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: props.btn1BgColor || '#2323FF' }]}
                  onPress={props.confirmHandler}
                >
                  <Text style={styles.textStyle}>Confirmar</Text>
                </Pressable>
              </View>

          }
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
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 23,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonGroup: {
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
  modalMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
    paddingBottom: 10,
  }
});

export default ModalNewSmartBloco;