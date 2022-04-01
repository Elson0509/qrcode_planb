import React from 'react';
import Scanner from '../../components/Scanner';
import FooterButtons from '../../components/FooterButtons';

import { StyleSheet,
    View,
    } from 'react-native';


const Scan = (props) => {
    const onCodeScanned = ( typeInput, dataInput ) => {
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