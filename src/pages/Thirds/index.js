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
import Greeting from '../../components/Greeting/Greeting';

const Thirds = (props) => {
    const {user} = useAuth()

    return (
        <View style={[styles.container]}>
            <Greeting
                user={user}
            />
            <FlatList
                data={Constants.menuOptions}
                numColumns={2}
                renderItem={(obj)=>{
                    return <TouchableOpacity style={styles.menuItem} onPress={()=> {props.navigation.navigate(`Third${obj.item.screen}`, {user: user})}}>
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
        backgroundColor: Constants.backgroundColors['Thirds'],
    },
    greeting: {
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'white',
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
        backgroundColor: Constants.backgroundLightColors["Thirds"],
        alignItems: 'center',
    },
    menuItemText:{
        marginTop: 15,
        fontWeight: '700',
        fontSize: 18
    }
})

export default Thirds;