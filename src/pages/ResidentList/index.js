import React, {useState, Fragment, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    View,
    Text,
  } from 'react-native';
import dummyUsers from '../../../dummyData.json'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import FooterButtons from '../../components/FooterButtons';

const ResidentList = props => {
    const [users, setUsers] = useState({})

    useEffect(()=>{
      console.log(dummyUsers.data)
      setUsers(dummyUsers.data)
    }, [])

    return (
        <SafeAreaView style={styles.body}>
            <FlatList
              data={users}
              renderItem={(obj)=>{
                  return <TouchableOpacity 
                              style={styles.menuItem} 
                              onPress={()=> {console.log('ok')}}>
                              <Text style={styles.listText}>{obj.item.nome}</Text>
                              <Text style={styles.listText}>Bloco {obj.item.bloco} Apt {obj.item.apt}</Text>
                          </TouchableOpacity>
              }}
            />
            <FooterButtons
              title2="Voltar"
              buttonPadding={15}
              backgroundColor={Constants.backgroundColors['Residents']}
              action2={props.navigation.goBack}
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
      fontSize: 16
    }
  });

export default ResidentList