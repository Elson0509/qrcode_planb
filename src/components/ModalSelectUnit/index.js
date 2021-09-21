import React from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';

const ModalSelectUnit = (props) => {
  console.log(props)
  return (
      <Modal
          visible={props.modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={()=> props.setModalVisible(false)}
      >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Selecione a unidade:</Text>
                  {props.bloco && <FlatList
                    data={props.bloco.Units}
                    renderItem={(obj)=>{
                      return <TouchableOpacity 
                                key={obj.item.id} 
                                onPress={()=> {props.selectUnitHandler(obj.item)}}
                                style={[styles.item, {backgroundColor: props.backgroundItem || '#efe'}]}
                              >
                                  <Text style={styles.menuItemText}>{obj.item.number}</Text>
                              </TouchableOpacity>
                    }}
                  />}
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
      fontSize: 18,
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
    item:{
      borderWidth: 1,
      width: 180,
      marginRight: 10,
      padding: 12,
      marginBottom: 8,
      borderRadius: 10,
    },  
    menuItemText:{
      fontSize: 15,
      textAlign: 'center',
      fontWeight: 'bold',
    },  
  });

export default ModalSelectUnit;