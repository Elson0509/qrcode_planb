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
import ModalInfo from '../../components/ModalInfo'
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import PicUser from '../../components/PicUser';
import InputBox from '../../components/InputBox';
import ModalQRCode from '../../components/ModalQRCode';
import ModalGeneric from '../../components/ModalGeneric'
import Spinner from '../../components/Spinner';
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
  const [nameFilter, setNameFilter] = useState('')
  const [unitIdModalQRCode, setUnitIdModalQRCode] = useState('')
  const [entranceExitModal, setEntranceExitModal] = useState(false)
  const [modalEntrance, setModalEntrance] = useState(false)
  const [modalExit, setModalExit] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [messageInfoModal, setMessageInfoModal] = useState('')
  const [messageErrorModal, setMessageErrorModal] = useState('')
  const [modalGeneric, setModalGeneric] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(false)

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
    let unitsInfo = []
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

    if(!!nameFilter){
        unitsInfo = unitsInfo.filter(el=>{
            return el.residents.some(res=>res.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) ||
                el.vehicles.some(vei=> vei.plate.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) ||
                el.residents.some(res=>res.company && res.company.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) ||
                el.bloco_name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 ||
                el.number.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 
        })
    }

    return unitsInfo
  }

  const onRefreshHandler = _ =>{
    setRefreshing(true)
    fetchUsers()
    setRefreshing(false)
  }

  const carIconHandler = unit => {
    setUnitSelected(unit)
    //valid user?
    if(!(new Date(unit.residents[0].final_date) >= beginOfDay && new Date(unit.residents[0].initial_date) <= beginOfDay)){
        return Toast.show('Terceirizados fora da data de autorização.', Constants.configToast)
    }
    setEntranceExitModal(true)
  }

  const exitHandler = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setLoading(true)
    api.get(`api/reading/${unitSelected.id}/0`)
    .then(res=>{
        setLoading(false)
        let message = 'Confirmado. Terceirizados vão LIBERAR uma vaga de estacionamento? '
        setMessageInfoModal(message)
        setModalExit(true)
        setEntranceExitModal(false)
    })
    .catch(err=> {
        setLoading(false)
        setEntranceExitModal(false)
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VS3)', Constants.configToast)
    })
  }

  const entranceHandler = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setLoading(true)
    api.get(`api/reading/${unitSelected.id}/1`)
    .then(res=>{
        setLoading(false)
        let message = 'Confirmado. '
        if(res.data.freeslots ===0){
            //there are not free slots
            message+='Mas não há vagas de estacionamento disponíveis.'
            setMessageErrorModal(message)
            setModalMessage(true)
        }
        else{
            //there are free slots
            message+= res.data.freeslots > 1 ? `Há ${res.data.freeslots} vagas livres. Terceirizados vão OCUPAR uma vaga?` : 'Há uma vaga livre. Terceirizados vão ocupar esta vaga?'
            setMessageInfoModal(message)
            setModalEntrance(true)
        }
        setEntranceExitModal(false)
    })
    .catch(err=> {
        setLoading(false)
        setEntranceExitModal(false)
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (VS2)', Constants.configToast)
    })
  }

  const confirmSlotEntrance = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setModalEntrance(false)
    setModalGeneric(true)
    setLoadingMessage(true)
    api.get(`api/condo/occupyslot`)
    .then(resp=>{
        const freeslots = resp.data.freeslots
        let message = resp.data.message + ' '
        if(freeslots > 0){
            message+= `Ainda ${freeslots > 1 ? `restam ${freeslots} vagas` : 'resta 1 vaga'}.`
        }
        else{
            message+= 'Não restam mais novas vagas.'
        }

        setMessageInfoModal(message)
    })
    .catch(err=>{
        setMessageErrorModal(err.response?.data?.message)
    })
    .finally(()=>{
        setLoadingMessage(false)
    })
  }

  const confirmSlotExit = _ => {
    setMessageInfoModal('')
    setMessageErrorModal('')
    setModalExit(false)
    setModalGeneric(true)
    setLoadingMessage(true)
    api.get(`api/condo/freeslot`)
    .then(resp=>{
        const freeslots = resp.data.freeslots
        const message = resp.data.message + ` Ainda ${freeslots > 1 ? `restam ${freeslots} vagas` : 'resta 1 vaga'}.`
        setMessageInfoModal(message)
    })
    .catch(err=>{
        setMessageErrorModal(err.response?.data?.message)
    })
    .finally(()=>{
        setLoadingMessage(false)
    })
  }

  if(loading)
    return <SafeAreaView style={styles.body}>
      <ActivityIndicator size="large" color="white"/>
    </SafeAreaView>

  return (
    <SafeAreaView style={styles.body}>
      <View style={{paddingHorizontal: 10}}>
        <InputBox
          text=''
          colorLabel='black'
          backgroundColor={Constants.backgroundLightColors['Thirds']}
          borderColor={Constants.backgroundDarkColors['Thirds']}
          colorInput={Constants.backgroundDarkColors['Thirds']}
          autoCapitalize='words'
          value={nameFilter}
          changed={(val=>setNameFilter(val))}
          placeholder='Pesquisa por nome, placa, empresa, bloco ou número'
        />
      </View>
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
                {
                  user.user_kind===Constants.USER_KIND['GUARD'] &&
                  <ActionButtons
                    flexDirection='row'
                    noDeleteButton
                    editIcon='car-side'
                    action1={()=> carIconHandler(obj.item)}
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
      <ModalMessage
        message={'Deseja registrar entrada ou saída de terceirizados?'}
        modalVisible={entranceExitModal}
        setModalVisible={setEntranceExitModal}
        title='Entrada/Saída'
        btn1Text='ENTRADA'
        btn2Text='SAÍDA'
        btn1Pressed={()=>entranceHandler()}
        btn2Pressed={()=>exitHandler()}
      />
      <ModalMessage
        message={messageInfoModal}
        modalVisible={modalEntrance}
        setModalVisible={setModalEntrance}
        btn1Text='Sim'
        btn2Text='Não'
        btn1Pressed={()=>confirmSlotEntrance()}
      />
      <ModalMessage
        message={messageInfoModal}
        modalVisible={modalExit}
        setModalVisible={setModalExit}
        btn1Text='Sim'
        btn2Text='Não'
        btn1Pressed={()=>confirmSlotExit()}
      />
      <ModalInfo
        modalVisible={modalMessage}
        setModalVisible={setModalMessage}
        message={messageErrorModal}
        btn1Text='Entendido'
      />
      <ModalGeneric
        modalVisible={modalGeneric}
        setModalVisible={setModalGeneric}
      >
        {
        loadingMessage &&
          <View>
            <Spinner/>
          </View>
        ||
          <View>
            {
              !!messageInfoModal &&
              <Text style={styles.infoMessageModal}>
                  {messageInfoModal}
              </Text>
            }
            {
              !!messageErrorModal &&
              <Text style={styles.errorMessageModal}>
                  {messageErrorModal}
              </Text>
            }
          </View>
        }
      </ModalGeneric>
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