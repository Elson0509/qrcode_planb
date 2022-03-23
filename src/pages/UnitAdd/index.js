import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import InputBox from '../../components/InputBox';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import FooterButtons from '../../components/FooterButtons';
import ModalMessage from '../../components/ModalMessage';
import ModalSelectBlocoNewUnit from '../../components/ModalSelectBlocoNewUnit';
import api from '../../services/api'
import ModalAssistentAddUnit from '../../components/ModalAssistentAddUnit';
import ModalUnitsFound from '../../components/ModalUnitsFound';
import ModalNewSmartBloco from '../../components/ModalNewSmartBloco';
import { aptNumberAnalyse } from '../../services/util'

const UnitAdd = props => {
  const [block, setBlock] = useState('')
  const [apt, setApt] = useState('')
  const [modal, setModal] = useState(false)
  const [modalSelectBloco, setModalSelectBloco] = useState(true)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [blocosApi, setBlocosApi] = useState([])
  const [readonlyBloco, setReadonlyBloco] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState(null)
  const [modalAssistent, setModalAssistent] = useState(false)
  const [firstApt, setFirstAp] = useState('')
  const [lastApt, setLastAp] = useState('')
  const [errorAptMessage, setErrorAptMessage] = useState('')
  const [modalSuccessAptAnalyse, setModalSuccessAptAnalyse] = useState(false)
  const [aptsAnalysed, setAptsAnalysed] = useState([])
  const [modalNewBlockAnalysed, setModalNewBlockAnalysed] = useState(false)
  const [newBlockAnalysed, setNewBlockAnalysed] = useState('')
  const [errornewBlockAnalysedMessage, setErrornewBlockAnalysedMessage] = useState('')
  const [loadingAddingSmartBloco, setLoadingAddingSmartBloco] = useState(false)

  useEffect(() => {
    api.get(`/api/bloco/condo/${props.route.params.user.condo_id}`)
      .then(res => {
        const newBloco = [{ id: "0", name: 'Novo Bloco' }]
        setBlocosApi(newBloco.concat(res.data))
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const selectBlocoHandler = bloco => {
    setModalSelectBloco(false)
    if (bloco.id != '0') {
      setBlock(bloco.name)
      setSelectedBloco(bloco)
      setReadonlyBloco('0')
    }
    else {
      setSelectedBloco({ id: '0' })
      setModalAssistent(true)
    }
  }

  const confirmAptHandler = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    if (!firstApt || !lastApt) {
      return setErrorAptMessage('Por favor, complete os campos.')
    }
    const apts = aptNumberAnalyse(firstApt, lastApt)
    setAptsAnalysed(apts)
    setModalAssistent(false)
    if (apts) {
      //success
      setModalSuccessAptAnalyse(true)
    }
    else {
      //fail
      Utils.toast('Desculpe. Não foi possível sugerir unidades com a informação fornecida.')
    }
  }

  const confirmAptAnalysed = _ => {
    setModalSuccessAptAnalyse(false)
    setModalNewBlockAnalysed(true)
  }

  const addHandler = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    const errors = []
    if (!block) {
      errors.push('Bloco não pode estar vazio.')
    }
    if (!apt) {
      errors.push('Apartamento não pode estar vazio.')
    }
    if (errors.length) {
      setErrorMessage(errors.join('\n'))
      setModal(true)
    }
    else {
      setLoading(true)
      api.post('api/unit', {
        number: apt,
        bloco_id: selectedBloco.id,
        bloco_name: block,
        unit_kind_id: 1,
        user_id_last_modify: props.route.params.user.id,
        condo_id: props.route.params.user.condo_id,
      })
        .then((res) => {
          setApt('')
          Utils.toast(res.data.message)
        })
        .catch((err) => {
          Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA2)')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const confirmNewBlockAndUnits = _ => {
    if (!newBlockAnalysed) {
      return setErrornewBlockAnalysedMessage('Por favor, digite o nome do bloco')
    }
    setLoadingAddingSmartBloco(true)
    api.post('api/unit/bloco/smart', {
      bloco_name: newBlockAnalysed,
      units: aptsAnalysed
    })
      .then(res => {
        Utils.toast(res.data.message)
        setModalNewBlockAnalysed(false)
      })
      .catch(err => {
        setErrornewBlockAnalysedMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UAS2)')
      })
      .finally(() => {
        setLoadingAddingSmartBloco(false)
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
          text="Bloco:"
          value={block}
          changed={value => setBlock(value)}
          backgroundColor={Constants.backgroundLightColors['Units']}
          borderColor={Constants.backgroundDarkColors['Units']}
          colorInput={Constants.backgroundDarkColors['Units']}
          editable={readonlyBloco}
        />
        <InputBox
          text="Apartamento:"
          value={apt}
          changed={value => setApt(value)}
          autoCapitalize='characters'
          backgroundColor={Constants.backgroundLightColors['Units']}
          borderColor={Constants.backgroundDarkColors['Units']}
          colorInput={Constants.backgroundDarkColors['Units']}
        />
        <FooterButtons
          title1="Adicionar"
          title2="Cancelar"
          buttonPadding={15}
          backgroundColor={Constants.backgroundColors['Units']}
          action1={addHandler}
          action2={props.navigation.goBack}
        />
      </ScrollView>

      <ModalMessage
        message={errorMessage}
        title="Atenção"
        modalVisible={modal}
        setModalVisible={setModal}
      />
      <ModalSelectBlocoNewUnit
        blocos={blocosApi}
        backgroundItem={Constants.backgroundLightColors['Units']}
        modalVisible={modalSelectBloco}
        setModalVisible={setModalSelectBloco}
        selectBlocoHandler={selectBlocoHandler}
      />
      <ModalAssistentAddUnit
        modalVisible={modalAssistent}
        setModalVisible={setModalAssistent}
        first={firstApt}
        setfirst={setFirstAp}
        last={lastApt}
        setlast={setLastAp}
        confirmHandler={(ev) => confirmAptHandler(ev)}
        errorAptMessage={errorAptMessage}
      />
      <ModalUnitsFound
        modalVisible={modalSuccessAptAnalyse}
        setModalVisible={setModalSuccessAptAnalyse}
        aptsAnalysed={aptsAnalysed}
        confirmHandler={(ev) => confirmAptAnalysed(ev)}
      />
      <ModalNewSmartBloco
        modalVisible={modalNewBlockAnalysed}
        setModalVisible={setModalNewBlockAnalysed}
        newBlockAnalysed={newBlockAnalysed}
        setNewBlockAnalysed={setNewBlockAnalysed}
        loadingAddingSmartBloco={loadingAddingSmartBloco}
        confirmHandler={confirmNewBlockAndUnits}
        errornewBlockAnalysedMessage={errornewBlockAnalysedMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['Units'],
    minHeight: '100%'
  },
  fontTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    paddingBottom: 5,
    fontFamily: 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  box: {
    marginBottom: 20
  },
  borderBottomTitle: {
    borderBottomColor: 'white',
    borderBottomWidth: 3,
  },
  marginTop: {
    marginTop: 15,
  },
  borderTop: {
    borderTopColor: 'white',
    borderTopWidth: 1,
  },
  resultText: {
    paddingTop: 15,
    color: 'white',
    textAlign: 'center',
  },
  sizeText: {
    fontSize: 20
  },
  sizeResult: {
    fontSize: 40
  }
});

export default UnitAdd