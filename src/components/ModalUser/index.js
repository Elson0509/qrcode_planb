import React, {useState, Fragment} from 'react';
import { StyleSheet, Text, View, Modal, Button, Image, ScrollView } from 'react-native';
import dummyUsers from '../../../dummyData.json'
import Placa from '../Placa';

const ModalUser = (props) => {
  const users = dummyUsers.data
  const user = users.find(el=>{
      return el.id===props.uid
  })
  let imgPath
  
  //console.log(props.user)
  const securityGuardData = props.user

  let nascimento
  let formatData
  let age

  if(user){
    switch(user.id){
        case '066da296-7438-47c0-99a9-760bca2cd29d':
            imgPath=require(` ../../../assets/pics/066da296-7438-47c0-99a9-760bca2cd29d.jpg`)
            break
        case '89f3024b-0673-4787-9747-a53f5fd16415':
            imgPath=require(`../../../assets/pics/89f3024b-0673-4787-9747-a53f5fd16415.jpg`)
            break
        case 'ae36be16-d46e-4d2b-b7f0-b5d65667a543':
            imgPath=require(`../../../assets/pics/ae36be16-d46e-4d2b-b7f0-b5d65667a543.jpg`)
            break
        case 'fd68a93d-dee0-48b3-9bda-bd1e86170d17':
            imgPath=require(`../../../assets/pics/fd68a93d-dee0-48b3-9bda-bd1e86170d17.jpg`)
            break
        case '88c5b4da-fec5-46b9-8a63-d3e4dde0abb8':
            imgPath=require(`../../../assets/pics/88c5b4da-fec5-46b9-8a63-d3e4dde0abb8.jpg`)
            break
        case 'ddbf0952-5423-4184-a58d-6c49ae424fbd':
            imgPath=require(`../../../assets/pics/ddbf0952-5423-4184-a58d-6c49ae424fbd.jpg`)
            break
        default:
            imgPath=null
    }
    nascimento = new Date(user.nascimento)
    formatData = `${nascimento.getDate()+1}/${nascimento.getMonth()+1}/${nascimento.getFullYear()}`
    age = Math.abs(new Date(Date.now() - nascimento.getTime()).getUTCFullYear() - 1970)
  }

  const cancelHandler = () =>{
    console.log('cancelando....')
    console.log(props)
    props.navigation.navigate('Dashboard')
  }

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: user?.is_autorizado && user?.condominio_id == securityGuardData.condominio_id ? '#00B924' : '#FF726F',
      
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
        padding: 10
    },
    textDenied: {
        color: 'white',
        fontSize:22,
        marginTop:10,
        padding: 10
    },
  });

  return (
        props.type===256 && 
        !!user &&
        
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
                    <Text style={[styles.textDataUser, styles.textName]}>{user.nome}</Text>
                    <Text style={[styles.textDataUser,]}>Condomínio {user.condominio}</Text>
                    {/* <Text style={styles.textDataUser}>{user.endereco}</Text> */}
                    <Text style={[styles.textDataUser,]}>Bloco {user.bloco}  - Apt {user.apt}</Text>
                    <Text style={[styles.textDataUser,]}>Nascimento: {formatData} ({age} anos)</Text>
                </View>
                <View style={styles.viewDataUser}>
                    <Text style={styles.textDataUser}>{user.veiculo_montador} {user.veiculo_modelo} {user.veiculo_cor}</Text>
                    <Placa placa={user.veiculo_placa}/>
                    {/* <Text style={styles.textDataUser}>Placa: {user.veiculo_placa}</Text> */}

                    {!user.is_autorizado && <Fragment>
                    <Text style={styles.textDenied}>Acesso negado!</Text>
                    <Text style={styles.textDenied}>Motivo: Autorização negada pelo condomínio</Text>
                </Fragment>}
                {user.condominio_id != '3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd' && <Fragment>
                    <Text style={styles.textDenied}>Acesso negado!</Text>
                    <Text style={styles.textDenied}>Motivo: Veículo não cadastrado no condomínio Flor do Sul</Text>
                </Fragment>}
                {user.condominio_id == '3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd' && user.is_autorizado && <Fragment>
                    <Text style={styles.textDenied}>Acesso autorizado!</Text>
                </Fragment>}
                </View>
            </View>
            <View>
                <Button title="Escanear" onPress={()=> props.rescan()}/>
                <Button title="Cancelar" onPress={()=> cancelHandler()}/>
            </View>
            
          </ScrollView>
      </Modal>
      
      ||
      <Modal
        visible={props.modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={()=> props.setModalVisible(false)}
        >
            <View style={styles.modal}>
                <Text style={styles.textError}>Não é um QR válido ou usuário não está cadastrado.</Text>
            </View>
            <Button title="Escanear" onPress={()=> props.rescan()}/>
            <Button title="Cancelar" onPress={()=> cancelHandler()}/>
      </Modal>
  );
};



export default ModalUser;