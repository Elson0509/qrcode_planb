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
import ActionButtons from '../../components/ActionButtons';
import Icon from '../../components/Icon';
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
    const [blocoIdEdit, setBlocoIdEdit] = useState('')
    const [aptEdit, setAptEdit] = useState('')

    useEffect(()=>{
      setUnits(comp.data)
    }, [])

    const delUnitModal = unit => {
      console.log(unit)
      setUnitSelected(unit)
      setMessage(`Excluir ${unit.bloco.name ? 'Bloco ' + unit.bloco.name : ''} Apt ${unit.apt}?`)
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
      setBlocoEdit(unit.bloco.name)
      setBlocoIdEdit(unit.bloco.id)
      setAptEdit(unit.apt)
      setModalEdit(true)
    }

    const editUnitConfirmed = _ =>{
      setModalEdit(false)
      const editedUser = {
        apt: aptEdit,
        bloco:{
          name:  blocoEdit,
          id: blocoIdEdit
        },
        id: idEdit,
      }
      const tempUnits = [...units]
      tempUnits.forEach((el, ind)=> {
        if(el.bloco.id == blocoIdEdit){
          el.bloco.name = blocoEdit
        }
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
              return  <View 
                        key={obj.item.id}
                        style={styles.menuItem} 
                      >
                        <Text style={styles.listText}>{obj.item.bloco.name ? `Bloco ${obj.item.bloco.name}` : ''} Apt {obj.item.apt}</Text>
                        <ActionButtons
                          action1={()=> editUnitModal(obj.item)}
                          action2={()=> delUnitModal(obj.item)}
                        />
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
      marginBottom: 3,
    },
    // actionButtons:{
    //   flexDirection: 'row',
    // },
    // actionButton:{
    //   marginRight: 10
    // },
    listText:{
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16
    }
});

export default UnitList