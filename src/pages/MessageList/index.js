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
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import ModalGeneric from '../../components/ModalGeneric';
import THEME from '../../services/theme';
import api from '../../services/api'

const MessageList = props => {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalViewMessage, setModalViewMessage] = useState(false)

  useEffect(() => {
    fetchMessages()
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      fetchMessages()
    })
    return willFocusSubscription
  }, [])

  const fetchMessages = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    api.get(`api/message/list/${props.route.params.user.id}`)
      .then(resp => {
        setMessages(resp.data.messages)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (ML1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const delMessage = async on => {
    if(await Utils.handleNoConnection(setLoading)) return
    setSelectedMessage(on)
    setModal(true)
  }

  const deleteMessageConfirmed = _ => {
    setModal(false)
    setLoading(true)
    api.delete(`api/message/${selectedMessage.id}`)
      .then(res => {
        Utils.toast(res.data.message)
        fetchMessages()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (ML2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onRefreshHandler = _ => {
    setRefreshing(true)
    fetchMessages()
    setRefreshing(false)
  }

  const viewMessageHandler = async itemMessage => {
    if(await Utils.handleNoConnection(setLoading)) return
    setSelectedMessage(itemMessage)
    if (!itemMessage.is_read)
      api.put(`/api/message/${itemMessage.id}`)
    setModalViewMessage(true)
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      {messages.length > 0 &&
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          style={{ marginBottom: 80, paddingRight: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefreshHandler()}
            />
          }
          renderItem={(obj) => {
            return (
              <TouchableOpacity style={styles.menuItem} onPress={() => viewMessageHandler(obj.item)}>
                <View style={{ maxWidth: 300, alignSelf: 'center' }}>
                  <View style={{ width: 250 }}>
                    <Text style={{ fontSize: 12, fontFamily: THEME.FONTS.r400, marginLeft: 7, fontWeight: !obj.item.is_read ? 'bold' : 'normal' }}>{obj.item.subject} ({Utils.printDateAndHour(new Date(obj.item.created_at))})</Text>
                  </View>
                </View>
                <View>
                  <ActionButtons
                    flexDirection='row'
                    noEditButton
                    action2={() => delMessage(obj.item)}
                  />
                </View>
              </TouchableOpacity>
            )
          }}
        />
      }
      {messages.length == 0 &&
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Não há mensagens</Text>
        </View>
      }
      <ModalMessage
        message={`Excluir esta mensagem?`}
        title="Confirme"
        btn1Pressed={deleteMessageConfirmed}
        btn2Text='Cancelar'
        btn1Text='Apagar'
        modalVisible={modal}
        setModalVisible={setModal}
      />
      <ModalGeneric
        title="Mensagem"
        btn2Text='Fechar'
        modalVisible={modalViewMessage}
        setModalVisible={setModalViewMessage}
      >
        {!!selectedMessage.sending?.name && <Text style={{ fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>De:</Text> {selectedMessage.sending?.name} ({Constants.USER_KIND_NAME[selectedMessage.sending.user_kind_id]})</Text>}
        <Text style={{ fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Assunto:</Text> {selectedMessage.subject}</Text>
        <Text style={{ marginTop: 5, fontFamily: THEME.FONTS.r400 }}><Text style={{ fontFamily: THEME.FONTS.r700 }}>Mensagem:</Text> {selectedMessage.message}</Text>
      </ModalGeneric>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: 'white',
    minHeight: '100%'
  },
  menuItem: {
    borderWidth: 2,
    padding: 4,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
});

export default MessageList