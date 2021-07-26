import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
  } from 'react-native';
  import InputBox from '../../components/InputBox';
  import * as Constants from '../../services/constants'
  import * as Utils from '../../services/util'
  import FooterButtons from '../../components/FooterButtons';
  import ModalMessage from '../../components/ModalMessage';
  import comp from '../../../dummyDataComp.json'


const UnitAdd = props => {
    const [block, setBlock] = useState('')
    const [apt, setApt] = useState('')
    const [modal, setModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{
      
    },[])
    
    const addHandler = _ => {
      const errors = []
      if(!apt){
        errors.push('Apartamento não pode estar vazio.')
      }
      if(errors.length){
        setErrorMessage(errors.join('\n'))
        setModal(true)
      }
      else{
        console.log('Salvando informações...')
        const newUnit = {
          block,
          apt
        }
        console.log(newUnit)
      }
    }

    return (
        <SafeAreaView style={styles.body}>
          <ScrollView >
            <InputBox 
              text="Bloco:" 
              value={block} 
              changed={value=>setBlock(value)}
              backgroundColor={Constants.backgroundLightColors['Units']}
              borderColor={Constants.backgroundDarkColors['Units']}
              colorInput={Constants.backgroundDarkColors['Units']}
            />
            <InputBox 
              text="Apartamento:" 
              value={apt} 
              changed={value=>setApt(value)}
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