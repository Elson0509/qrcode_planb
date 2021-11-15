import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    ActivityIndicator
  } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import Icon from '../../components/Icon';
import InputBox from '../../components/InputBox';
import ModalSelectCondo from '../../components/ModalSelectCondo';
import FooterButtons from '../../components/FooterButtons';
import Toast from 'react-native-root-toast';
import api from '../../services/api';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SindicoAdd = props => {
    const [modal, setModal] = useState(false)
    const [condos, setCondos] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalSelectCondo, setModalSelectCondo] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [userBeingAdded, setUserBeingAdded]= useState({id: "0", name: '', identification: '', email: '', condo: null, pic: ''})
    const [screen, setScreen]= useState(props.route?.params?.screen || 'SindicoAdd')

    //fetching condos
    useEffect(()=>{
      fetchCondos()
    },[])

    const fetchCondos = _ => {
      api.get(`api/condo`)
      .then(resp=>{
        setCondos(resp.data)
        console.log(resp.data)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SA1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

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

    const selectCondoHandler = condo => {
      setUserBeingAdded({...userBeingAdded, condo: condo})
      setModalSelectCondo(false)
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

    const uploadImg = newId =>{
      if(userBeingAdded.pic!=''){
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
    }

    const confirmHandler = _ =>{
      if(!userBeingAdded.name){
        return setErrorMessage('Nome não pode estar vazio.')
      }
      if(!userBeingAdded.email){
        return setErrorMessage('Email não pode estar vazio.')
      }
      if(!userBeingAdded.condo){
        return setErrorMessage('Selecione um condomínio.')
      }
      if(!Utils.validateEmail(userBeingAdded.email)){
        return setErrorMessage('Email não válido.')
      }

      setLoading(true)
      api.post('api/user/signup', {
        name: userBeingAdded.name,
        condo_id: userBeingAdded.condo.id,
        user_kind_id: Constants.USER_KIND["SUPERINTENDENT"],
        identification: userBeingAdded.identification,
        email: userBeingAdded.email,
        userBeingAdded_id_last_modify: props.route.params.user.id,
      })
      .then((res)=>{
        uploadImg(res.data.userId)
        setErrorMessage('')
        Toast.show('Cadastro realizado', Constants.configToast)
        setUserBeingAdded({id: "0", name: '', identification: '', email: '', pic: ''})
      })
      .catch((err)=> {
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GA1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const cancelAddResidentHandler = _ => {
      setUserBeingAdded({id: '0', name: '', identification: '', email: '', pic: ''})
    }

    const photoClickHandler = _ => {
      props.navigation.navigate('CameraPic', {
        userBeingAdded, 
        selectedBloco: null, 
        selectedUnit: null, 
        vehicles: null, 
        residents: null, 
        user:props.route.params.user,
        screen: 'SindicoAdd'
      })
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return(
      <SafeAreaView style={styles.body}>
        <ScrollView style={{flex: 1, padding:10,}} keyboardShouldPersistTaps="handled">
          <InputBox 
            text="Nome*:" 
            value={userBeingAdded.name} 
            changed={value=>setUserBeingAdded({...userBeingAdded, name:value})}
            autoCapitalize='words'
            backgroundColor={Constants.backgroundLightColors['Visitors']}
            borderColor={Constants.backgroundDarkColors['Visitors']}
            colorInput={Constants.backgroundDarkColors['Visitors']}
          />
          <InputBox 
            text="Identidade:" 
            value={userBeingAdded.identification} 
            changed={value=>setUserBeingAdded({...userBeingAdded, identification:value})}
            autoCapitalize='characters'
            backgroundColor={Constants.backgroundLightColors['Visitors']}
            borderColor={Constants.backgroundDarkColors['Visitors']}
            colorInput={Constants.backgroundDarkColors['Visitors']}
          />
          <InputBox 
            text="Email*:" 
            value={userBeingAdded.email} 
            changed={value=>setUserBeingAdded({...userBeingAdded, email:value})}
            autoCapitalize='none'
            backgroundColor={Constants.backgroundLightColors['Visitors']}
            borderColor={Constants.backgroundDarkColors['Visitors']}
            colorInput={Constants.backgroundDarkColors['Visitors']}
          />
          <TouchableOpacity onPress={()=>setModalSelectCondo(true)}>
            <View style={{marginTop: 10}}>
              <Text style={{
                textAlign: 'center',
                borderWidth: 1,
                padding: 10,
                backgroundColor: Constants.backgroundDarkColors['Visitors'],
                borderRadius: 10,
                color: 'white', 
                fontSize: 16}}
                >
                  {!!userBeingAdded.condo && 'Condomínio Selecionado' || 'Selecionar Condomínio'}
                {
                  !!userBeingAdded.condo && 
                  <Text style={{textAlign: 'center', fontSize: 13}}>{'\n' + userBeingAdded.condo.name}</Text>
                }
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor={Constants.backgroundColors['Visitors']}
              action1={confirmHandler}
              action2={props.navigation.goBack}
            />
        </ScrollView>
        <ModalMessage
          message={errorMessage}
          title="Atenção"
          modalVisible={modal}
          setModalVisible={setModal}
        />
        <ModalSelectCondo
          selectCondoHandler={selectCondoHandler}
          condos={condos}
          modalVisible={modalSelectCondo}
          setModalVisible={setModalSelectCondo}
        />

      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body:{
      backgroundColor: Constants.backgroundColors['Visitors'],
      flex: 1
    },
    fontTitle:{
      textAlign:'center',
      color:'white',
      fontSize:16,
      paddingBottom: 5,
      fontFamily:'serif',
      fontWeight:'bold',
      letterSpacing:2,
    },
    box:{
      marginBottom: 20
    },
    borderBottomTitle:{
      borderBottomColor:'white',
      borderBottomWidth: 3,
    },
    marginTop:{
      marginTop:15,
    },
    borderTop:{
      borderTopColor:'white',
      borderTopWidth: 1,
    },
    resultText:{
      paddingTop: 15,
      color:'white',
      textAlign:'center',
    },
    sizeText:{
      fontSize:20
    },
    sizeResult:{
      fontSize:40
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
    buttonAddphotoIsClicked:{
      borderRadius: 8,
      backgroundColor: Constants.backgroundLightColors['Visitors'],
      marginTop: 15,
      padding: 15,
      alignItems: 'center',
    },
    buttonAddPhotoGroup:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
  });

export default SindicoAdd