import React, {useState} from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import FooterButtons from '../FooterButtons'
import InputBox from '../InputBox'
import Icon from '../Icon';
import ModalPhoto from '../ModalPhoto';


const ModalAddResident = (props) => {
  const [addPhotoIsClicked, setAddPhotoIsClicked] = useState(false)

  const cancelModalHandler = _ =>{
    setName('')
    setIdentidade('')
    setAddPhotoIsClicked(false)
    props.setModalVisible(false)
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
                <Text style={styles.modalTitle}>Dados do morador:</Text>
                <InputBox
                  text="Nome*:"
                  value={props.userBeingAdded.name}
                  width={270}
                  changed={val=>props.setUserBeingAdded({...props.userBeingAdded, name: val})}
                />
                <InputBox
                  text="Identidade:"
                  value={props.userBeingAdded.identification}
                  width={270}
                  changed={val=>props.setUserBeingAdded({...props.userBeingAdded, identification: val})}
                />
                <InputBox
                  text="Email*:"
                  value={props.userBeingAdded.email}
                  width={270}
                  changed={val=>props.setUserBeingAdded({...props.userBeingAdded, email: val})}
                />
                {!addPhotoIsClicked && 
                  <TouchableOpacity
                    style={[styles.buttonAddphotoIsClicked]}
                    onPress={()=>setAddPhotoIsClicked(true)}
                  >
                    <Text>Adicionar Foto</Text>
                  </TouchableOpacity>
                  ||
                  <View style={styles.buttonAddPhotoGroup}>
                    <TouchableOpacity
                      style={[styles.buttonAddphotoIsClicked]}
                      //onPress={()=>{props.navigation.navigate('CameraPic', {teste: 'teste'})}}
                      onPress={()=>{props.photoClickHandler()}}
                    >
                      <Icon name="camera" size={18}/>
                      <Text>Câmera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonAddphotoIsClicked, {marginLeft: 40}]}
                      onPress={()=>{}}
                    >
                      <Icon name="paperclip" size={18}/>
                      <Text>Arquivo</Text>
                    </TouchableOpacity>
                  </View>
                }
                
                <FooterButtons
                  title1="Adicionar"
                  action1={()=>{props.setModalVisible(false)}}
                  title2="Cancelar"
                  action2={cancelModalHandler}
                  buttonPadding={8}
                />
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
    buttonAddphotoIsClicked:{
      borderRadius: 8,
      backgroundColor: '#90EE90',
      marginTop: 15,
      padding: 15,
      alignItems: 'center',
    },
    buttonAddPhotoGroup:{
      flexDirection: 'row'
    }
});

export default ModalAddResident;