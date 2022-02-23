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
import * as Constants from '../../services/constants'
import * as ImagePicker from 'expo-image-picker'
import * as Utils from '../../services/util'
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import Icon from '../../components/Icon';
import FooterButtons from '../../components/FooterButtons';

const GuardAdd = props => {
  const [loading, setLoading] = useState(false)
  const [userBeingAdded, setUserBeingAdded] = useState(props.route?.params?.userBeingAdded || { id: "0", name: '', identification: '', company: '', email: '', pic: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [screen, setScreen] = useState(props.route?.params?.screen || 'GuardAdd')

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
    if (userBeingAdded.pic != '') {
      const formData = new FormData()
      formData.append('img', {
        uri: userBeingAdded.pic,
        type: 'image/jpg',
        name: newId + '.jpg'
      })
      api.post(`api/user/image/${newId}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(res => {
          console.log('success', res.data)
        })
        .catch(err => {
          console.log('error', err.response)
        })
    }
  }

  const photoClickHandler = _ => {
    props.navigation.navigate('CameraPic', {
      userBeingAdded,
      user: props.route.params.user,
      screen
    })
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    const compressed = await Utils.compressImage(result.uri)
    if (!result.cancelled) {
      setUserBeingAdded(prev => { return { ...prev, pic: compressed.uri } })
    }
  };

  const addHandler = _ => {
    if (!userBeingAdded.name) {
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if (!userBeingAdded.identification) {
      return setErrorMessage('Documento não pode estar vazio.')
    }
    if (!userBeingAdded.email) {
      return setErrorMessage('Email não pode estar vazio.')
    }
    if (!userBeingAdded.company) {
      return setErrorMessage('Empresa não pode estar vazio.')
    }
    if (!Utils.validateEmail(userBeingAdded.email)) {
      return setErrorMessage('Email não válido.')
    }
    if (!userBeingAdded.pic) {
      return setErrorMessage('É necessário adicionar uma foto.')
    }
    setLoading(true)
    api.post('api/user/signup', {
      name: userBeingAdded.name,
      condo_id: props.route.params.user.condo_id,
      user_kind_id: Constants.USER_KIND["GUARD"],
      identification: userBeingAdded.identification,
      email: userBeingAdded.email,
      company: userBeingAdded.company,
      userBeingAdded_id_last_modify: props.route.params.user.id,
    })
      .then((res) => {
        uploadImg(res.data.user.id)
        setErrorMessage('')
        Toast.show('Cadastro realizado', Constants.configToast)
        setUserBeingAdded({ id: "0", name: '', identification: '', company: '', email: '', pic: '' })
      })
      .catch((err) => {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GA1)', Constants.configToast)
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
          value={userBeingAdded.name}
          changed={value => setUserBeingAdded({ ...userBeingAdded, name: value })}
          autoCapitalize='words'
          backgroundColor={Constants.backgroundLightColors['Guards']}
          borderColor={Constants.backgroundDarkColors['Guards']}
          colorInput={Constants.backgroundDarkColors['Guards']}
        />
        <InputBox
          text="Documento*:"
          value={userBeingAdded.identification}
          autoCapitalize="characters"
          changed={value => setUserBeingAdded({ ...userBeingAdded, identification: value })}
          backgroundColor={Constants.backgroundLightColors['Guards']}
          borderColor={Constants.backgroundDarkColors['Guards']}
          colorInput={Constants.backgroundDarkColors['Guards']}
        />
        <InputBox
          text="Empresa*:"
          value={userBeingAdded.company}
          autoCapitalize="sentences"
          changed={value => setUserBeingAdded({ ...userBeingAdded, company: value })}
          backgroundColor={Constants.backgroundLightColors['Guards']}
          borderColor={Constants.backgroundDarkColors['Guards']}
          colorInput={Constants.backgroundDarkColors['Guards']}
        />
        <InputBox
          text="Email*:"
          value={userBeingAdded.email}
          autoCapitalize="none"
          keyboardType='email-address'
          changed={value => setUserBeingAdded({ ...userBeingAdded, email: value })}
          backgroundColor={Constants.backgroundLightColors['Guards']}
          borderColor={Constants.backgroundDarkColors['Guards']}
          colorInput={Constants.backgroundDarkColors['Guards']}
        />
        <Text style={styles.title}>Foto:</Text>
        {!userBeingAdded.pic ?
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
              source={{ uri: userBeingAdded.pic }}
            />
          </View>
        }
        {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <FooterButtons
          title1="Adicionar"
          title2="Cancelar"
          buttonPadding={15}
          backgroundColor={Constants.backgroundColors['Guards']}
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
    backgroundColor: Constants.backgroundColors['Guards'],
    minHeight: '100%'
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
    backgroundColor: Constants.backgroundLightColors['Guards'],
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
});

export default GuardAdd