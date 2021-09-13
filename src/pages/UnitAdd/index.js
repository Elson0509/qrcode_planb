import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    ActivityIndicator,
  } from 'react-native';
import InputBox from '../../components/InputBox';
import * as Constants from '../../services/constants'
import FooterButtons from '../../components/FooterButtons';
import ModalMessage from '../../components/ModalMessage';
import ModalSelectBlocoNewUnit from '../../components/ModalSelectBlocoNewUnit';
import api from '../../services/api'
import Toast from 'react-native-root-toast';

const UnitAdd = props => {
    const [block, setBlock] = useState('')
    const [apt, setApt] = useState('')
    const [modal, setModal] = useState(false)
    const [modalSelectBloco, setModalSelectBloco] = useState(true)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [blocosApi, setBlocosApi] = useState([])
    const [readonlyBloco, setReadonlyBloco] = useState(false)
    const [selectedBloco, setSelectedBloco] = useState(null)

    useEffect(()=>{
      api.get(`/api/bloco/condo/${props.route.params.user.condo_id}`)
      .then(res=> {
        const newBloco = [{id:"0", name: 'Novo Bloco'}]
        setBlocosApi(newBloco.concat(res.data))
      })
      .catch((err)=>{
        Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA1)', Constants.configToast)
      })
      .finally(()=>{
        setLoading(false)
      })
    },[])
    
    const addHandler = _ => {
      const errors = []
      if(!block){
        errors.push('Bloco não pode estar vazio.')
      }
      if(!apt){
        errors.push('Apartamento não pode estar vazio.')
      }
      if(errors.length){
        setErrorMessage(errors.join('\n'))
        setModal(true)
      }
      else{
        setLoading(true)
        api.post('api/unit', {
          number: apt,
          bloco_id: selectedBloco.id,
          bloco_name: block,
          unit_kind_id: 1,
          user_id_last_modify: props.route.params.user.id,
          condo_id: props.route.params.user.condo_id,
        })
        .then((res)=>{
          setApt('')
          Toast.show(res.data.message, Constants.configToast)
        })
        .catch((err)=> {
          Toast.show(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (UA2)', Constants.configToast)
        })
        .finally(()=>{
          setLoading(false)
        })
      }
    }

    const selectBlocoHandler = bloco =>{
      setModalSelectBloco(false)
      if(bloco.id!='0'){
        setBlock(bloco.name)
        setSelectedBloco(bloco)
        setReadonlyBloco('0')
      }
      else{
        setSelectedBloco({id: '0'})
      }
    }

    if(loading)
      return <SafeAreaView style={styles.body}>
        <ActivityIndicator size="large" color="white"/>
      </SafeAreaView>

    return (
        <SafeAreaView style={styles.body}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <InputBox 
              text="Bloco:" 
              value={block} 
              changed={value=>setBlock(value)}
              backgroundColor={Constants.backgroundLightColors['Units']}
              borderColor={Constants.backgroundDarkColors['Units']}
              colorInput={Constants.backgroundDarkColors['Units']}
              editable={readonlyBloco}
            />
            <InputBox 
              text="Apartamento:" 
              value={apt} 
              changed={value=>setApt(value)}
              autoCapitalize='characters'
              backgroundColor={Constants.backgroundLightColors['Units']}
              borderColor={Constants.backgroundDarkColors['Units']}
              colorInput={Constants.backgroundDarkColors['Units']}
            />
            <FooterButtons
              title1="Adicionar"
              title2="Cancelar"
              buttonPadding={15}
              backgroundColor={Constants.backgroundColors['Units']}
              action1={addHandler}
              action2={props.navigation.goBack}
            />
          </ScrollView>
          
          <ModalMessage
            message={errorMessage}
            title="Atenção"
            modalVisible={modal}
            setModalVisible={setModal}
          />
          <ModalSelectBlocoNewUnit
            blocos={blocosApi}
            backgroundItem={Constants.backgroundLightColors['Units']}
            modalVisible={modalSelectBloco}
            setModalVisible={setModalSelectBloco}
            selectBlocoHandler={selectBlocoHandler}
          />
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    body:{
      padding:10,
      backgroundColor: Constants.backgroundColors['Units'],
      minHeight:'100%'
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
    }
  });

export default UnitAdd