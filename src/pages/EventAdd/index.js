import React, {useState, useEffect} from 'react';
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
import CommentBox from '../../components/CommentBox';
import FooterButtons from '../../components/FooterButtons';

const EventAdd = props => {
    const [loading, setLoading] = useState(false)
    const [userBeingAdded, setUserBeingAdded] = useState(props.route?.params?.userBeingAdded || {title: '', place: '', description: '', pic: ''})
    const [errorMessage, setErrorMessage] = useState('')
    const [screen, setScreen]= useState(props.route?.params?.screen || 'EventAdd')
    
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

    const uploadImg = newId =>{
      const formData = new FormData()
      formData.append('img', {
        uri: userBeingAdded.pic,
        type: 'image/jpg',
        name:newId+'.jpg'
      })
      api.post(`api/user/image/${newId}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(res=>{
        console.log('success', res.data)
      })
      .catch(err=>{
        console.log('error', err.response)
      })
      
    }

    const photoClickHandler = _ => {
      props.navigation.navigate('CameraPic', {
        userBeingAdded, 
        user:props.route.params.user,
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
        setUserBeingAdded(prev=> {return {...prev, pic:compressed.uri}})
      }
    };

    const addHandler = _ => {
      if(!userBeingAdded.title){
        return setErrorMessage('Título não pode estar vazio.')
      }
      if(!userBeingAdded.place){
        return setErrorMessage('Local não pode estar vazio.')
      }
      if(!userBeingAdded.description){
        return setErrorMessage('Descrição não pode estar vazio.')
      }
      const MIN_TITLE_CHARACTERS = 5
      if(userBeingAdded.title.length <= MIN_TITLE_CHARACTERS){
        return setErrorMessage(`Título muito curto. Pelo menos ${MIN_TITLE_CHARACTERS} caracteres.`)
      }
      const MIN_PLACE_CHARACTERS = 3
      if(userBeingAdded.place.length <= MIN_PLACE_CHARACTERS){
        return setErrorMessage(`Local muito curto. Pelo menos ${MIN_PLACE_CHARACTERS} caracteres.`)
      }
      const MIN_DESCRIPTION_CHARACTERS = 10
      if(userBeingAdded.description.length <= MIN_DESCRIPTION_CHARACTERS){
        return setErrorMessage(`Descrição muito curta. Pelo menos ${MIN_DESCRIPTION_CHARACTERS} caracteres.`)
      }
      if(userBeingAdded.pic===''){
        return setErrorMessage('Uma foto é necessária.')
      }
      setLoading(true)
      api.post('api/occurrence', {
        title: userBeingAdded.title,
        place: userBeingAdded.place,
        description: userBeingAdded.description,
      })
      .then((res)=>{
        uploadImg(res.data.occurrenceRegistered.id)
        setErrorMessage('')
        Toast.show('Cadastro realizado', Constants.configToast)
        setUserBeingAdded({title: '', place: '', description: '', pic: ''})
      })
      .catch((err)=> {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (EA1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
      
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return (
        <SafeAreaView style={styles.body}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <InputBox 
              text="Título*:" 
              value={userBeingAdded.title} 
              changed={value=>setUserBeingAdded({...userBeingAdded, title:value})}
              backgroundColor={Constants.backgroundLightColors['Events']}
              borderColor={Constants.backgroundDarkColors['Events']}
              colorInput={Constants.backgroundDarkColors['Events']}
            />
            <InputBox 
              text="Local*:" 
              value={userBeingAdded.place} 
              changed={value=>setUserBeingAdded({...userBeingAdded, place:value})}
              backgroundColor={Constants.backgroundLightColors['Events']}
              borderColor={Constants.backgroundDarkColors['Events']}
              colorInput={Constants.backgroundDarkColors['Events']}
            />
            <CommentBox
              text="Descrição*:" 
              value={userBeingAdded.description} 
              setValue={value=>setUserBeingAdded({...userBeingAdded, description:value})}
              backgroundColor={Constants.backgroundLightColors['Events']}
              borderColor={Constants.backgroundDarkColors['Events']}
              colorInput={Constants.backgroundDarkColors['Events']}
              placeholder='Detalhes da ocorrência'
            />
            <Text style={styles.title}>Foto:</Text>
            {!userBeingAdded.pic &&
            <View style={styles.buttonAddPhotoGroup}>
                <TouchableOpacity
                  style={[styles.buttonAddphotoIsClicked]}
                  onPress={()=>{photoClickHandler()}}
                >
                  <Icon name="camera" size={18}/>
                  <Text>Câmera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonAddphotoIsClicked, {marginLeft: 40}]}
                  onPress={()=>{pickImage()}}
                >
                  <Icon name="paperclip" size={18}/>
                  <Text>Arquivo</Text>
                </TouchableOpacity>
            </View>
            ||
            <View style={styles.buttonAddPhotoGroup}>
              <Image
                style={{width: 66, height: 79,}}
                source={{uri: userBeingAdded.pic}}
              />
            </View>
            }
            {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            <FooterButtons
              title1="Adicionar"
              title2="Cancelar"
              buttonPadding={15}
              backgroundColor={Constants.backgroundColors['Events']}
              action1={addHandler}
              action2={props.navigation.goBack}
            />
          </ScrollView>
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Events'],
      minHeight:'100%'
    },
    errorMessage:{
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
    buttonAddPhotoGroup:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title:{
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 18
    },
    buttonAddphotoIsClicked:{
      borderRadius: 8,
      backgroundColor: Constants.backgroundLightColors['Events'],
      marginTop: 15,
      padding: 15,
      alignItems: 'center',
    },
  });

export default EventAdd