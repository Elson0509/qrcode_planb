import React, {useState, useEffect} from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    View,
    Text,
    TouchableOpacity,
  } from 'react-native';
import Icon from '../../components/Icon'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Toast from 'react-native-root-toast';

const Slot = props => {
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [freeSlots, setFreeSlots] = useState(0)
  const [totalSlots, setTotalSlots] = useState(0)

  useEffect(()=>{
    fetchSlots()
  }, [])

  const fetchSlots = _ => {
    api.get(`api/condo/slots`)
    .then(resp=>{
      setFreeSlots(resp.data.freeslots)
      setTotalSlots(resp.data.totalslots)
    })
    .catch(err=>{
      Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (S1)')
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  const freeSlotHandler = _ => {
    if(freeSlots===totalSlots){
      Utils.toast('Todas as vagas já estão livres.')
    }
    else{
      setLoading(true)
      api.get(`api/condo/freeslot`)
      .then(resp=>{
        setFreeSlots(resp.data.freeslots)
        setTotalSlots(resp.data.totalslots)
        Utils.toast('Vaga liberada.')
      })
      .catch(err=>{
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (S2)')
      })
      .finally(()=>{
        setLoading(false)
      })
    }
  }

  const occupySlotHandler = _ => {
    if(freeSlots===0){
      Utils.toast('Não há mais vagas.')
    }
    else{
      setLoading(true)
      api.get(`api/condo/occupyslot`)
      .then(resp=>{
        setFreeSlots(resp.data.freeslots)
        setTotalSlots(resp.data.totalslots)
        Utils.toast('Vaga preenchida.')
      })
      .catch(err=>{
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (S3)')
      })
      .finally(()=>{
        setLoading(false)
      })
    }
  }    

  if(loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white"/>
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <View>
        <Text style={{textAlign: 'center', fontSize: 15}}>Há <Text style={{fontWeight: 'bold', fontSize: 20}}> {freeSlots} </Text> vagas de estacionamento livres</Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>de um total de {totalSlots} vagas.</Text>
      </View>
      <TouchableOpacity style={[styles.button, {backgroundColor: '#0F7'}]} onPress={()=> {occupySlotHandler()}}>
        <View style={styles.rowIcons}>
          <Icon name='car' size={40}/>
          <Icon name='sign-in-alt' size={40}/>
        </View>
        <Text>Dar entrada</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, {backgroundColor: '#F99'}]} onPress={()=> {freeSlotHandler()}}>
        <View style={styles.rowIcons}>
          <Icon name='sign-out-alt' size={40}/>
          <Icon name='car' size={40}/>
        </View>
        <Text>Dar Saída</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body:{
    padding:10,
    backgroundColor: Constants.backgroundColors['Slot'],
    minHeight:'100%'
  },
  button:{
    alignItems: 'center',
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
  },
  rowIcons:{
    display: 'flex',
    flexDirection: 'row'
  }
});

export default Slot