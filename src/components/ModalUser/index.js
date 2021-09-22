import React, {useState, useEffect, Fragment} from 'react';
import { StyleSheet, Text, View, Modal, Button, Image, ScrollView } from 'react-native';
import Placa from '../Placa';
import Icon from '../Icon'
import FooterButtons from '../FooterButtons';
import Spinner from '../Spinner';
import * as Constants from '../../services/constants'

const ModalUser = (props) => {

  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [imgPath, setImgPath] = useState('')

  useEffect(()=>{
    const residents = dummyResidents.data
    const userFinded = residents.find(el=>{
        return el.id===props.uid
    })
    if(userFinded){
        switch(userFinded.id){
            case '066da296-7438-47c0-99a9-760bca2cd29d':
                setImgPath(require(` ../../../assets/pics/066da296-7438-47c0-99a9-760bca2cd29d.jpg`))
                break
            case '89f3024b-0673-4787-9747-a53f5fd16415':
                setImgPath(require(`../../../assets/pics/89f3024b-0673-4787-9747-a53f5fd16415.jpg`))
                break
            case 'ae36be16-d46e-4d2b-b7f0-b5d65667a543':
                setImgPath(require(`../../../assets/pics/ae36be16-d46e-4d2b-b7f0-b5d65667a543.jpg`))
                break
            case 'fd68a93d-dee0-48b3-9bda-bd1e86170d17':
                setImgPath(require(`../../../assets/pics/fd68a93d-dee0-48b3-9bda-bd1e86170d17.jpg`))
                break
            case '88c5b4da-fec5-46b9-8a63-d3e4dde0abb8':
                setImgPath(require(`../../../assets/pics/88c5b4da-fec5-46b9-8a63-d3e4dde0abb8.jpg`))
                break
            case 'ddbf0952-5423-4184-a58d-6c49ae424fbd':
                setImgPath(require(`../../../assets/pics/ddbf0952-5423-4184-a58d-6c49ae424fbd.jpg`))
                break
            default:
                setImgPath(null)
        }
    }

    setUser(userFinded)
    setLoading(false)
    
  },[props.uid])

  const cancelHandler = () =>{
    props.navigation.navigate('Dashboard')
  }

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: user?.is_autorizado ? '#00B924' : '#FF726F',
    },
    img:{
        width: 400,
        height: 150,
        marginTop: 10,
    },
    textDataUser:{
        color: 'white',
        fontSize:18,
        marginBottom:2,
        alignItems: "baseline",
        textAlign: 'center'
    },
    textName:{
        fontSize: 22,
        textDecorationLine: 'underline',
        fontWeight: '700',
        letterSpacing: 1
    },
    viewDataUser:{
        padding:10,
        alignItems: 'center'
    },
    borderBotton:{
        borderBottomColor: 'white',
        borderBottomWidth: 2
    },
    textError: {
        color: 'white',
        fontSize:25,
        marginTop:30,
        padding: 10,
        textAlign: 'center',
        padding: 30,
    },
    textDenied: {
        color: 'white',
        fontSize:22,
        marginTop:10,
        padding: 10
    },
    groupButtons:{
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
  });

  if(loading)
    return <Spinner/>

  if(props.type!=256 || !user){
      return (
        <Modal
            visible={props.modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={()=> props.setModalVisible(false)}
        >
            <View style={styles.modal}>
                <Text style={styles.textError}>Desculpe, mas esse não é um QR válido ou o usuário não está cadastrado.</Text>
                <Icon name='sad-tear' size={100} color='white'/>
            </View>
            <FooterButtons
                title1="Escanear"
                title2="Cancelar"
                action1={props.rescan}
                action2={cancelHandler}
                backgroundColor={Constants.is_not_autorized_backgroundColor}
            />
      </Modal>
      )
  }

  if(!user.is_autorizado){
      return (
        <Modal
            visible={props.modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={()=> props.setModalVisible(false)}
        >
            <View style={styles.modal}>
                <Text style={styles.textError}>Usuário não autorizado.</Text>
                <Icon name='ban' size={100} color='white'/>
            </View>
            
            <FooterButtons
                title1="Escanear"
                title2="Cancelar"
                action1={props.rescan}
                action2={cancelHandler}
                backgroundColor={Constants.is_not_autorized_backgroundColor}
            />
        </Modal>
      )
  }

  return (
        <Modal
            visible={props.modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={()=> props.setModalVisible(false)}
        >
          <ScrollView>
            <View style={styles.modal}>
                <Image 
                    style={styles.img}
                    resizeMode="contain"
                    source={imgPath}
                    //source={{uri: 'https://i2.wp.com/imgonline.com.br/site/wp-content/uploads/2019/07/destino-joao-pessoa2.jpg'}}
                />
                <View style={[styles.viewDataUser, styles.borderBotton]}>
                    <Text style={[styles.textDataUser, styles.textName]}>{user.name}</Text>
                    <Text style={[styles.textDataUser,]}>Condomínio {user.condo}</Text>
                    <Text style={[styles.textDataUser,]}>{user.address_comp}</Text>
                </View>
                <View style={styles.viewDataUser}>
                    {user.vehicles.length == 0 &&
                        <Text style={[styles.textDataUser, {fontSize: 24, fontWeight: '700'}]}>Não há veículos cadastrados.</Text>
                    ||
                        <Text style={[styles.textDataUser, {fontSize: 24, fontWeight: '700'}]}>Veículos:</Text>
                    }
                    {user.vehicles.map((el, ind) => {
                        return (
                            <Fragment key={ind}>
                                <Text style={[styles.textDataUser, {marginBottom: 5, marginTop: 18, fontSize: 20, fontWeight: '700'}]}>{el.vehicle_maker} {el.vehicle_model} {el.vehicle_color}</Text>
                                <Placa placa={el.vehicle_plate}/>
                            </Fragment>
                        )})
                    }
                </View>
            </View>
            <FooterButtons
                title1="Escanear"
                title2="Cancelar"
                action1={props.rescan}
                action2={cancelHandler}
                backgroundColor={Constants.is_autorized_backgroundColor}
            />
          </ScrollView>
      </Modal>
  );
};



export default ModalUser;