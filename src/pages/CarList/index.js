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
import ModalReply from '../../components/ModalReply'

const CarList = props => {
    const [overnights, setOvernights] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [message, setMessage] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [selectedOvernight, setSelectedOvernight] = useState(null)
    const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)
    const [modalGeneric, setModalGeneric] = useState(false)
    const [replyMessage, setReplyMessage] = useState('')
    const [subject, setSubject] = useState('')

    useEffect(()=>{
      fetchOvernights()
      const willFocusSubscription = props.navigation.addListener('focus', ()=> {
        fetchOvernights()
      })
      return willFocusSubscription
    }, [])

    const fetchOvernights = _ => {
      api.get(`api/overnight`)
      .then(resp=>{
        setOvernights(resp.data.overnights)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delOvernight = on => {
      setMessage(`Excluir este reporte de pernoite?`)
      setSelectedOvernight(on)
      setModal(true)
    }

    const deleteOvernightConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`api/overnight/${selectedOvernight.id}`)
        .then(res=>{
          Toast.show(res.data.message, Constants.configToast)
          fetchOvernights()
        })
        .catch((err)=>{
          Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL2)', Constants.configToast)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    const onRefreshHandler = _ =>{
      setRefreshing(true)
      fetchOvernights()
      setRefreshing(false)
    }

    const onClickPhotoHandler = item => {
      setSelectedOvernight(item)
      setIsModalPhotoActive(true)
    }

    const replyHandler = item => {
      setSelectedOvernight(item)
      setModalGeneric(true)
      setSubject('')
      setReplyMessage('')
    }

    const sendHandler = _ => {
      api.post(`api/message/`, {
        messageBody: replyMessage,
        subject,
        receiver: selectedOvernight.userRegistering.id
      })
      .then(resp=>{
        setModalGeneric(false)
        Toast.show(resp.data.message, Constants.configToast)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL3)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return (
        <SafeAreaView style={styles.body}>
            <FlatList
              data={overnights}
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
                        editIcon='reply'
                        action1={()=> replyHandler(obj.item)}
                        action2={()=> delOvernight(obj.item)}
                      />
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                      <View style={{maxWidth: 300}}>
                        <View>
                            <View style={{flexDirection: 'row', paddingBottom:3, marginBottom: 5, borderColor: Constants.backgroundDarkColors["Cars"]}}>
                              <TouchableOpacity onPress={()=> onClickPhotoHandler(obj.item)}>
                                <Image
                                  style={{width: 60, height: 80, marginRight: 5}}
                                  source={{uri: `${Constants.apiurlPrefix}${Constants.apiurl}/img/${obj.item.id}.jpg`}}
                                />
                              </TouchableOpacity>
                              <View style={{width: 250}}>
                                <Text style={{fontSize: 12, marginLeft: 7}}><Text style={{fontWeight:'bold'}}>Data:</Text> {Utils.printDateAndHour(new Date(obj.item.created_at))}</Text>
                                <Text style={{fontSize: 12, marginLeft: 7,}}><Text style={{fontWeight:'bold'}}>Veículo registrado:</Text> {obj.item.is_registered_vehicle ? 'Sim' : 'Não'}</Text>
                                <Text style={{fontSize: 12, marginLeft: 7,}}><Text style={{fontWeight:'bold'}}>Quem registrou:</Text> {obj.item.userRegistering.name}</Text>
                                {!obj.item.description && <Text style={{fontSize: 12, marginLeft: 7,}}>Sem descrição</Text>}
                                {!!obj.item.description && (
                                  <View style={{width: 245, padding: 5, borderWidth: 1, backgroundColor: 'white', borderRadius: 10, marginTop: 5}}>
                                    <Text style={{fontSize: 12, marginLeft: 7,}}><Text style={{fontWeight:'bold'}}>Descrição:</Text> {obj.item.description}</Text>
                                  </View>
                                )}
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
              btn1Pressed={deleteOvernightConfirmed}
              btn2Text='Cancelar'
              btn1Text='Apagar'
              modalVisible={modal}
              setModalVisible={setModal}
            />
            <ModalPhoto
              modalVisible={isModalPhotoActive}
              setModalVisible={setIsModalPhotoActive}
              id={selectedOvernight?.id}
            />
            <ModalReply
              modal={modalGeneric}
              setModal={setModalGeneric}
              setReplyMessage={setReplyMessage}
              replyMessage={replyMessage}
              subject={subject}
              setSubject={setSubject}
              sendHandler={sendHandler}
            />
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Cars'],
      minHeight:'100%'
    },
    menuItem:{
      borderWidth: 1,
      padding: 10,
      backgroundColor: Constants.backgroundLightColors['Cars'],
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

export default CarList