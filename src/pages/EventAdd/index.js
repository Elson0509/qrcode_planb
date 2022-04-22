import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import InputBox from '../../components/InputBox'
import * as Constants from '../../services/constants'
import * as ImagePicker from 'expo-image-picker'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Icon from '../../components/Icon'
import CommentBox from '../../components/CommentBox'
import FooterButtons from '../../components/FooterButtons'
import ModalSelectOccurrenceType from '../../components/ModalSelectOccurrenceType'
import TakePic from '../../components/TakePic'
import Carousel from '../../components/Carousel'
import { useAuth } from '../../contexts/auth'
import THEME from '../../services/theme'

const EventAdd = props => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userBeingAdded, setUserBeingAdded] = useState(props.route?.params?.userBeingAdded || { title: '', place: '', description: '', pic: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isTakingPic, setIsTakingPic] = useState(false)
  const [images, setImages] = useState([])
  const [titles, setTitles] = useState([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [modalSelectTitle, setModalSelectTitle] = useState(false)

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

  useEffect(() => {
    api.get('api/occurrencetype')
      .then(res => {
        setTitles(res.data)
        setSelectedTitle(res.data[0])
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde.')
      })
      .finally(() => {
        setLoading(false)
      })

  }, [])

  const uploadImg = newId => {
    if (images.length && images.length <= 5) {
      images.forEach((image, index) =>
        Utils.jpgToBase64(image, dataUrl => {
          api.post(`api/upload`, {
            base64Image: dataUrl,
            fileName: newId,
            type: 'occurrence',
            index
          })
            .then(res => {
              console.log('success', res.data)
            })
            .catch(err => {
              console.log('error', err.response)
            })
        })
      )
    }
  }

  const photoTaken = photoUri => {
    setIsTakingPic(false)
    if (images.length < 5) {
      setImages(prev => [...prev, photoUri])
    }
  }

  const photoClickHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (images.length < 5) {
      setIsTakingPic(true)
    }
  }

  const removePhoto = index => {
    const newListImages = [...images]
    newListImages.splice(index, 1)
    setImages(newListImages)
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(Constants.ImagePickerOptions);
    const compressed = await Utils.compressImage(result.uri)
    if (!result.cancelled) {
      setImages(prev => [...prev, compressed.uri])
    }
  };

  const addHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!userBeingAdded.place) {
      return setErrorMessage('Local não pode estar vazio.')
    }
    if (!userBeingAdded.description) {
      return setErrorMessage('Descrição não pode estar vazio.')
    }
    const MIN_PLACE_CHARACTERS = 3
    if (userBeingAdded.place.length < MIN_PLACE_CHARACTERS) {
      return setErrorMessage(`Local muito curto. Pelo menos ${MIN_PLACE_CHARACTERS} caracteres.`)
    }
    const MIN_DESCRIPTION_CHARACTERS = 10
    if (userBeingAdded.description.length < MIN_DESCRIPTION_CHARACTERS) {
      return setErrorMessage(`Descrição muito curta. Pelo menos ${MIN_DESCRIPTION_CHARACTERS} caracteres.`)
    }
    // if(userBeingAdded.pic===''){
    //   return setErrorMessage('Uma foto é necessária.')
    // }
    setLoading(true)
    api.post('api/occurrence', {
      place: userBeingAdded.place,
      description: userBeingAdded.description,
      occurrence_type_id: selectedTitle.id,
    })
      .then((res) => {
        uploadImg(res.data.occurrenceRegistered.id)
        setErrorMessage('')
        props.navigation.navigate('Dashboard')
        Utils.toast('Cadastro realizado')
        setUserBeingAdded({ title: '', place: '', description: '', pic: '' })
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EA1)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const selectTitleHandler = data => {
    setSelectedTitle(data)
    setModalSelectTitle(false)
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
          <Text style={[styles.labelStyle, {color: 'black', fontFamily: THEME.FONTS.r700}]}>Título*:</Text>
          <TouchableOpacity onPress={()=>setModalSelectTitle(true)}>
            <View style={{backgroundColor: Constants.backgroundLightColors['MyQRCode'], alignItems: 'center', justifyContent: 'center', borderRadius: 6,}}>
              <Text style={styles.txtInput}>
                  {selectedTitle.type}
              </Text>
            </View>
          </TouchableOpacity>
          <InputBox
            text="Local*:"
            value={userBeingAdded.place}
            changed={value => setUserBeingAdded({ ...userBeingAdded, place: value })}
            backgroundColor={Constants.backgroundLightColors['MyQRCode']}
            borderColor={Constants.backgroundDarkColors['MyQRCode']}
            colorInput={Constants.backgroundDarkColors['MyQRCode']}
          />
          <CommentBox
            text="Descrição*:"
            value={userBeingAdded.description}
            setValue={value => setUserBeingAdded({ ...userBeingAdded, description: value })}
            backgroundColor={Constants.backgroundLightColors['MyQRCode']}
            borderColor={Constants.backgroundDarkColors['MyQRCode']}
            colorInput={Constants.backgroundDarkColors['MyQRCode']}
            placeholder='Detalhes da ocorrência'
            width={340}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>Fotos:</Text>
            {images.length < 5 &&
              <View style={styles.buttonAddPhotoGroup}>
                <TouchableOpacity
                  style={[styles.buttonAddphotoIsClicked]}
                  onPress={() => { photoClickHandler() }}
                >
                  <Icon name="camera" size={18} />
                  <Text>Câmera</Text>
                </TouchableOpacity>
                {
                  user.user_kind === Constants.USER_KIND.GUARD ?
                    null 
                    :
                    <TouchableOpacity
                      style={[styles.buttonAddphotoIsClicked, { marginLeft: 40 }]}
                      onPress={() => { pickImage() }}
                    >
                      <Icon name="paperclip" size={18} />
                      <Text>Arquivo</Text>
                    </TouchableOpacity>
                }
              </View>
            }
            {
              images.length ?
                <Carousel
                  images={images}
                  removePhoto={removePhoto}
                />
                :
                null
            }
          </View>
          {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          <FooterButtons
            title1="Adicionar"
            title2="Cancelar"
            buttonPadding={15}
            backgroundColor={Constants.backgroundColors['MyQRCode']}
            action1={addHandler}
            action2={props.navigation.goBack}
          />
        </ScrollView>
        {
          !!titles.length &&
          <ModalSelectOccurrenceType
            titles={titles}
            modalVisible={modalSelectTitle}
            setModalVisible={setModalSelectTitle}
            selectHandler={selectTitleHandler}
            backgroundItem={Constants.backgroundLightColors['MyQRCode']}
          />
        }
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['MyQRCode'],
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
    backgroundColor: Constants.backgroundLightColors['MyQRCode'],
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  labelStyle:{
    fontSize:15,
    marginBottom:5,
    marginLeft:5,
    color:'white'
  },
  txtInput:{
    width:'100%',
    borderWidth:Constants.borderTextInputWidth,
    borderColor: Constants.backgroundDarkColors['MyQRCode'],
    fontSize: 14,
    textAlign:'left',
    paddingLeft: 10,
    height: 45,
    letterSpacing: 1,
    paddingTop: 10,
    fontFamily: THEME.FONTS.r500,
    color: Constants.backgroundDarkColors['MyQRCode'],
    borderRadius: 6,
  },
});

export default EventAdd