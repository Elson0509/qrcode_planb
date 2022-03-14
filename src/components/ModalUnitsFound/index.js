import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import InputBox from '../InputBox';
import * as Constants from '../../services/constants'

const ModalUnitsFound = (props) => {
  return (
    <Modal
      visible={props.modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => props.setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Unidades encontradas</Text>
          <Text>Sugerimos as seguintes unidades. Confirma?</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.unitsFound}>
              {props.aptsAnalysed ? props.aptsAnalysed.join(', ') : null}
            </Text>
            <Text style={styles.small}>Obs: Mesmo confirmando, você ainda poderá fazer alterações.</Text>
          </View>
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
    marginTop: 22,
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
    padding: 10,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    marginLeft: 10
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  unitsFound:{
    fontWeight: 'bold',
    marginVertical: 5,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  small: {
    marginBottom: 10,
  }

});

export default ModalUnitsFound;