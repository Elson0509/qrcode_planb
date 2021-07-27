import React from 'react';
import Icon from '../Icon';
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

const AddCarsGroup = (props) => {
    const cars = [
        {
            maker:'Toyota',
            model:'Cruze',
            color:'Azul',
            plate:'XCLRT45',
        },
        {
            maker:'Hyunday',
            model:'Accent',
            color:'Branco',
            plate:'IUL4R78',
        },

    ]

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Icon name='car' size={40}/>
                <Text>Adicionar veículo</Text>
            </TouchableOpacity>
            {
                cars.map((el, ind)=> (
                    <View key={ind} style={[styles.listItem]}>
                        <View>
                            <Text style={styles.menuItemText}>{el.maker} {el.model} {el.color}</Text>
                            <Text style={styles.menuItemText}>Placa: {el.plate}</Text>
                        </View>
                        <TouchableOpacity>
                            <Icon name='window-close' size={30}/>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </View>
        
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#44FFAF',
        padding: 20,
        marginTop: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderStyle: 'dotted'
    },
    button:{
        backgroundColor: '#00FF7F',
        alignItems: 'center',
        padding: 3,
        borderRadius: 15,
        borderWidth: 2,
        marginBottom: 10,
    },
    listItem:{
        padding: 3,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default AddCarsGroup;