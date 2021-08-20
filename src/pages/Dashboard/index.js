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
import * as Constants from '../../services/constants'
import { useAuth } from '../../contexts/auth';
import MyQRCode from '../MyQRCode';
import * as utils from '../../services/util'
import Icon from '../../components/Icon';
import Greeting from '../../components/Greeting/Greeting';

const Dashboard = (props) => {
    const {user} = useAuth()

    const menuOptionsQRCode = { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', screen: 'MyQRCode', backgroundColor: Constants.backgroundColors['MyQRCode'] }
    const menuOptionsScan = { menuName: "Escanear", icon: 'camera', key: 'Scan', screen: 'Scan', backgroundColor: Constants.backgroundColors['Scan'] }
    const menuOptionsUnits = { menuName: "Unidades", icon: 'building', key: 'building', screen: 'Units', backgroundColor: Constants.backgroundColors['Units'] }
    const menuOptionsResidents = { menuName: "Moradores", icon: 'house-user', key: 'resident', screen: 'Residents', backgroundColor: Constants.backgroundColors['Residents'] }
    const menuOptionsVisitor = { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', screen: 'Visitors', backgroundColor: Constants.backgroundColors['Visitors'] }
    const menuOptionsService = { menuName: "Terceirizados", icon: 'people-carry', key: 'service', screen: 'Thirds', backgroundColor: Constants.backgroundColors['Thirds'] } //permissionário
    const menuOptionsInfo = { menuName: "Informações", icon: 'info-circle', key: 'info', screen: 'Info', backgroundColor: Constants.backgroundColors['Info'] }

    const profiles = []
    profiles[2]=[]
    profiles[3]=[]
    //Segurança
    profiles[2].push(menuOptionsQRCode, menuOptionsScan)
    profiles[3].push(menuOptionsQRCode, menuOptionsScan, menuOptionsUnits, menuOptionsResidents, menuOptionsVisitor, menuOptionsService, menuOptionsInfo)

    if(user.user_kind==1){
        return <MyQRCode user={user}/>
    }

    return (
        <View style={styles.container}>
            <Greeting
                user={user}
            />
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
        backgroundColor: Constants.backgroundColors['Dashboard'],
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
        backgroundColor: 'white',
        alignItems: 'center',
    },
    menuItemText:{
        marginTop: 15,
        fontWeight: '700',
        fontSize: 14
    }
})

export default Dashboard;