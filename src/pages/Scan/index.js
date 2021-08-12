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
    const [modalVisible, setModalVisible] = useState(true)
    const [modalUserVisible, setModalUserVisible] = useState(false)
    const [uid, setUid] = useState(0)
    const [type, setType] = useState(0)

    const onCodeScanned = ({ type, data }) => {
        setUid(data)
        setType(type)
        setModalVisible(false)
        setModalUserVisible(true)
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
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={()=> setModalVisible(false)}
            >
            <View style={styles.modal}>
                <Scanner onCodeScanned={onCodeScanned}/>
                <FooterButtons
                    backgroundColor={props.route.params.backgroundColor}
                    title2="Cancelar"
                    action2={cancelHandler}
                />

            </View>
        </Modal>
        <ModalUser 
            backgroundColor={props.route.params.backgroundColor}
            modalVisible={modalUserVisible} 
            rescan={rescan} 
            navigation={props.navigation} 
            uid={uid} 
            type={type}/>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Constants.backgroundColors['Scan'],
    },
    modal: {
      flex: 1,
    },
});

export default Scan;