import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
  } from 'react-native';
import * as Constants from '../../services/constants'
import ModalMessage from '../../components/ModalMessage';
import AddResidentsGroup from '../../components/AddResidentsGroup';
import AddCarsGroup from '../../components/AddCarsGroup';
import SelectBlocoGroup from '../../components/SelectBlocoGroup';
import ModalSelectBloco from '../../components/ModalSelectBloco';
import ModalSelectUnit from '../../components/ModalSelectUnit';
import dummyBlocos from '../../../dummyDataBlocos.json'

const ResidentAdd = props => {
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [blocos, setBlocos] = useState([])
    const [modalSelectBloco, setModalSelectBloco] = useState(false)
    const [modalSelectUnit, setModalSelectUnit] = useState(false)
    const [selectedBloco, setSelectedBloco] = useState(null)
    const [selectedUnit, setSelectedUnit] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [residents, setResidents] = useState([])
    const [vehicles, setVehicles] = useState([])

    useEffect(()=>{
      const data = dummyBlocos.data
      //console.log(data)
      setBlocos(data)
      setLoading(false)
    },[])
    
    const plateSizeValidator = value => {
      if(value.length <= 7){
        setPlateVehicle(value.toUpperCase())
      }
    }

    const selectBlocoHandler = bloco => {
      setSelectedBloco(bloco)
      setModalSelectBloco(false)
      setModalSelectUnit(true)
    }

    const selectUnitHandler = unit => {
      setSelectedUnit(unit)
      setModalSelectUnit(false)
    }

    const clearUnit = _ =>{
      setSelectedBloco(null)
      setSelectedUnit(null)
    }

    return(
      <SafeAreaView style={styles.body}>
        <ScrollView>
          <Text style={[{color: 'black', fontWeight: 'bold'}]}>Complemento (Bloco, Apt...)</Text>
          <SelectBlocoGroup 
            pressed={()=>setModalSelectBloco(true)}
            selectedBloco={selectedBloco}
            selectedUnit={selectedUnit}
            clearUnit={clearUnit}
          />
          <AddResidentsGroup data={residents} setData={setResidents}/>
          <AddCarsGroup data={vehicles} setData={setVehicles}/>
          
        </ScrollView>
        <ModalMessage
          message={errorMessage}
          title="Atenção"
          modalVisible={modal}
          setModalVisible={setModal}
        />
        <ModalSelectBloco
          selectBlocoHandler={selectBlocoHandler}
          blocos={blocos}
          modalVisible={modalSelectBloco}
          setModalVisible={setModalSelectBloco}
        />
        <ModalSelectUnit
          selectBlocoHandler={selectBlocoHandler}
          bloco={selectedBloco}
          modalVisible={modalSelectUnit}
          setModalVisible={setModalSelectUnit}
          selectUnitHandler={selectUnitHandler}
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
    picker:{
      //backgroundColor:Constants.backgroundLightColors['Residents'],
      //borderColor:Constants.backgroundDarkColors['Residents'],
      backgroundColor:'white',
      borderColor:'black',
      borderWidth: 1,
      color:'black',
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

export default ResidentAdd