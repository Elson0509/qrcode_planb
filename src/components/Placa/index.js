import React from 'react';
import * as utils from '../../services/util'
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Text,
    FlatList,
    Animated,
    Keyboard,
} from 'react-native';

const Placa = (props) => {
    const placa = props.placa.toUpperCase()
    const isNewModel = utils.isBrazilLicensePlateNewModel(placa)
    return (
        isNewModel ?
        <View style={styles.newPlateView}>
            <View style={styles.newPlateHeader}>
                <Image style={styles.plateImages} resizeMode="contain" source={require('../../../assets/mercosul_logo_plate.jpg')}/>
                <Text style={styles.newPlateCountry}>Brasil</Text>
                <Image style={styles.plateImages} resizeMode="contain" source={require('../../../assets/brazil_logo_plate.jpg')}/>
            </View>
            
            <Text style={styles.oldPlateText}>{placa}</Text>
        </View>
        :
        <View style={styles.oldPlateView}>
            <Text style={styles.oldPlateTextState}>UF - Município</Text>
            <Text style={styles.oldPlateText}>{utils.oldModelPlateFormat(placa)}</Text>
        </View>
        
    );
};

const styles = StyleSheet.create({
    oldPlateView:{
        backgroundColor: '#ccc',
        height: 72,
        padding: 5,
        borderRadius: 12
    },
    oldPlateTextState:{
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#AAA'
    },
    oldPlateText:{
        textAlign: 'center',
        fontSize: 36,
        fontWeight: '700',
    },
    newPlateView:{
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 4,
        width: 200,
        
    },
    newPlateHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 2,
        backgroundColor: '#0000AA'
    },
    newPlateCountry:{
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: '700'
    },
    plateImages:{
        height: 20,
        width: 20,
    },
    
})

export default Placa;