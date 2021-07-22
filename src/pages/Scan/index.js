import React, {useState} from 'react';
import ModalUser from '../../components/ModalUser';
import Scanner from '../../components/Scanner';
import FooterButtons from '../../components/FooterButtons';

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

    //console.log(props.route.params.user)

    const onCodeScanned = ({ type, data }) => {
        console.log({type})
        console.log({data})
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
        console.log('cancelar')
        props.navigation.navigate('Dashboard')
    }
    
    return (
    <View style={styles.container}>
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={()=> setModalVisible(false)}
            >
            <View style={styles.modal}>
                <Scanner onCodeScanned={onCodeScanned}/>
                {/* <Button title="Cancelar" onPress={() => cancelHandler()}/> */}
                <FooterButtons
                    title2="Cancelar"
                    action2={cancelHandler}
                />

            </View>
        </Modal>
        <ModalUser modalVisible={modalUserVisible} rescan={rescan} user={props.route.params.user} navigation={props.navigation} uid={uid} type={type}/>
        {/* <Button title="Escanear" onPress={()=> setModalVisible(true)}/> */}
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      flex: 1,
      //alignItems: "center",
      //justifyContent: "space-around",
      //backgroundColor: 'lightgrey',
    },
});

export default Scan;