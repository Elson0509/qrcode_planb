import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/auth';
import ActionButtons from '../../components/ActionButtons'
import ModalCarousel from '../../components/ModalCarousel'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage'
import api from '../../services/api'
import ModalReply from '../../components/ModalReply'
import THEME from '../../services/theme'
import HeaderFilter from '../../components/HeaderFilter'
import ModalEventsFilter from '../../components/ModalEventsFilter'
import EventsReport from '../../components/EventsReport';

const EventList = props => {
  const currentDate = new Date()

  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalGeneric, setModalGeneric] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [modalCarousel, setModalCarousel] = useState(false)
  const [carouselImages, setCarouselImages] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [title, setTitle] = useState('Últimos eventos')
  const [dateInit, setDateInit] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [dateEnd, setDateEnd] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [occurrenceTypes, setOccurrenceTypes] = useState([])
  const [selectedOccorrenceType, setSelectedOccorrenceType] = useState(0)
  const [modalFilter, setModalFilter] = useState(false)

  useEffect(() => {
    const fetchEvents = async _ => {
      if (await Utils.handleNoConnection(setLoading)) return
      setLoading(true)
      api.get(`api/occurrence/paginate/${page}`)
        .then(resp => {
          setEvents(events.concat(resp.data.rows))
          setLastPage(resp.data.pages)
          setOccurrenceTypes(resp.data.occurrence_types)
        })
        .catch(err => {
          Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL1)')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchEvents()
  }, [page])

  const delEvent = async on => {
    if (await Utils.handleNoConnection(setLoading)) return
    setMessage(`Confirma exclusão desta ocorrência?`)
    setSelectedEvent(on)
    setModal(true)
  }

  const deleteEventConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`api/occurrence/${selectedEvent.id}`)
      .then(res => {
        Utils.toast(res.data.message)
        fetchEvents()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onClickPhotoHandler = async item => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (item.OccurrenceImages?.length) {
      setCarouselImages(item.OccurrenceImages)
      setModalCarousel(true)
    }
  }

  const replyHandler = async item => {
    if (await Utils.handleNoConnection(setLoading)) return
    setSelectedEvent(item)
    setModalGeneric(true)
    setSubject('Re: ' + item.title)
    setReplyMessage('')
  }

  const sendHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    api.post(`api/message/`, {
      messageBody: replyMessage,
      subject,
      receiver: selectedEvent.userRegistering.id
    })
      .then(resp => {
        setModalGeneric(false)
        Utils.toast(resp.data.message)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL3)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const endReachedHandler = _ => {
    if (page < lastPage) {
      setPage(prev => prev + 1)
    }
  }

  const selectedDatesHandler = _ => {
    setModalFilter(false)
    setLoading(true)

    const dateInicial = new Date(dateInit.year, dateInit.month - 1, dateInit.day, 0, 0, 0)
    const dateFinal = new Date(dateEnd.year, dateEnd.month - 1, dateEnd.day, 23, 59, 59)

    api.post('api/occurrence/filter', { selectedDateInit: dateInicial, selectedDateEnd: dateFinal, occurrence_type: selectedOccorrenceType })
      .then(resp => {
        setEvents(resp.data)
        setLastPage(0)
        setTitle('Ocorrências (' + Utils.printDate(dateInicial) + ' - ' + Utils.printDate(dateFinal) + ')')
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EL2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <SafeAreaView style={styles.body}>
      <HeaderFilter
        title={title}
        action={() => setModalFilter(true)}
      />
      {
        events.length > 0 &&
        <View>
          <EventsReport events={events} title={title}/>
        </View>
      }
      {
        events.length === 0 && !loading &&
        <Text style={styles.listText}>Não há eventos registrados.</Text>
      }
      {
        events.length > 0 &&
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          onEndReached={()=>endReachedHandler()}
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
                    noEditButton={!Utils.canShowMessage(user)}
                  />
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                  <View>
                    <View>
                      <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5, borderColor: Constants.backgroundDarkColors["MyQRCode"] }}>
                        <TouchableOpacity onPress={() => onClickPhotoHandler(obj.item)}>
                          {
                            obj.item.OccurrenceImages.length ?
                              <Image
                                style={{ width: 60, height: 80, marginRight: 5 }}
                                source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${obj.item.OccurrenceImages[0].photo_id}` }}
                              />
                              :
                              <Image
                                style={{ width: 60, height: 80, marginRight: 5 }}
                                source={require('../../../assets/pics/generic-event.png')}
                              />
                          }
                          {
                            obj.item.OccurrenceImages?.length ?
                              <Text style={{ textAlign: 'center' }}>{obj.item.OccurrenceImages.length} foto{obj.item.OccurrenceImages.length > 1 ? 's' : ''}</Text>
                              :
                              null
                          }
                        </TouchableOpacity>
                        <View>
                          <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Data:</Text> {Utils.printDateAndHour(new Date(obj.item.created_at))}</Text>
                          <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Quem registrou:</Text> {obj.item.userRegistering.name} ({Constants.USER_KIND_NAME[obj.item.userRegistering.user_kind_id]})</Text>
                          {!!obj.item.userRegistering?.Unit && <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Unidade:</Text> Bloco {obj.item.userRegistering.Unit.Bloco.name} - unidade {obj.item.userRegistering.Unit.number}</Text>}
                          {!!obj.item.OccurrenceType?.type && <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Título:</Text> {obj.item.OccurrenceType.type}</Text>}
                          {!!obj.item.place && <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Local:</Text> {obj.item.place}</Text>}
                          {!!obj.item.description && <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Descrição:</Text> {obj.item.description}</Text>}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          }}
        />
      }
      {
        !!loading &&
        <ActivityIndicator size="large" color="white" />
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
      <ModalReply
        modal={modalGeneric}
        setModal={setModalGeneric}
        setReplyMessage={setReplyMessage}
        replyMessage={replyMessage}
        subject={subject}
        setSubject={setSubject}
        sendHandler={sendHandler}
      />
      <ModalCarousel
        modalVisible={modalCarousel}
        setModalVisible={setModalCarousel}
        carouselImages={carouselImages}
      />
      <ModalEventsFilter
        modal={modalFilter}
        dateInit={dateInit}
        setDateInit={setDateInit}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
        setModal={setModalFilter}
        selectedDatesHandler={selectedDatesHandler}
        occurrenceTypes={occurrenceTypes}
        setSelectedOccorrenceType={setSelectedOccorrenceType}
        selectedOccorrenceType={selectedOccorrenceType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['MyQRCode'],
    flex: 1
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.backgroundDarkColors['MyQRCode'],
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['MyQRCode'],
  },
  listText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },
  subTitle: {
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 5,
  }
});

export default EventList