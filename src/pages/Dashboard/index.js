import React from 'react';
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    ImageBackground,
    Text,
    FlatList,
    Animated,
    Keyboard,
    } from 'react-native';

import { useAuth } from '../../contexts/auth';
import MyQRCode from '../MyQRCode';
import * as utils from '../../services/util'
import Icon from '../../components/Icon';

const Dashboard = (props) => {
    const {user} = useAuth()

    const menuOptionsQRCode = { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', screen: 'MyQRCode', backgroundColor:'#dddddd' }
    const menuOptionsScan = { menuName: "Escanear", icon: 'camera', key: 'Scan', screen: 'Scan', backgroundColor:'#fed8b1' }
    const menuOptionsResidents = { menuName: "Moradores", icon: 'house-user', key: 'resident', screen: 'Residents', backgroundColor:'#99edc3' }
    const menuOptionsVisitor = { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', screen: 'Visitors', backgroundColor:'#9e8eea'  }
    const menuOptionsService = { menuName: "Terceirizados", icon: 'people-carry', key: 'service', screen: 'Thirds', backgroundColor:'#ff7f7f'  } //permissionário

    const profiles = []
    profiles[1]=[]
    profiles[2]=[]
    //Segurança
    profiles[1].push(menuOptionsQRCode, menuOptionsScan)
    profiles[2].push(menuOptionsQRCode, menuOptionsScan, menuOptionsResidents, menuOptionsVisitor, menuOptionsService)

    if(user.user_kind==0){
        return <MyQRCode user={user}/>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{utils.saudacaoHorario(user?.name)}</Text>
            <FlatList
                data={profiles[user.user_kind]}
                numColumns={2}
                
                renderItem={(obj)=>{
                    return <TouchableOpacity style={[styles.menuItem, {backgroundColor: obj.item.backgroundColor }]} onPress={()=> {props.navigation.navigate(obj.item.screen, {user: user, backgroundColor: obj.item.backgroundColor})}}>
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
        backgroundColor: '#00AAEE'
        //justifyContent: 'center',
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
        
        //alignItems: 'center',
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
        backgroundColor: 'white',
        alignItems: 'center',
    },
    menuItemText:{
        marginTop: 15,
        fontWeight: '700',
        fontSize: 18
    }
})

export default Dashboard;