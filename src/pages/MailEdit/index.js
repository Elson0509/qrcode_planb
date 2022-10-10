import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View,
} from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import MailDetails from '../../components/MailDetails'
import ModalSelectResident from '../../components/ModalSelectResident'
import FooterButtons from '../../components/FooterButtons';
import SelectButton from '../../components/SelectButton';
import THEME from '../../services/theme'
import CommentBox from '../../components/CommentBox';

const MailEdit = (props) => {
  const [loading, setLoading] = useState(false)
  const [mail] = useState(props.route.params)
  const [modal, setModal] = useState(false)
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState(2)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectUserText, setSelectedUserText] = useState('Selecionar morador')

  const selectResidentHandler = pickedUser => {
    setSelectedUser(pickedUser)
    setSelectedUserText(pickedUser.name)
    setModal(false)
  }

  const confirmHandler = async () => {
    if (await Utils.handleNoConnection()) return
    setLoading(true)
    api.post(`api/mail/${mail.id}`,
      {
        status: newStatus,
        delivered_to_user_id: selectedUser ? selectedUser.id : 0,
        notes_after_delivered: comment
      }
    )
    .then(()=> {
      Utils.toast('Baixa confirmada!')
      props.navigation.navigate('MailList')
    })
    .catch(err => {
      Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MA1)')
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  const cancelHandler = () => {
    props.navigation.navigate('MailList')
  }

  if (loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white" />
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.container}>
        <MailDetails
          mail={mail}
          noFooter
        />
        <View style={styles.viewButton}>
          {
            !!mail.Unit.Users.length &&
            <SelectButton
              action={() => setModal(true)}
              text={selectUserText}
              backgroundColor={'White'}
            />
          }
          <View style={styles.viewComment}>
            <SelectButton
              label='Novo Status:'
              action={() => setNewStatus(newStatus === 2 ? 3 : 2)}
              text={Constants.MAIL_STATUS_CODE[newStatus]}
              backgroundColor={'White'}
            />
          </View>
          <View style={styles.viewComment}>
            <CommentBox
              text="Observação:"
              value={comment}
              setValue={value => setComment(value)}
              backgroundColor={Constants.backgroundLightColors['White']}
              borderColor={Constants.backgroundDarkColors['MyQRCode']}
              colorInput={Constants.backgroundDarkColors['MyQRCode']}
            />
          </View>
          <FooterButtons
            title1='Confirmar'
            title2='Cancelar'
            fontSize={15}
            buttonPadding={15}
            viewPadding={0}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            action1={confirmHandler}
            action2={cancelHandler}
          />
        </View>
      </ScrollView>
      <ModalSelectResident
        modalVisible={modal}
        setModalVisible={setModal}
        users={mail.Unit.Users}
        selectResidentHandler={selectResidentHandler}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['Residents'],
    flex: 1,
  },
  container: {
    backgroundColor: Constants.backgroundLightColors['Residents'],
    flex: 1,
    borderRadius: 5,
  },
  errorMessage: {
    color: '#F77',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#F77',
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
  textDetail: {
    fontSize: 12,
    marginLeft: 7,
    fontFamily: THEME.FONTS.r400,
  },
  textField: {
    fontFamily: THEME.FONTS.r700,
  },
  viewButton: {
    paddingHorizontal: 15,
  },
  viewComment: {
    marginVertical: 8
  }
});

export default MailEdit