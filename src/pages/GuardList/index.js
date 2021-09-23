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

const GuardList = props => {
    const [residents, setResidents] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [message, setMessage] = useState('')
    const [userSelected, setUserSelected] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(()=>{
      fetchUsers()
      const willFocusSubscription = props.navigation.addListener('focus', ()=> {
        fetchUsers()
      })
      return willFocusSubscription
    }, [])

    const fetchUsers = _ => {
      api.get(`api/user/kind/${Constants.USER_KIND["GUARD"]}`)
      .then(resp=>{
        setResidents(resp.data)
      })
      .catch(err=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GL1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    }

    const delUser = user => {
      setMessage(`Excluir segurança ${user.name}?`)
      setUserSelected(user)
      setModal(true)
    }

    const deleteUnitConfirmed = _ =>{
      setModal(false)
      setLoading(true)
      api.delete(`api/user/${userSelected.id}`)
        .then(res=>{
          Toast.show(res.data.message, Constants.configToast)
          fetchUsers()
        })
        .catch((err)=>{
          Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (GL2)', Constants.configToast)
        })
        .finally(()=>{
          setLoading(false)
        })
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
              data={residents}
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
                    <View>
                      <ActionButtons
                        flexDirection='row'
                        noEditButton
                        action2={()=> delUser(obj.item)}
                      />
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                      <View style={{maxWidth: 300}}>
                        <View>
                          {
                            <View style={{flexDirection: 'row', paddingBottom:3, marginBottom: 5, borderBottomWidth: 1, borderColor: Constants.backgroundDarkColors["Guards"]}}>
                              <View>
                                <PicUser user={obj.item}/>
                              </View>
                              <View>
                                <Text style={{fontSize: 16, marginLeft: 7, fontWeight: 'bold'}}>{obj.item.name}</Text>
                                {!!obj.item.identification && <Text style={{fontSize: 16, marginLeft: 7}}>Id: {obj.item.identification}</Text>}
                                {!!obj.item.email && <Text style={{fontSize: 16, marginLeft: 7}}>Email: {obj.item.email}</Text>}
                              </View>
                            </View>
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
      backgroundColor: Constants.backgroundColors['Guards'],
      minHeight:'100%'
    },
    menuItem:{
      borderWidth: 1,
      padding: 10,
      backgroundColor: Constants.backgroundLightColors['Guards'],
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

export default GuardList