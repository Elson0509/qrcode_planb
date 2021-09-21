import React, {useState} from 'react';
import ModalUser from '../../components/ModalUser';
import Scanner from '../../components/Scanner';
import FooterButtons from '../../components/FooterButtons';
import * as Constants from '../../services/constants'

import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    Modal,
    Button,
    TouchableOpacity,
    Text,
    FlatList,
    Animated,
    Keyboard,
    } from 'react-native';


const Scan = (props) => {
    const [uid, setUid] = useState(0)
    const [type, setType] = useState(0)

    const onCodeScanned = ( typeInput, dataInput ) => {
        setUid(dataInput)
        setType(typeInput)
        props.navigation.navigate('Scanned', {dataInput, typeInput})
    }
    
    const rescan = () => {
        setModalVisible(true)
        setModalUserVisible(false)
    }

    const cancelHandler = () =>{
        setModalVisible(false)
        props.navigation.navigate('Dashboard')
    }
    
    return (
    <View style={[styles.container]}>
        <View style={styles.modal}>
            <Scanner onCodeScanned={onCodeScanned}/>
            <FooterButtons
                //backgroundColor={props.route.params.backgroundColor}
                backgroundColor='black'
                title2="Cancelar"
                action2={cancelHandler}
            />
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      //backgroundColor: Constants.backgroundColors['Scan'],
      backgroundColor: 'black',
    },
    modal: {
      flex: 1,
    },
});

export default Scan;