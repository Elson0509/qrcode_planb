import React, {useState} from 'react';
import Scanner from '../../components/Scanner';
import FooterButtons from '../../components/FooterButtons';

import { StyleSheet,
    View,
    } from 'react-native';


const Scan = (props) => {
    //const [uid, setUid] = useState(0)
    //const [type, setType] = useState(0)

    const onCodeScanned = ( typeInput, dataInput ) => {
        //setUid(dataInput)
        //setType(typeInput)
        props.navigation.navigate('Scanned', {dataInput, typeInput})
    }

    const cancelHandler = () =>{
        props.navigation.navigate('Dashboard')
    }
    
    return (
    <View style={[styles.container]}>
        <View style={styles.modal}>
            <Scanner onCodeScanned={onCodeScanned}/>
            <FooterButtons
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
      backgroundColor: 'black',
    },
    modal: {
      flex: 1,
    },
});

export default Scan;