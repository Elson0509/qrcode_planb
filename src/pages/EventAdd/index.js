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
import InputBox from '../../components/InputBox';
import * as Constants from '../../services/constants'
import * as ImagePicker from 'expo-image-picker'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Icon from '../../components/Icon';
import CommentBox from '../../components/CommentBox';
import FooterButtons from '../../components/FooterButtons';
import TakePic from '../../components/TakePic';
import Carousel from '../../components/Carousel';

const EventAdd = props => {
  const [loading, setLoading] = useState(false)
  const [userBeingAdded, setUserBeingAdded] = useState(props.route?.params?.userBeingAdded || { title: '', place: '', description: '', pic: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isTakingPic, setIsTakingPic] = useState(false)
  const [images, setImages] = useState([])

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
    if(await Utils.handleNoConnection(setLoading)) return
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    const compressed = await Utils.compressImage(result.uri)
    if (!result.cancelled) {
      setImages(prev => [...prev, compressed.uri])
    }
  };

  const addHandler = async _ => {
    if(await Utils.handleNoConnection(setLoading)) return
    if (!userBeingAdded.title) {
      return setErrorMessage('Título não pode estar vazio.')
    }
    if (!userBeingAdded.place) {
      return setErrorMessage('Local não pode estar vazio.')
    }
    if (!userBeingAdded.description) {
      return setErrorMessage('Descrição não pode estar vazio.')
    }
    const MIN_TITLE_CHARACTERS = 5
    if (userBeingAdded.title.length < MIN_TITLE_CHARACTERS) {
      return setErrorMessage(`Título muito curto. Pelo menos ${MIN_TITLE_CHARACTERS} caracteres.`)
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
      title: userBeingAdded.title,
      place: userBeingAdded.place,
      description: userBeingAdded.description,
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
            text="Título*:"
            value={userBeingAdded.title}
            changed={value => setUserBeingAdded({ ...userBeingAdded, title: value })}
            backgroundColor={Constants.backgroundLightColors['MyQRCode']}
            borderColor={Constants.backgroundDarkColors['MyQRCode']}
            colorInput={Constants.backgroundDarkColors['MyQRCode']}
          />
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
                <TouchableOpacity
                  style={[styles.buttonAddphotoIsClicked, { marginLeft: 40 }]}
                  onPress={() => { pickImage() }}
                >
                  <Icon name="paperclip" size={18} />
                  <Text>Arquivo</Text>
                </TouchableOpacity>
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
});

export default EventAdd