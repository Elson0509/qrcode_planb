import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    View,
    Text,
  } from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import ActionButtons from '../../components/ActionButtons';

const CondoList = props => {
    const [condos, setCondos] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedCondo, setSelectedCondo] = useState(null)

    useEffect(()=>{
      fetchCondos()
      const willFocusSubscription = props.navigation.addListener('focus', ()=> {
        fetchCondos()
      })
      return willFocusSubscription
    }, [])

    const fetchCondos = _ => {
      api.get(`api/condo`)
      .then(resp=>{
        setCondos(resp.data)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delCondo = on => {
      setSelectedCondo(on)
      setModal(true)
    }

    const deleteCondoConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`api/condo/${selectedCondo.id}`)
        .then(res=>{
          Toast.show(res.data.message || 'Condomínio apagado com sucesso.', Constants.configToast)
          fetchCondos()
        })
        .catch((err)=>{
          Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoL2)', Constants.configToast)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const onRefreshHandler = _ =>{
      setRefreshing(true)
      fetchCondos()
      setRefreshing(false)
    }

    const editHandler = condo => {
      props.navigation.navigate('CondoEdit', 
        {
          user: props.route.params.user,
          condoBeingAdded: {
            id: condo.id,
            name: condo.name,
            address: condo.address,
            city: condo.city,
            state: condo.state,
            slots: condo.slots
          },
          screen: 'CondoEdit'
        }
      )
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return (
        <SafeAreaView style={styles.body}>
            <FlatList
              data={condos}
              keyExtractor={item=>item.id}
              style={{marginBottom: 80, paddingRight:10}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={()=> onRefreshHandler()}
                />
              }
              renderItem={(obj)=>{
                return (
                  <View 
                    style={styles.menuItem} 
                  >
                    <View>
                      <ActionButtons
                        flexDirection='row'
                        action1={()=> {editHandler(obj.item)}}
                        action2={()=> {delCondo(obj.item)}}
                      />
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                      <View>
                        <View>
                            <View style={{flexDirection: 'row', paddingBottom:3, marginBottom: 5, borderColor: Constants.backgroundDarkColors["Residents"]}}>
                              <View>
                                <Text style={{fontSize: 12, marginLeft: 7}}><Text style={{fontWeight:'bold'}}>Nome:</Text> {obj.item.name}</Text>
                                <Text style={{fontSize: 12, marginLeft: 7}}><Text style={{fontWeight:'bold'}}>Endereço:</Text> {obj.item.address}, {obj.item.city} - {obj.item.state}</Text>
                                <Text style={{fontSize: 12, marginLeft: 7}}><Text style={{fontWeight:'bold'}}>Vagas de estacionamento:</Text> {obj.item.slots}</Text>
                                <Text style={{fontSize: 12, marginLeft: 7}}><Text style={{fontWeight:'bold'}}>Ativo desde </Text> {Utils.printDate(new Date(obj.item.createdAt))}</Text>
                              </View>
                            </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
            <ModalMessage
              message={`Tem certeza que quer excluir este condomínio?`}
              title="Confirme"
              btn1Pressed={deleteCondoConfirmed}
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

export default CondoList