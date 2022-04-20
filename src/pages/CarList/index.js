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
import ModalCarousel from '../../components/ModalCarousel';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import ModalReply from '../../components/ModalReply'
import THEME from '../../services/theme';

const CarList = props => {
  const [overnights, setOvernights] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [selectedOvernight, setSelectedOvernight] = useState(null)
  const [modalGeneric, setModalGeneric] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [modalCarousel, setModalCarousel] = useState(false)
  const [carouselImages, setCarouselImages] = useState([])

  useEffect(() => {
    fetchOvernights()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchOvernights()
    })
    return willFocusSubscription
  }, [])

  const fetchOvernights = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return

    api.get(`api/overnight`)
      .then(resp => {
        setOvernights(resp.data.overnights)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delOvernight = on => {
    setMessage(`Excluir este reporte de pernoite?`)
    setSelectedOvernight(on)
    setModal(true)
  }

  const deleteOvernightConfirmed = async _ => {
    setModal(false)
    if (await Utils.handleNoConnection(setLoading)) return
    setLoading(true)
    api.delete(`api/overnight/${selectedOvernight.id}`)
      .then(res => {
        Utils.toast(res.data.message)
        fetchOvernights()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CL2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchOvernights()
    setRefreshing(false)
  }

  const onClickPhotoHandler = item => {
    if (item.OvernightImages?.length) {
      setCarouselImages(item.OvernightImages)
      setModalCarousel(true)
    }
  }

  const replyHandler = async item => {
    if (await Utils.handleNoConnection(setLoading)) return
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

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      {
        overnights.length > 0 ?
          <FlatList
            data={overnights}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefreshHandler()}
              />
            }
            renderItem={(obj) => {
              return (
                <View style={styles.menuItem}>
                  <View>
                    <ActionButtons
                      flexDirection='row'
                      editIcon='reply'
                      action1={() => replyHandler(obj.item)}
                      action2={() => delOvernight(obj.item)}
                    />
                  </View>
                  <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                    <View>
                      <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5, borderColor: Constants.backgroundDarkColors["Cars"] }}>
                        <TouchableOpacity onPress={() => onClickPhotoHandler(obj.item)}>
                          {
                            obj.item.OvernightImages.length ?
                              <Image
                                style={{ width: 60, height: 80, marginRight: 5 }}
                                source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${obj.item.OvernightImages[0].photo_id}` }}
                              />
                              :
                              <Image
                                style={{ width: 60, height: 80, marginRight: 5 }}
                                source={require('../../../assets/pics/generic-event.png')}
                              />
                          }
                          {
                            obj.item.OvernightImages.length ?
                              <Text style={{ textAlign: 'center', fontFamily: THEME.FONTS.r400 }}>{obj.item.OvernightImages.length} foto{obj.item.OvernightImages.length > 1 ? 's' : ''}</Text>
                              :
                              null
                          }
                        </TouchableOpacity>
                        <View style={{ width: 250 }}>
                          <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400}}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Data:</Text> {Utils.printDateAndHour(new Date(obj.item.created_at))}</Text>
                          <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400}}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Veículo registrado:</Text> {obj.item.is_registered_vehicle ? 'Sim' : 'Não'}</Text>
                          <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400}}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Quem registrou:</Text> {obj.item.userRegistering.name}</Text>
                          {!obj.item.description && <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400}}>Sem descrição</Text>}
                          {!!obj.item.description &&
                            <Text style={{ fontSize: 12, marginLeft: 7, fontFamily: THEME.FONTS.r400}}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Descrição:</Text> {obj.item.description}</Text>
                          }
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            }}
          />
          :
          <Text style={{ textAlign: 'center', padding: 10, fontFamily: THEME.FONTS.r700 }}>Não há registros.</Text>
      }
      <ModalMessage
        message={message}
        title="Confirme"
        btn1Pressed={deleteOvernightConfirmed}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Constants.backgroundColors['Cars'],
    flex: 1
  },
  menuItem: {
    borderBottomWidth: 2,
    borderBottomColor: Constants.backgroundDarkColors['Cars'],
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Cars'],
  },
});

export default CarList