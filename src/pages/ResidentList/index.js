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
import ActionButtons from '../../components/ActionButtons';
import dummyListUsers from '../../../dummyListUsers.json'
import * as Constants from '../../services/constants'
import ModalMessage from '../../components/ModalMessage';

const ResidentList = props => {
    const [users, setUsers] = useState({})
    const [modal, setModal] = useState(false)
    const [message, setMessage] = useState('')
    const [unitSelected, setUnitSelected] = useState(null)


    useEffect(()=>{
      setUsers(dummyListUsers.data)
    }, [])

    const delUnitModal = unit => {
      setUnitSelected(unit)
      setMessage(`Excluir Bloco ${unit.bloco} unidade ${unit.unidade}?`)
      setModal(true)
    }

    const deleteUnitConfirmed = _ =>{
      setModal(false)
      const tempUsers = [...users]
      tempUsers.forEach((el, ind)=> {
        if(el.id===unitSelected.id){
          tempUsers.splice(ind, 1)
        }
      })
      setUsers(tempUsers)
    }

    const editHandler = unitId => {
      props.navigation.navigate('ResidentEdit', {id: unitId})
    }

    return (
        <SafeAreaView style={styles.body}>
            <FlatList
              data={users}
              style={{marginBottom: 80, paddingRight:10}}
              renderItem={(obj)=>{
                  return (
                    <View 
                      style={styles.menuItem} 
                    >
                      <Text style={styles.listText}>Bloco {obj.item.bloco} Unidade {obj.item.unidade}</Text>
                      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                        <View style={{maxWidth: 250}}>
                          <View>
                            <Text style={styles.subTitle}>Moradores:</Text>
                            {
                              obj.item.residentes.map((res, ind)=>{
                                return (
                                  <Text key={ind}>{ind+1}-{res}</Text>
                                )
                              })
                            }
                          </View>
                          <View>
                            {obj.item.veiculos?.length > 0 && <Text style={styles.subTitle}>Veículos:</Text>}
                            {(!obj.item.veiculos || obj.item.veiculos.length === 0) && <Text style={{marginTop: 10, textDecorationLine: 'underline'}}>Sem veículos cadastrados</Text>}
                            {
                              obj.item.veiculos?.map((car, ind)=>{
                                return (
                                  <Text key={ind}>-{`${car.veiculo_montador} ${car.veiculo_modelo} ${car.veiculo_cor} - ${car.veiculo_placa}`}</Text>
                                )
                              })
                            }
                          </View>
                        </View>
                        <View>
                          <ActionButtons
                            flexDirection='column'
                            action1={()=> editHandler(obj.item)}
                            action2={()=> delUnitModal(obj.item)}
                          />
                        </View>
                      </View>
                    </View>
                  )
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
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Residents'],
      minHeight:'100%'
    },
    menuItem:{
      borderWidth: 1,
      padding: 10,
      backgroundColor: Constants.backgroundLightColors['Residents'],
      borderRadius: 20,
      marginBottom: 10,
    },
    listText:{
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign:'center'
    },
    subTitle:{
      fontWeight:'bold',
      fontSize: 15,
      textDecorationLine: 'underline',
      marginTop: 5,
    }
  });

export default ResidentList