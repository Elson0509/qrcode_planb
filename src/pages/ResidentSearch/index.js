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
import ModalMessage from '../../components/ModalMessage';
import api from '../../services/api'
import Toast from 'react-native-root-toast';
import PicUser from '../../components/PicUser';
import InputBox from '../../components/InputBox';
import { useAuth } from '../../contexts/auth';

const ResidentSearch = props => {
  const {user} = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const [unitSelected, setUnitSelected] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(()=>{
    fetchUsers()
    const willFocusSubscription = props.navigation.addListener('focus', ()=> {
      fetchUsers()
    })
    return willFocusSubscription
  }, [])

  const fetchUsers = _ => {
    api.get(`api/user/condo/${props.route.params.user.condo_id}/${Constants.USER_KIND["RESIDENT"]}`)
    .then(resp=>{
      setUnits(resp.data)
    })
    .catch(err=>{
      Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RS1)', Constants.configToast)
    })
    .finally(()=>{
      setLoading(false)
    })
  }

  const delUnitModal = unit => {
    setUnitSelected(unit)
    setMessage(`Excluir moradores e veículos do Bloco ${unit.bloco_name} unidade ${unit.number}?`)
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
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (RL2)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  const editHandler = unit => {
    props.navigation.navigate('ResidentEdit', 
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
        screen: 'ResidentEdit'
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

  const filterData = _ => {
    let filteredData = generateInfoUnits()

    if(!!nameFilter){
      const names = filteredData.filter(el => {
        return el.residents.some(res => res.name.toLowerCase().indexOf(nameFilter.trim().toLowerCase()) >=0 || res.identification.toLowerCase().indexOf(nameFilter.trim().toLowerCase()) >=0)
      })
      const cars = filteredData.filter(el => {
        return el.vehicles.some(veh => veh.plate.toLowerCase().indexOf(nameFilter.trim().toLowerCase()) >=0)
      })
      cars.forEach(car=>{
        if(names.every(name=> name.id!=car.id)){
          names.push(car)
        }
      })

      filteredData = names
    }
    
    return filteredData
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
      <View style={{paddingHorizontal: 10}}>
        <InputBox
          text=''
          colorLabel='black'
          backgroundColor={Constants.backgroundLightColors['Residents']}
          borderColor={Constants.backgroundDarkColors['Residents']}
          colorInput={Constants.backgroundDarkColors['Residents']}
          autoCapitalize='words'
          value={nameFilter}
          changed={(val=>setNameFilter(val))}
          placeholder='Pesquisa por nome, identidade ou placa'
        />
      </View>
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
                <Text style={styles.listText}>Bloco {obj.item.bloco_name} Unidade {obj.item.number}</Text>
                <View>
                  {/* {
                    user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] && 
                    <ActionButtons
                      flexDirection='row'
                      action1={()=> editHandler(obj.item)}
                      action2={()=> delUnitModal(obj.item)}
                    />
                  } */}
                  </View>
                <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                  <View style={{maxWidth: 300}}>
                    <View>
                      {(!obj.item.residents || obj.item.residents.length === 0) && <Text style={{marginTop: 10, textDecorationLine: 'underline'}}>Unidade sem moradores</Text>}
                      { obj.item.residents.length > 0 && <Text style={styles.subTitle}>Moradores:</Text>}
                      {
                        obj.item.residents.map((res, ind)=>{
                          return (
                            <View key={res.id} style={{flexDirection: 'row', paddingBottom:3, marginBottom: 5, borderBottomWidth: 1, borderColor: Constants.backgroundDarkColors["Residents"]}}>
                              <View>
                                <PicUser user={res}/>
                              </View>
                              <View>
                                <Text style={{fontSize: 16, marginLeft: 7}}>{res.name}</Text>
                                {!!res.email && <Text style={{fontSize: 16, marginLeft: 7}}>Email: {res.email}</Text>}
                                {!!res.identification && <Text style={{fontSize: 16, marginLeft: 7}}>Id: {res.identification}</Text>}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body:{
    padding:10,
    backgroundColor: Constants.backgroundColors['Residents'],
    minHeight:'100%'
  },
  menuItem:{
    borderWidth: 1,
    padding: 10,
    backgroundColor: Constants.backgroundLightColors['Residents'],
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

export default ResidentSearch