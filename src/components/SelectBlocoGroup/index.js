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

const SelectBlocoGroup = (props) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={props.pressed}>
                <Icon name='building' size={40}/>
                <Text>Selecionar Unidade</Text>
            </TouchableOpacity>
            {!!props.selectedUnit && 
                <View style={[styles.listItem]}>
                    <View>
                    {!!props.selectedUnit && <Text>Bloco {props.selectedBloco.bloco} Apartamento {props.selectedUnit.number}</Text>}
                    </View>
                    <TouchableOpacity onPress={props.clearUnit}>
                        <Icon name='window-close' size={30}/>
                    </TouchableOpacity>
                </View>
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

export default SelectBlocoGroup;