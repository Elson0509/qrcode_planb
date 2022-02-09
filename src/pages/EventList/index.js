import React, { useState, useEffect } from 'react';
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

const EventList = props => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)
  const [modalGeneric, setModalGeneric] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [subject, setSubject] = useState('')

  useEffect(() => {
    fetchEvents()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchEvents()
    })
    return willFocusSubscription
  }, [])

  const fetchEvents = _ => {
    api.get(`api/occurrence`)
      .then(resp => {
        setEvents(resp.data.occurences)
      })
      .catch(err => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL1)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delEvent = on => {
    setMessage(`Confirma exclusão desta ocorrência?`)
    setSelectedEvent(on)
    setModal(true)
  }

  const deleteEventConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`api/occurrence/${selectedEvent.id}`)
      .then(res => {
        Toast.show(res.data.message, Constants.configToast)
        fetchEvents()
      })
      .catch((err) => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchEvents()
    setRefreshing(false)
  }

  const onClickPhotoHandler = item => {
    setSelectedEvent(item)
    setIsModalPhotoActive(true)
  }

  const replyHandler = item => {
    setSelectedEvent(item)
    setModalGeneric(true)
    setSubject('Re: ' + item.title)
    setReplyMessage('')
  }

  const sendHandler = _ => {
    api.post(`api/message/`, {
      messageBody: replyMessage,
      subject,
      receiver: selectedEvent.userRegistering.id
    })
      .then(resp => {
        setModalGeneric(false)
        Toast.show(resp.data.message, Constants.configToast)
      })
      .catch(err => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL3)', Constants.configToast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      {
        events.length > 0 ?
          <FlatList
            data={events}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefreshHandler()}
              />
            }
            renderItem={(obj) => {
              return (
                <View
                  style={styles.menuItem}
                >
                  <View>
                    <ActionButtons
                      flexDirection='row'
                      editIcon='reply'
                      action1={() => replyHandler(obj.item)}
                      action2={() => delEvent(obj.item)}
                    />
                  </View>
                  <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                    <View style={{ maxWidth: 300 }}>
                      <View>
                        <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5, borderColor: Constants.backgroundDarkColors["Events"] }}>
                          <TouchableOpacity onPress={() => onClickPhotoHandler(obj.item)}>
                            <Image
                              style={{ width: 60, height: 80, marginRight: 5 }}
                              source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${obj.item.photo_id}` }}
                            />
                          </TouchableOpacity>
                          <View style={{ width: 245 }}>
                            <Text style={{ fontSize: 12, marginLeft: 7 }}><Text style={{ fontWeight: 'bold' }}>Data:</Text> {Utils.printDateAndHour(new Date(obj.item.created_at))}</Text>
                            <Text style={{ fontSize: 12, marginLeft: 7, }}><Text style={{ fontWeight: 'bold' }}>Quem registrou:</Text> {obj.item.userRegistering.name} ({Constants.USER_KIND_NAME[obj.item.userRegistering.user_kind_id]})</Text>
                            {!!obj.item.userRegistering?.Unit && <Text style={{ fontSize: 12, marginLeft: 7, }}><Text style={{ fontWeight: 'bold' }}>Unidade:</Text> Bloco {obj.item.userRegistering.Unit.Bloco.name} - unidade {obj.item.userRegistering.Unit.number}</Text>}
                            {!!obj.item.title && <Text style={{ fontSize: 12, marginLeft: 7, }}><Text style={{ fontWeight: 'bold' }}>Título:</Text> {obj.item.title}</Text>}
                            {!!obj.item.place && <Text style={{ fontSize: 12, marginLeft: 7, }}><Text style={{ fontWeight: 'bold' }}>Local:</Text> {obj.item.place}</Text>}
                            {!!obj.item.description && <Text style={{ fontSize: 12, marginLeft: 7, }}><Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {obj.item.description}</Text>}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            }}
          />
          :
          <Text style={{ textAlign: 'center', padding: 10 }}>Não há registros.</Text>
      }
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
  body: {
    backgroundColor: Constants.backgroundColors['Events'],
    flex: 1
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.backgroundDarkColors['Events'],
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Events'],
  },
  listText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 5,
  }
});

export default EventList