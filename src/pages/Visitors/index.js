import React from 'react';
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

import { useAuth } from '../../contexts/auth';
import * as utils from '../../services/util'
import Icon from '../../components/Icon';
import * as Constants from '../../services/constants'

const Visitors = (props) => {
    const {user} = useAuth()

    const menuOptions = [
        { menuName: "Adicionar", icon: 'plus-square', key: 'plus', screen: '' },
        { menuName: "Apagar", icon: 'trash-alt', key: 'del', screen: '' },
        { menuName: "Editar", icon: 'edit', key: 'edit', screen: '' },
    ]

    return (
        <View style={[styles.container, {backgroundColor: props.route.params.backgroundColor}]}>
            <Text style={styles.greeting}>{utils.saudacaoHorario(user?.name)}</Text>
            <FlatList
                data={menuOptions}
                numColumns={2}
                renderItem={(obj)=>{
                    return <TouchableOpacity style={styles.menuItem} onPress={()=> {props.navigation.navigate(obj.item.screen, {user: user})}}>
                               <Icon name={obj.item.icon} size={55}/>
                               <Text style={styles.menuItemText}>{obj.item.menuName}</Text>
                           </TouchableOpacity>
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    greeting: {
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'black',
        letterSpacing: 1,
        fontSize: 20,
        marginTop: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 30
    },
    menuContainer:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    menuItem:{
        width: '45%',
        height: 140,
        marginLeft: 12,
        marginTop: 12,
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        padding: 20,
        backgroundColor: Constants.backgroundLightColors["Visitors"],
        alignItems: 'center',
    },
    menuItemText:{
        marginTop: 15,
        fontWeight: '700',
        fontSize: 18
    }
})

export default Visitors;