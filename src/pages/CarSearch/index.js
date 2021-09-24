import React, {useState, Fragment, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
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

const CarSearch = props => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [plateFilter, setPlateFilter] = useState('')

    useEffect(()=>{
      fetchUsers()
      const willFocusSubscription = props.navigation.addListener('focus', ()=> {
        fetchUsers()
      })
      return willFocusSubscription
    }, [])

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
      console.log('photo')
    }

    const confirmHandler = _ => {
      console.log('confirm')
    }

    const cancelHandler = _ => {
      console.log('cancel')
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
          {filterData().length==0 && !!plateFilter.trim() && (
            <View>
              <Text style={{textAlign:'center', marginBottom: 8, marginTop: 15, fontWeight: 'bold'}}>Registrar veículo não autorizado</Text>
              <CommentBox value={comment} setValue={setComment} placeholder='Detalhes da ocorrência'/>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={[styles.buttonAddphotoIsClicked, {borderColor: Constants.backgroundDarkColors['Cars'], borderWidth: 1}]}
                  onPress={()=>{photoClickHandler()}}
                >
                  <Icon name="camera" size={20} color={Constants.backgroundDarkColors['Cars']}/>
                  <Text style={{color: Constants.backgroundDarkColors['Cars']}}>Câmera</Text>
                </TouchableOpacity>
              </View>
              <FooterButtons
                title1='Enviar'
                title2='Cancelar'
                action1={confirmHandler}
                action2={cancelHandler}
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
});

export default CarSearch