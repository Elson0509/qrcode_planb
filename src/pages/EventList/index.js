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
import ActionButtons from '../../components/ActionButtons';
import ModalPhoto from '../../components/ModalPhoto';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import Toast from 'react-native-root-toast';

const EventList = props => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [message, setMessage] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)

    useEffect(()=>{
      fetchEvents()
      const willFocusSubscription = props.navigation.addListener('focus', ()=> {
        fetchEvents()
      })
      return willFocusSubscription
    }, [])

    const fetchEvents = _ => {
      api.get(`api/occurrence`)
      .then(resp=>{
        setEvents(resp.data.occurences)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delEvent = on => {
      setMessage(`Confirma exclusão desta ocorrência?`)
      setSelectedEvent(on)
      setModal(true)
    }

    const deleteEventConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`api/occurrence/${selectedEvent.id}`)
        .then(res=>{
          Toast.show(res.data.message, Constants.configToast)
          fetchEvents()
        })
        .catch((err)=>{
          Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)', Constants.configToast)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const onRefreshHandler = _ =>{
      setRefreshing(true)
      fetchEvents()
      setRefreshing(false)
    }

    const onClickPhotoHandler = item => {
      setSelectedEvent(item)
      setIsModalPhotoActive(true)
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return (
        <SafeAreaView style={styles.body}>
            <FlatList
              data={events}
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
                        noEditButton
                        action2={()=> delEvent(obj.item)}
                      />
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                      <View style={{maxWidth: 300}}>
                        <View>
                            <View style={{flexDirection: 'row', paddingBottom:3, marginBottom: 5, borderColor: Constants.backgroundDarkColors["Events"]}}>
                              <TouchableOpacity onPress={()=> onClickPhotoHandler(obj.item)}>
                                <Image
                                  style={{width: 60, height: 80, marginRight: 5}}
                                  source={{uri: `${Constants.apiurlPrefix}${Constants.apiurl}/img/${obj.item.id}.jpg`}}
                                />
                              </TouchableOpacity>
                              <View style={{maxWidth: 250}}>
                                <Text style={{fontSize: 12, marginLeft: 7}}>Data: {Utils.printDateAndHour(new Date(obj.item.created_at))}</Text>
                                <Text style={{fontSize: 12, marginLeft: 7,}}>Quem registrou: {obj.item.userRegistering.name}</Text>
                                {/*tipo*/}
                                {!!obj.item.userRegistering?.Unit && <Text style={{fontSize: 12, marginLeft: 7,}}>Unidade: Bloco {obj.item.userRegistering.Unit.Bloco.name} - unidade {obj.item.userRegistering.Unit.number}</Text>}
                                {!!obj.item.title && <Text style={{fontSize: 12, marginLeft: 7,}}>Título: {obj.item.title}</Text>}
                                {!!obj.item.place && <Text style={{fontSize: 12, marginLeft: 7,}}>Local: {obj.item.place}</Text>}
                                <Text style={{fontSize: 12, marginLeft: 7,}}>{obj.item.description ? `Descrição: ${obj.item.description}` : `Sem descrição`}</Text>
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
              message={message}
              title="Confirme"
              btn1Pressed={deleteEventConfirmed}
              btn2Text='Cancelar'
              btn1Text='Apagar'
              modalVisible={modal}
              setModalVisible={setModal}
            />
            <ModalPhoto
              modalVisible={isModalPhotoActive}
              setModalVisible={setIsModalPhotoActive}
              id={selectedEvent?.id}
            />
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Events'],
      minHeight:'100%'
    },
    menuItem:{
      borderWidth: 1,
      padding: 10,
      backgroundColor: Constants.backgroundLightColors['Events'],
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

export default EventList