import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    View,
    Text,
  } from 'react-native';
import ActionButtons from '../../components/ActionButtons';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import PicUser from '../../components/PicUser';
import ModalQRCode from '../../components/ModalQRCode';
import { useAuth } from '../../contexts/auth';

const ThirdList = props => {
  const {user} = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [unitSelected, setUnitSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showModalQRCode, setShowModalQRCode] = useState(false)
  const [unitIdModalQRCode, setUnitIdModalQRCode] = useState('')

  useEffect(()=>{
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', ()=> {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  let beginOfDay = new Date()
  beginOfDay.setHours(0)
  beginOfDay.setMinutes(0)
  beginOfDay.setSeconds(0)
  beginOfDay.setMilliseconds(0)

  const modalQRCodeHandler = id => {
    setUnitIdModalQRCode(Constants.QR_CODE_PREFIX + id)
    setShowModalQRCode(true)
  }

  const fetchUsers = _ => {
    api.get(`api/user/condo/${props.route.params.user.condo_id}/${Constants.USER_KIND["THIRD"]}`)
    .then(resp=>{
      setUnits(resp.data)
    })
    .catch(err=>{
      Toast.show(err.response.data.message, Constants.configToast)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  const delUnitModal = unit => {
    setUnitSelected(unit)
    setMessage(`Excluir terceirizados e seus veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
    setModal(true)
  }

  const deleteUnitConfirmed = _ =>{
    setModal(false)
    setLoading(true)
    api.delete(`api/user/unit/${unitSelected.id}`,{
      data:{
        user_id_last_modify: props.route.params.user.id,
      }
    })
      .then(res=>{
        Toast.show(res.data.message, Constants.configToast)
        fetchUsers()
      })
      .catch((err)=>{
        Toast.show(err.response.data.message, Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  const editHandler = unit => {
    props.navigation.navigate('ThirdEdit', 
      {
        user: props.route.params.user,
        selectedBloco: {
          id: unit.bloco_id,
          name: unit.bloco_name
        },
        selectedUnit:{
          id: unit.id,
          number: unit.number
        },
        residents: unit.residents,
        vehicles: unit.vehicles,
        screen: 'ThirdEdit'
      }
    )
  }

  const generateInfoUnits = _ =>{
    const unitsInfo = []
    units.forEach(bloco=>{
      bloco.Units.forEach(unit => {
        const unitInfo = {}
        unitInfo.bloco_id = bloco.id
        unitInfo.bloco_name = bloco.name
        unitInfo.residents = unit.Users
        unitInfo.vehicles = unit.Vehicles
        unitInfo.number = unit.number
        unitInfo.id = unit.id
        unitsInfo.push(unitInfo)
      })
    })
    return unitsInfo
  }

  const onRefreshHandler = _ =>{
    setRefreshing(true)
    fetchUsers()
    setRefreshing(false)
  }

  if(loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white"/>
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
        <FlatList
          data={generateInfoUnits()}
          keyExtractor={item=>item.id}
          style={{marginBottom: 80, paddingRight:10}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={()=> onRefreshHandler()}
            />
          }
          renderItem={(obj)=>{
            //don't show if there is not visitors and vehicles
            if(obj.item.residents.length === 0 && obj.item.vehicles.length === 0)
              return null

            return (
              <View 
                style={styles.menuItem} 
              >
                <Text style={styles.listText}>Bloco {obj.item.bloco_name} Unidade {obj.item.number}</Text>
                <View>
                  {
                    user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] && 
                    <ActionButtons
                      flexDirection='row'
                      action1={()=> editHandler(obj.item)}
                      action2={()=> delUnitModal(obj.item)}
                      action3={()=> modalQRCodeHandler(obj.item.id)}
                      qrCodeButton={true}
                    />
                  }
                  </View>
                <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                  <View style={{maxWidth: 300}}>
                    <View>
                      {(!obj.item.residents || obj.item.residents.length === 0) && <Text style={{marginTop: 10, textDecorationLine: 'underline'}}>Unidade sem terceirizados</Text>}
                      { obj.item.residents.length > 0 && <Text style={styles.subTitle}>Terceirizados:</Text>}
                      {
                        obj.item.residents.map((res)=>{
                          return (
                            <View key={res.id} style={{flexDirection: 'row', paddingBottom:3, marginBottom: 5, borderBottomWidth: 1, borderColor: Constants.backgroundDarkColors["Visitors"]}}>
                              <View>
                                <PicUser user={res}/>
                              </View>
                              <View style={{maxWidth: 250}}>
                                <Text style={{fontSize: 16, marginLeft: 7, fontWeight: 'bold'}}>{res.name}</Text>
                                {!!res.email && <Text style={{fontSize: 16, marginLeft: 7}}>Email: {res.email}</Text>}
                                {!!res.company && <Text style={{fontSize: 16, marginLeft: 7}}>Empresa: {res.company}</Text>}
                                {!!res.initial_date && <Text style={{fontSize: 16, marginLeft: 7}}>Início: {Utils.printDate(new Date(res.initial_date))}</Text>}
                                {!!res.final_date && <Text style={{fontSize: 16, marginLeft: 7}}>Fim: {Utils.printDate(new Date(res.final_date))}</Text>}
                                {
                                  new Date(res.final_date) >= beginOfDay ?
                                    <Text style={{fontSize: 16, marginLeft: 7}}>
                                      Status: Válido
                                    </Text>
                                    :
                                    <Text style={{fontSize: 16, marginLeft: 7, fontWeight: 'bold', color: 'red'}}>
                                      Status: Expirado
                                    </Text>
                                }
                              </View>
                            </View>
                          )
                        })
                      }
                    </View>
                    <View>
                      {obj.item.vehicles?.length > 0 && <Text style={styles.subTitle}>Veículos:</Text>}
                      {(!obj.item.vehicles || obj.item.vehicles.length === 0) && <Text style={{marginTop: 10, textDecorationLine: 'underline'}}>Sem veículos cadastrados</Text>}
                      {
                        obj.item.vehicles?.map((car, ind)=>{
                          return (
                            <Text key={ind}>-{`${car.maker} ${car.model} ${car.color} - ${car.plate}`}</Text>
                          )
                        })
                      }
                    </View>
                  </View>
                </View>
              </View>
            )
          }}
        />
        <ModalMessage
          message={message}
          title="Confirme"
          btn1Pressed={deleteUnitConfirmed}
          btn2Text='Cancelar'
          btn1Text='Apagar'
          modalVisible={modal}
          setModalVisible={setModal}
        />
        <ModalQRCode
          modalVisible={showModalQRCode}
          setModalVisible={setShowModalQRCode}
          value={unitIdModalQRCode}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Thirds'],
      minHeight:'100%'
    },
    menuItem:{
      borderWidth: 1,
      padding: 10,
      backgroundColor: Constants.backgroundLightColors['Thirds'],
      borderRadius: 20,
      marginBottom: 10,
    },
    listText:{
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign:'center'
    },
    subTitle:{
      fontWeight:'bold',
      fontSize: 15,
      textDecorationLine: 'underline',
      marginTop: 5,
    }
  });

export default ThirdList