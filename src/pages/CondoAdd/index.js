import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import InputBox from '../../components/InputBox';
import InputBool from '../../components/InputBool';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import api from '../../services/api'
import FooterButtons from '../../components/FooterButtons'
import THEME from '../../services/theme';

const CondoAdd = props => {
  const [loading, setLoading] = useState(false)
  const [condoBeingAdded, setCondoBeingAdded] = useState(props.route?.params?.condoBeingAdded || { id: "0", name: '', address: '', city: '', state: '', slots: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [guard_can_messages, setGuard_can_messages] = useState(true)
  const [guard_can_thirds, setGuard_can_thirds] = useState(true)
  const [guard_can_visitors, setGuard_can_visitors] = useState(true)
  const [resident_can_messages, setResident_can_messages] = useState(true)
  const [resident_can_ocorrences, setResident_can_ocorrences] = useState(true)
  const [resident_can_thirds, setResident_can_thirds] = useState(true)
  const [resident_can_visitors, setResident_can_visitors] = useState(true)
  const [resident_has_dob, setResident_has_dob] = useState(false)
  const [resident_has_owner_field, setResident_has_owner_field] = useState(false)
  const [resident_has_phone, setResident_has_phone] = useState(false)
  const [guard_see_dob, setGuard_see_dob] = useState(false)
  const [guard_see_phone, setGuard_see_phone] = useState(false)
  const [condo_has_classifieds, setCondo_has_classifieds] = useState(false)
  const [condo_has_guard_routes, setCondo_has_guard_routes] = useState(false)
  const [condo_has_mail, setCondo_has_mail] = useState(false)
  const [condo_has_news, setCondo_has_news] = useState(false)
  const [condo_has_reservations, setCondo_has_reservations] = useState(false)

  const addHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!condoBeingAdded.name) {
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if (!condoBeingAdded.address) {
      return setErrorMessage('Endereço não pode estar vazio.')
    }
    if (!condoBeingAdded.city) {
      return setErrorMessage('Cidade não pode estar vazio.')
    }
    if (!condoBeingAdded.state) {
      return setErrorMessage('Estado não pode estar vazio.')
    }
    if (isNaN(condoBeingAdded.slots) || !condoBeingAdded.slots || Number(condoBeingAdded.slots) < 0) {
      return setErrorMessage('Quantidade de vagas inválida.')
    }
    setLoading(true)
    api.post('api/condo', {
      name: condoBeingAdded.name,
      address: condoBeingAdded.address,
      city: condoBeingAdded.city,
      state: condoBeingAdded.state,
      slots: condoBeingAdded.slots,
      guard_can_messages,
      guard_can_thirds,
      guard_can_visitors,
      resident_can_messages,
      resident_can_ocorrences,
      resident_can_thirds,
      resident_can_visitors,
      resident_has_dob,
      resident_has_owner_field,
      resident_has_phone,
      guard_see_dob,
      guard_see_phone,
      condo_has_classifieds,
      condo_has_guard_routes,
      condo_has_mail,
      condo_has_news,
      condo_has_reservations,
    })
      .then((res) => {
        setErrorMessage('')
        Utils.toast('Cadastro realizado')
        setCondoBeingAdded({ id: "0", name: '', address: '', city: '', state: '', slots: '' })
        props.navigation.navigate('CondoList')
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CoA1)')
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
      <ScrollView keyboardShouldPersistTaps="handled">
        <InputBox
          text="Nome*:"
          value={condoBeingAdded.name}
          changed={value => setCondoBeingAdded({ ...condoBeingAdded, name: value })}
          autoCapitalize='words'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox
          text="Endereço*:"
          value={condoBeingAdded.address}
          changed={value => setCondoBeingAdded({ ...condoBeingAdded, address: value })}
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox
          text="Cidade*:"
          value={condoBeingAdded.city}
          changed={value => Utils.testWordWithNoSpecialChars(value) && setCondoBeingAdded({ ...condoBeingAdded, city: value })}
          autoCapitalize='words'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox
          text="Estado*:"
          value={condoBeingAdded.state}
          changed={value => Utils.testWordWithNoSpecialChars(value) && setCondoBeingAdded({ ...condoBeingAdded, state: value })}
          autoCapitalize='characters'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <InputBox
          text="Vagas de estacionamento*:"
          keyboard='numeric'
          value={condoBeingAdded.slots}
          changed={value => setCondoBeingAdded({ ...condoBeingAdded, slots: value })}
          autoCapitalize='characters'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
        />
        <View>
          <Text style={{ fontFamily: THEME.FONTS.r700, fontSize: 20, textAlign: 'center', marginTop: 10 }}>Permissões</Text>
          <Text style={{ fontFamily: THEME.FONTS.r700, fontSize: 17, marginLeft: 5 }}>Colaboradores</Text>
          <InputBool
            text="Pode enviar mensagens?"
            value={guard_can_messages}
            changed={() => setGuard_can_messages(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Pode cadastrar terceirizados?"
            value={guard_can_thirds}
            changed={() => setGuard_can_thirds(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Pode cadastrar visitantes?"
            value={guard_can_visitors}
            changed={() => setGuard_can_visitors(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Podem ver telefone de moradores?"
            value={guard_see_phone}
            changed={() => setGuard_see_phone(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Podem ver nascimento de moradores?"
            value={guard_see_dob}
            changed={() => setGuard_see_dob(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <Text style={{ fontFamily: THEME.FONTS.r700, fontSize: 17, marginLeft: 5, marginTop: 10 }}>Moradores</Text>
          <InputBool
            text="Pode enviar mensagens?"
            value={resident_can_messages}
            changed={() => setResident_can_messages(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Pode cadastrar terceirizados?"
            value={resident_can_thirds}
            changed={() => setResident_can_thirds(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Pode cadastrar visitantes?"
            value={resident_can_visitors}
            changed={() => setResident_can_visitors(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Pode cadastrar ocorrências?"
            value={resident_can_ocorrences}
            changed={() => setResident_can_ocorrences(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possuem campo de alugado/dono?"
            value={resident_has_owner_field}
            changed={() => setResident_has_owner_field(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possuem telefone?"
            value={resident_has_phone}
            changed={() => setResident_has_phone(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possuem data de nascimento?"
            value={resident_has_dob}
            changed={() => setResident_has_dob(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <Text style={{ fontFamily: THEME.FONTS.r700, fontSize: 17, marginLeft: 5, marginTop: 10 }}>Condomínio</Text>
          <InputBool
            text="Possui controle de correspondência?"
            value={condo_has_mail}
            changed={() => setCondo_has_mail(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possui classificados?"
            value={condo_has_classifieds}
            changed={() => setCondo_has_classifieds(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possui ronda de vigilantes?"
            value={condo_has_guard_routes}
            changed={() => setCondo_has_guard_routes(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possui notícias?"
            value={condo_has_news}
            changed={() => setCondo_has_news(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBool
            text="Possui reservas?"
            value={condo_has_reservations}
            changed={() => setCondo_has_reservations(prev => !prev)}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
        </View>
        {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <FooterButtons
          title1="Adicionar"
          title2="Cancelar"
          buttonPadding={15}
          backgroundColor={Constants.backgroundColors['Residents']}
          action1={addHandler}
          action2={props.navigation.goBack}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['Residents'],
    flex: 1,
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
});

export default CondoAdd