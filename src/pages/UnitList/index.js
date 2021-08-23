import React, {useState, Fragment, useEffect} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Text,
    ActivityIndicator
  } from 'react-native';
import * as Constants from '../../services/constants'
import ActionButtons from '../../components/ActionButtons'
import ModalMessage from '../../components/ModalMessage'
import ModalEditUnit from '../../components/ModalEditUnit'
import api from '../../services/api'
import Toast from 'react-native-root-toast';

const UnitList = props => {
    const [blocos, setBlocos] = useState([])
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modalEdit, setModalEdit] = useState(false)
    const [message, setMessage] = useState('')
    const [unitSelected, setUnitSelected] = useState({})
    const [unitWillUpdate, setUnitWillUpdate] = useState({})

    useEffect(()=>{
      listUnits()
    }, [])

    const listUnits = _ => {
      api.get(`api/condo/${props.route.params.user.condo_id}`)
      .then(resp => {
        console.log(resp.data)
        setBlocos(resp.data)
        setLoading(false)
      })
      .catch(err=> {
        console.log(err)
        setLoading(false)
      })
    }

    const unitList = _ => {
      const units = []
      blocos.forEach(elbloco=> {
        elbloco.units.forEach(elunit=> {
          const unit = {}
          unit.bloco_id = elbloco.id
          unit.bloco_name = elbloco.name
          unit.unit_id = elunit.id
          unit.unit_number = elunit.number
          units.push(unit)
        })
      })
      return units
    }

    const delUnitModal = unit => {
      setUnitSelected(unit)
      setMessage(`Excluir unidade ${unit.unit_number} do bloco ${unit.bloco_name}, seus moradores e visitantes?`)
      setModal(true)
    }

    const deleteUnitConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`/api/unit`, {
        data:{
          user_id_last_modify: props.route.params.user.id,
          bloco_id: unitSelected.bloco_id,
          number: unitSelected.unit_number
        }
      })
      .then((resp)=> {
        Toast.show(resp.data.message, Constants.configToast)
        listUnits()
      })
      .catch((err)=> {
        Toast.show(err.response.data.message, Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const editUnitModal = unit => {
      setUnitSelected(unit)
      setUnitWillUpdate(unit)
      setModalEdit(true)
    }

    const editUnitConfirmed = _ =>{
      setModalEdit(false)
      setLoading(true)
      api.post('/api/unit/bloco', {
        unitSelected,
        unitWillUpdate,
        condo_id: props.route.params.user.condo_id,
        user_id_last_modify: props.route.params.user.id
      })
      .then((resp)=> {
        Toast.show(resp.data.message, configToast)
        listUnits()
      })
      .catch((err)=> {
        Toast.show(err.response.data.message, configToast)
      })
      .finally(()=>{
        setLoading(false)
      })

      
    }

    return (
        <SafeAreaView style={styles.body}>
          {loading &&
            <ActivityIndicator size="large" color="white"/>
          ||
          <FlatList
            data={unitList()}
            
            keyExtractor={item=> item.unit_id}
            renderItem={(obj)=>{
              return  (
                <View 
                  style={styles.menuItem} 
                >
                  <Text style={styles.listText}>{`Bloco ${obj.item.bloco_name} Unidade ${obj.item.unit_number}`}</Text>
                  <ActionButtons
                    action1={()=> editUnitModal(obj.item)}
                    action2={()=> delUnitModal(obj.item)}
                  />
                </View>
              )
            }}
          />
          }
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
            modalVisible={modalEdit}
            setModalVisible={setModalEdit}
            unitWillUpdate={unitWillUpdate}
            setUnitWillUpdate={setUnitWillUpdate}
          />
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 90,
      backgroundColor: Constants.backgroundColors['Units'],
      minHeight:'100%',
      
    },
    menuItem:{
      flex: 1,
      borderWidth: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Constants.backgroundLightColors['Units'],
      borderRadius: 20,
      marginBottom: 3,
    },
    listText:{
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16
    }
});

export default UnitList