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
import FooterButtons from '../../components/FooterButtons'
import PicUser from '../../components/PicUser'
import TakePic from '../../components/TakePic'
import { useAuth } from '../../contexts/auth'
import DOBInputBox from '../../components/DOBInputBox'

const EditResident = props => {
  const { user } = useAuth()

  const dob = props.route.params.resident.dob ? new Date(props.route.params.resident.dob) : null
  const [userEdit, setUserEdit] = useState({ name: props.route.params.resident.name, id: props.route.params.resident.id, identification: props.route.params.resident.identification ?? '', email: props.route.params.resident.email ?? '', photo_id: props.route.params.resident.photo_id ?? '', phone: props.route.params.resident.phone ?? '',   })
  const [dobBeingAdded, setDobBeingAdded] = useState({ day: dob ? dob.getDate() : null, month: dob ? dob.getMonth() + 1 : null, year: dob ? dob.getFullYear() : null })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [pic, setPic] = useState(false)
  const [isTakingPic, setIsTakingPic] = useState(false)
  const [editable] = useState(!!props.route.params.resident.email ? '0' : '1')

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

  const uploadImg = async newId => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('img', {
        uri: pic.pic,
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
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const photoTaken = photoUri => {
    setIsTakingPic(false)
    setPic({ pic: photoUri })
  }

  const photoClickHandler = async _ => {
    setIsTakingPic(true)
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(Constants.ImagePickerOptions);
    const compressed = await Utils.compressImage(result.uri)
    if (!result.cancelled) {
      setPic({ pic: compressed.uri })
    }
  };

  const addHandler = async _ => {
    if (await Utils.handleNoConnection(setLoading)) return
    if (!userEdit.name) {
      return setErrorMessage('Nome não pode estar vazio.')
    }
    if (userEdit.name.length < Constants.MIN_NAME_SIZE) {
      setErrorAddResidentMessage(`Nome deve ter no mínimo ${Constants.MIN_NAME_SIZE} caracteres.`)
      return false
    }
    if (userEdit.email && !Utils.validateEmail(userEdit.email)) {
      return setErrorMessage('Email não é válido.')
    }
    if (!!userEdit.phone && !Utils.phone_validation(userEdit.phone)) {
      return setErrorMessage('Telefone não válido.')
    }
    if ((!!dobBeingAdded.day || !!dobBeingAdded.year) && !Utils.isValidDate(dobBeingAdded.day, dobBeingAdded.month, dobBeingAdded.year)) {
      return setErrorMessage('Data não é válida.')
    }
    const dob = user.condo.resident_has_dob && !!dobBeingAdded.day && !!dobBeingAdded.year ? new Date(dobBeingAdded.year, dobBeingAdded.month - 1, dobBeingAdded.day, 0, 0, 0) : null
    if((!!dobBeingAdded.day || !!dobBeingAdded.year) && dob > new Date()){
      return setErrorMessage('Data não é válida.')
    }
    setLoading(true)
    api.put(`api/user/${userEdit.id}`, {
      name: userEdit.name,
      email: userEdit.email,
      identification: userEdit.identification,
      phone: userEdit.phone,
      dob
    })
      .then(() => {
        if (pic) {
          uploadImg(userEdit.id)
            .then(res => {
              setLoading(false)
              Utils.toast('Dados atualizados com sucesso.')
              props.navigation.navigate('ResidentList')
            })
        }
        else {
          setLoading(false)
          Utils.toast('Dados atualizados com sucesso.')
          props.navigation.navigate('ResidentList')
        }
      })
      .catch((err) => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (ER1)')
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
            text="Nome*:"
            value={userEdit.name}
            changed={value => Utils.testWordWithNoSpecialChars(value) && setUserEdit({ ...userEdit, name: value })}
            autoCapitalize='words'
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Identidade:"
            value={userEdit.identification}
            autoCapitalize="characters"
            changed={value => setUserEdit({ ...userEdit, identification: value })}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Email:"
            value={userEdit.email}
            autoCapitalize="none"
            keyboardType='email-address'
            changed={value => setUserEdit({ ...userEdit, email: value })}
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
            editable={editable}
          />
          {
            user.condo.resident_has_phone &&
            <InputBox
              text="Telefone:"
              value={userEdit.phone}
              changed={value => setUserEdit({ ...userEdit, phone: value })}
              autoCapitalize='none'
              placeholder='(XX) 90000-0000'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
          }
          {
            user.condo.resident_has_dob &&
            <DOBInputBox
              changed1={value => setDobBeingAdded({ ...dobBeingAdded, day: value })}
              changed2={value => setDobBeingAdded({ ...dobBeingAdded, month: value })}
              changed3={value => setDobBeingAdded({ ...dobBeingAdded, year: value })}
              text='Nascimento:'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
              value1={dobBeingAdded.day}
              value2={dobBeingAdded.month}
              value3={dobBeingAdded.year}
            />
          }
          <Text style={styles.title}>Foto:</Text>
          {
            !pic &&
            <View style={styles.buttonAddPhotoGroup}>
              <PicUser user={userEdit} height={140} width={100} />
            </View>
          }
          {
            !!pic &&
            <View style={styles.buttonAddPhotoGroup}>
              <PicUser user={pic} height={140} width={100} />
            </View>
          }

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

          {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          <FooterButtons
            title1="Atualizar"
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

export default EditResident