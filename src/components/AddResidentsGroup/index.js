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

const AddResidentsGroup = (props) => {
    const users = [
        {
            name: 'Elson Ramos',
            email: 'few@fe.com',
            identification: '2423434534'
        },
        {
            name: 'Carlos Braga',
            email: 'fe@fee.com',
            identification: '545435436'
        },
    ]

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={()=> {props.setModalAddResident(true)}}>
                <Icon name='user' size={40}/>
                <Text>Adicionar morador</Text>
            </TouchableOpacity>
            {
                users.map(((el, ind)=> (
                    <View key={ind} style={[styles.listItem]}>
                        <View>
                            <Text style={styles.menuItemText}>Nome: {el.name}</Text>
                            <Text style={styles.menuItemText}>Email: {el.email}</Text>
                        </View>
                        <TouchableOpacity>
                            <Icon name='window-close' size={30}/>
                        </TouchableOpacity>
                    </View>
                )))
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

export default AddResidentsGroup;