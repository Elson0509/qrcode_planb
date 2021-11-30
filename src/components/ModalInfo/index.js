import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';

const ModalInfo = (props) => {
    return (
        <Modal
            visible={props.modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={()=> props.setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {props.title && <Text style={styles.modalTitle}>{props.title}</Text>}
              <Text style={styles.modalText}>{props.message}</Text>
              <View style={[styles.buttonGroup]}>
                <Pressable
                  style={[styles.button, { backgroundColor: props.btn1BgColor || '#2323FF' }]}
                  onPress={()=>props.setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>{props.btn1Text || 'OK'}</Text>
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
    }
  });

export default ModalInfo;