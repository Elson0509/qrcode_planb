import React, {useState, Fragment, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    View,
    Text,
  } from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import Icon from '../../components/Icon';
import FooterButtons from '../../components/FooterButtons';
import ModalMessage from '../../components/ModalMessage';
import ModalEditUnit from '../../components/ModalEditUnit';
import comp from '../../../dummyDataComp.json'

const UnitList = props => {
    const [units, setUnits] = useState({})
    const [modal, setModal] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [message, setMessage] = useState('')
    const [unitSelected, setUnitSelected] = useState(null)
    const [idEdit, setIdEdit] = useState('')
    const [blocoEdit, setBlocoEdit] = useState('')
    const [aptEdit, setAptEdit] = useState('')

    useEffect(()=>{
      setUnits(comp.data)
    }, [])

    const delUnitModal = unit => {
      console.log(unit)
      setUnitSelected(unit)
      setMessage(`Excluir Bloco ${unit.bloco} Apt ${unit.apt}?`)
      setModal(true)
    }

    const deleteUnitConfirmed = _ =>{
      setModal(false)
      const tempUnits = [...units]
      tempUnits.forEach((el, ind)=> {
        if(el.id===unitSelected.id){
          tempUnits.splice(ind, 1)
        }
      })
      setUnits(tempUnits)
    }

    const editUnitModal = unit => {
      console.log(unit)
      setUnitSelected(unit)
      setIdEdit(unit.id)
      setBlocoEdit(unit.bloco)
      setAptEdit(unit.apt)
      setModalEdit(true)
    }

    const editUnitConfirmed = _ =>{
      setModalEdit(false)
      const editedUser = {
        apt: aptEdit,
        bloco: blocoEdit,
        id: idEdit,
      }
      const tempUnits = [...units]
      tempUnits.forEach((el, ind)=> {
        if(el.id===unitSelected.id){
          tempUnits[ind]=editedUser
        }
      })
      setUnits(tempUnits)
    }

    return (
        <SafeAreaView style={styles.body}>
          <FlatList
            data={units}
            renderItem={(obj)=>{
                return <View 
                            key={obj.item.id}
                            style={styles.menuItem} 
                        >
                            <Text style={styles.listText}>{obj.item.bloco ? `Bloco ${obj.item.bloco}` : ''} Apt {obj.item.apt}</Text>
                            <View style={styles.actionButtons} >
                              <TouchableOpacity style={styles.actionButton}
                                onPress={()=> editUnitModal(obj.item)}
                              >
                                <Icon name="edit" size={30} color='#385165'/>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={()=> delUnitModal(obj.item)}
                              >
                                <Icon name="window-close" size={30} color='red'/>
                              </TouchableOpacity>
                            </View>
                        </View>
            }}
          />
          <ModalMessage
            message={message}
            title="Confirme"
            btn1Pressed={deleteUnitConfirmed}
            btn2Text='Cancelar'
            btn1Text='Apagar'
            modalVisible={modal}
            setModalVisible={setModal}
          />
          <ModalEditUnit
            btn1Pressed={editUnitConfirmed}
            unitSelected={unitSelected}
            setUnitSelected={setUnitSelected}
            modalVisible={modalEdit}
            setModalVisible={setModalEdit}
            idEdit={idEdit}
            blocoEdit={blocoEdit}
            aptEdit={aptEdit}
            setIdEdit={setIdEdit}
            setBlocoEdit={setBlocoEdit}
            setAptEdit={setAptEdit}
          />
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Units'],
      minHeight:'100%'
    },
    menuItem:{
      borderWidth: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Constants.backgroundLightColors['Units'],
      borderRadius: 20,
      marginBottom: 10,
    },
    actionButtons:{
      flexDirection: 'row',
    },
    actionButton:{
      marginRight: 10
    },
    listText:{
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16
    }
  });

export default UnitList