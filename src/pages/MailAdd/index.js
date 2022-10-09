import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import InputBox from '../../components/InputBox';
import CommentBox from '../../components/CommentBox';
import * as Constants from '../../services/constants'
import * as ImagePicker from 'expo-image-picker'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Icon from '../../components/Icon';
import FooterButtons from '../../components/FooterButtons';
import TakePic from '../../components/TakePic';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import SelectButton from '../../components/SelectButton';
import { useAuth } from '../../contexts/auth';

const MailAdd = props => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [tracker, setTracker] = useState('')
  const [comment, setComment] = useState('')
  const [pic, setPic] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isTakingPic, setIsTakingPic] = useState(false)
  const [blocos, setBlocos] = useState([])
  const [modalSelectBloco, setModalSelectBloco] = useState(false)
  const [modalSelectUnit, setModalSelectUnit] = useState(false)
  const [selectedBloco, setSelectedBloco] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [textButton, setTextButton] = useState('Selecionar Unidade')

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Desculpe, mas precisamos de permissão da câmera. Verifique as configurações.');
        }
      }
    })();
  }, []);

  //fetching blocos
  useEffect(() => {
    api.get(`api/condo/all/${user.condo_id}`)
      .then(res => {
        setBlocos(res.data)
        setLoading(false)
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RA1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const uploadImg = async newId => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (pic != '') {
      Utils.jpgToBase64(pic, dataUrl => {
        api.post(`api/upload`, {
          base64Image: dataUrl,
          fileName: newId,
          type: 'mail'
        })
          .then(res => {
            console.log('success', res.data)
          })
          .catch(err => {
            console.log('error', err.response)
          })
      })
    }
  }

  const selectBlocoHandler = bloco => {
    setSelectedBloco(bloco)
    setModalSelectBloco(false)
    setModalSelectUnit(true)
  }

  const photoClickHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    setIsTakingPic(true)
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(Constants.ImagePickerOptions);
    const compressed = await Utils.compressImage(result.uri)
    if (!result.cancelled) {
      setPic(compressed.uri)
    }
  };

  const photoTaken = photoUri => {
    setIsTakingPic(false)
    setPic(photoUri)
  }

  const selectUnitHandler = async unit => {
    setSelectedUnit(unit)
    setModalSelectUnit(false)
    setTextButton(`Bloco ${selectedBloco.name} Unidade ${unit.number}`)
  }

  const addHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!tracker) {
      return setErrorMessage('Rastreio não pode estar vazio.')
    }
    if(!selectedUnit){
      return setErrorMessage('É necessário selecionar uma unidade.')
    }
    setLoading(true)
    api.post('api/mail', {
      tracking_code: tracker,
      notes: comment,
      unit_id: selectedUnit.id
    })
      .then((res) => {
        uploadImg(res.data.mailRegistered.id)
        setErrorMessage('')
        Utils.toast('Cadastro realizado')
        props.navigation.goBack()
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (MA1)')
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
    isTakingPic ?
      <TakePic
        clicked={photoTaken}
      />
      :
      <SafeAreaView style={styles.body}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <InputBox
            text="Código de rastreio*:"
            value={tracker}
            changed={value => setTracker(value)}
            autoCapitalize='characters'
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <SelectButton
            action={()=>setModalSelectBloco(true)}
            text={textButton}
            backgroundColor='Residents'
          />
          <CommentBox
            text="Descrição:"
            value={comment}
            setValue={value => setComment(value)}
            backgroundColor={Constants.backgroundLightColors['MyQRCode']}
            borderColor={Constants.backgroundDarkColors['MyQRCode']}
            colorInput={Constants.backgroundDarkColors['MyQRCode']}
          //width={340}
          />
          <Text style={styles.title}>Foto:</Text>
          {!pic ?
            <View style={styles.buttonAddPhotoGroup}>
              <TouchableOpacity
                style={[styles.buttonAddphotoIsClicked]}
                onPress={() => { photoClickHandler() }}
              >
                <Icon name="camera" size={18} />
                <Text>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAddphotoIsClicked, { marginLeft: 40 }]}
                onPress={() => { pickImage() }}
              >
                <Icon name="paperclip" size={18} />
                <Text>Arquivo</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.buttonAddPhotoGroup}>
              <Image
                style={{ width: 66, height: 79, }}
                source={{ uri: pic }}
              />
            </View>
          }
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
        <ModalSelectBloco
          selectBlocoHandler={selectBlocoHandler}
          blocos={blocos}
          modalVisible={modalSelectBloco}
          setModalVisible={setModalSelectBloco}
        />
        <ModalSelectUnit
          bloco={selectedBloco}
          modalVisible={modalSelectUnit}
          setModalVisible={setModalSelectUnit}
          selectUnitHandler={selectUnitHandler}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['Residents'],
    flex: 1
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
  buttonAddPhotoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
  buttonAddphotoIsClicked: {
    borderRadius: 8,
    backgroundColor: Constants.backgroundLightColors['Residents'],
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
});

export default MailAdd