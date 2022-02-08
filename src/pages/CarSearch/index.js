import React, {useState, Fragment, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    CheckBox,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
    Image,
    RefreshControl,
    ActivityIndicator,
    View,
    Text,
  } from 'react-native';
import * as Constants from '../../services/constants'
import Placa from '../../components/Placa';
import Icon from '../../components/Icon';
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import CommentBox from '../../components/CommentBox';
import InputBox from '../../components/InputBox';
import FooterButtons from '../../components/FooterButtons';
import * as ImagePicker from 'expo-image-picker'

const CarSearch = props => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [checked, setChecked] = useState(false)
    const [is_registered_vehicle, setIs_registered_vehicle] = useState(false)
    const [comment, setComment] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [plateFilter, setPlateFilter] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{
      fetchUsers()
      const willFocusSubscription = props.navigation.addListener('focus', ()=> {
        fetchUsers()
      })
      return willFocusSubscription
    }, [])

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

    const fetchUsers = _ => {
      api.get(`api/vehicle/condo/${props.route.params.user.condo_id}`)
      .then(resp=>{
        setCars(resp.data)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CS1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const filterData = _ => {
      if(!plateFilter)
        return []
      let filteredData = cars

      if(!!plateFilter){
        filteredData = filteredData.filter(el => {
          return el.plate.trim().toLowerCase().indexOf(plateFilter.trim().toLowerCase()) >=0
        })
      }
      return filteredData
    }

    const onRefreshHandler = _ =>{
      setRefreshing(true)
      fetchUsers()
      setRefreshing(false)
    }

    const photoClickHandler = _ => {
      props.navigation.navigate('CameraPic', {
        user:props.route.params.user,
        screen: 'CarSearch',
        userBeingAdded: {}
      })
    }

    const uploadImg = newId =>{
      if(props.route?.params?.pic){
        const formData = new FormData()
        formData.append('img', {
          uri: props.route.params.pic,
          type: 'image/jpg',
          name:newId+'.jpg'
        })
        api.post(`api/overnight/image/${newId}`, formData, {
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

    const confirmHandler = _ => {
      if(!props.route?.params?.pic){
        return setErrorMessage('É necessário tirar uma foto.')
      }
      setErrorMessage('')
      api.post('api/overnight', {
        description: comment,
        is_registered_vehicle
      })
      .then((res)=> {
        uploadImg(res.data.overnightRegistered.id)
        setErrorMessage('')
        setComment('')
        setPlateFilter('')
        setChecked(false)
        props.navigation.navigate('Dashboard')
        Toast.show('Informação registrada.', Constants.configToast)
        
      })
      .catch((err)=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (CS1)', Constants.configToast)
      })
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return (
        <KeyboardAvoidingView style={styles.body}>
          <View style={{paddingHorizontal: 10}}>
            <InputBox
              text='Placa:'
              colorLabel='black'
              backgroundColor={Constants.backgroundLightColors['Cars']}
              borderColor={Constants.backgroundDarkColors['Cars']}
              colorInput={Constants.backgroundDarkColors['Cars']}
              autoCapitalize='characters'
              value={plateFilter}
              changed={(val=>setPlateFilter(val))}
            />
          </View>
          {
            (filterData().length==0 && !!plateFilter.trim()) || (
            <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
              <CheckBox
                value={checked}
                onValueChange={setChecked}
              />
              <Text style={{color: 'white'}}>Registrar ocorrência?</Text>
            </View>
            )
          }
          { filterData().length>0 &&
            <FlatList
              data={filterData()}
              keyExtractor={item=>item.id}
              style={{marginBottom: 80, paddingRight:10}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={()=> onRefreshHandler()}
                />
              }
              renderItem={(obj)=>{
                  return (
                    <View 
                      style={styles.menuItem} 
                    >
                      <Text style={styles.listText}>Bloco {obj.item.Unit.Bloco.name} Unidade {obj.item.Unit.number}</Text>
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{maxWidth: 500}}>
                          <Text>{`${obj.item.maker} ${obj.item.model} ${obj.item.color}`}</Text>
                        </View> 
                        <Placa placa={`${obj.item.plate}`}/>  
                      </View>
                    </View>
                  )
              }}
            />
          }
          {((filterData().length==0 && !!plateFilter.trim()) || checked) && (
            <View>
              <Text style={{textAlign:'center', marginBottom: 8, marginTop: 15, fontWeight: 'bold'}}>Reportar veículo</Text>
              <CommentBox value={comment} setValue={setComment} placeholder='Detalhes da ocorrência' width={340}/>
              <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: "center", justifyContent: "center", borderWidth: 1, padding: 12, backgroundColor: Constants.backgroundLightColors['Cars']}}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Veículo está cadastrado?</Text>
                <TouchableOpacity onPress={()=>setIs_registered_vehicle(prev=>!prev)} style={{padding: 8, borderColor: 'black', borderWidth: 1, borderRadius: 5 ,marginLeft: 12, backgroundColor: is_registered_vehicle ? '#8F8' : '#F88'}}>
                  <Text>{is_registered_vehicle ? 'Sim' : 'Não'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                {
                  !props.route?.params?.pic && <TouchableOpacity
                    style={[styles.buttonAddphotoIsClicked, {borderColor: Constants.backgroundDarkColors['Cars'], borderWidth: 1}]}
                    onPress={()=>{photoClickHandler()}}
                  >
                    <Icon name="camera" size={20} color={Constants.backgroundDarkColors['Cars']}/>
                    <Text style={{color: Constants.backgroundDarkColors['Cars']}}>Câmera</Text>
                  </TouchableOpacity> 
                  ||
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                    <Image
                      style={{width: 107, height: 127}}
                      source={{uri: props.route.params.pic}}
                    />
                  </View>
                }
                {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
              </View>
              <FooterButtons
                title1='Enviar'
                title2='Cancelar'
                action1={confirmHandler}
                action2={()=> props.navigation.navigate('Dashboard')}
                backgroundColor={Constants.backgroundColors['Cars']}
                buttonPadding={15}
                fontSize={18}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      );
}

const styles = StyleSheet.create({
  body:{
    padding:10,
    backgroundColor: Constants.backgroundColors['Cars'],
    minHeight:'100%'
  },
  menuItem:{
    borderWidth: 1,
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Cars'],
    borderRadius: 20,
    marginBottom: 10,
  },
  listText:{
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign:'center'
  },
  buttonAddphotoIsClicked:{
    borderRadius: 8,
    backgroundColor: Constants.backgroundLightColors['Cars'],
    marginTop: 15,
    padding: 15,
    width: 100,
    alignItems: 'center',
  },
  errorMessage:{
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'red',
    padding: 5,
  }
});

export default CarSearch