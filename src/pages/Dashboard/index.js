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
import MyQRCode from '../MyQRCode';
import * as utils from '../../services/util'
import Icon from '../../components/Icon';

const Dashboard = (props) => {
    const {signOut, user} = useAuth()

    const handleSignOut = _ =>{
        signOut()
    }

    const menuOptionsQRCode = { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', screen: 'MyQRCode' }
    const menuOptionsScan = { menuName: "Escanear", icon: 'camera', key: 'Scan', screen: 'Scan' }
    const menuOptionsAddHome = { menuName: "Moradores", icon: 'home', key: 'AddHome' }
    const menuOptionsAddVisitor = { menuName: "Visitantes", icon: 'user-plus', key: 'AddVisitor' }
    const menuOptionsAddService = { menuName: "Terceirizados", icon: 'people-carry', key: 'AddService' } //permissionário

    const profiles = []
    profiles[1]=[]
    //Segurança
    profiles[1].push(menuOptionsQRCode, menuOptionsScan, menuOptionsAddHome, menuOptionsAddVisitor, menuOptionsAddService)

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