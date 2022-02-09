import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList,
} from 'react-native';
import * as Constants from '../../services/constants'
import { useAuth } from '../../contexts/auth';
import Icon from '../../components/Icon';
import Greeting from '../../components/Greeting/Greeting';

const Dashboard = (props) => {
    const { user } = useAuth()

    const menuOptionsQRCode = { menuName: "Meu QR Code", icon: 'qrcode', key: 'QRCode', screen: 'MyQRCode', backgroundColor: Constants.backgroundColors['MyQRCode'] }
    const menuOptionsScan = { menuName: "Escanear", icon: 'camera', key: 'Scan', screen: 'Scan', backgroundColor: Constants.backgroundColors['Scan'] }
    const menuOptionsUnits = { menuName: "Unidades", icon: 'building', key: 'building', screen: 'Units', backgroundColor: Constants.backgroundColors['Units'] }
    const menuOptionsResidentsToGuard = { menuName: "Moradores", icon: 'house-user', key: 'residentGuard', screen: 'ResidentList', backgroundColor: Constants.backgroundColors['Residents'] }
    const menuOptionsResidents = { menuName: "Moradores", icon: 'house-user', key: 'resident', screen: 'Residents', backgroundColor: Constants.backgroundColors['Residents'] }
    const menuOptionsVisitor = { menuName: "Visitantes", icon: 'user-friends', key: 'visitor', screen: 'Visitors', backgroundColor: Constants.backgroundColors['Visitors'] }
    const menuOptionsService = { menuName: "Terceirizados", icon: 'people-carry', key: 'service', screen: 'Thirds', backgroundColor: Constants.backgroundColors['Thirds'] } //permissionário
    const menuOptionsGuard = { menuName: "Colaboradores", icon: 'user-shield', key: 'guard', screen: 'Guards', backgroundColor: Constants.backgroundColors['Guards'] }
    const menuOptionsCarSuperIntendent = { menuName: "Pernoite", icon: 'car', key: 'car', screen: 'Car', backgroundColor: Constants.backgroundColors['Cars'] }
    const menuOptionsCarGuard = { menuName: "Pernoite", icon: 'car', key: 'car', screen: 'CarSearch', backgroundColor: Constants.backgroundColors['Cars'] }
    const menuOptionsEventResident = { menuName: "Ocorrências", icon: 'exclamation', key: 'event', screen: 'EventAdd', backgroundColor: Constants.backgroundColors['Events'] }
    const menuOptionsEventGuard = { menuName: "Ronda", icon: 'exclamation', key: 'event', screen: 'EventAdd', backgroundColor: Constants.backgroundColors['Events'] }
    const menuOptionsEventSuperintendent = { menuName: "Ronda", icon: 'exclamation', key: 'event', screen: 'EventsGuard', backgroundColor: Constants.backgroundColors['Events'] }
    const menuOptionsSurvey = { menuName: "Avaliação", icon: 'smile', key: 'pesquisa', screen: 'Survey', backgroundColor: Constants.backgroundColors['Survey'] }
    const menuOptionsInfo = { menuName: "Informações", icon: 'info-circle', key: 'info', screen: 'Info', backgroundColor: Constants.backgroundColors['Info'] }
    const menuOptionsCondo = { menuName: "Condomínios", icon: 'city', key: 'condo', screen: 'Condo', backgroundColor: Constants.backgroundColors['Residents'] }
    const menuOptionsSindico = { menuName: "Administradores", icon: 'users-cog', key: 'sindico', screen: 'Sindico', backgroundColor: Constants.backgroundColors['Visitors'] }
    const menuOptionsSlot = { menuName: "Estacionamento", icon: 'car-side', key: 'slot', screen: 'Slot', backgroundColor: Constants.backgroundColors['Slot'] }

    const profiles = []
    profiles[Constants.USER_KIND['RESIDENT']] = [menuOptionsQRCode, menuOptionsEventResident, menuOptionsSurvey]
    profiles[Constants.USER_KIND['GUARD']] = [menuOptionsQRCode, menuOptionsScan, menuOptionsResidentsToGuard, menuOptionsVisitor, menuOptionsService, menuOptionsCarGuard, menuOptionsEventGuard, menuOptionsSlot]
    profiles[Constants.USER_KIND['SUPERINTENDENT']] = [menuOptionsQRCode, menuOptionsScan, menuOptionsUnits, menuOptionsResidents, menuOptionsVisitor, menuOptionsService, menuOptionsGuard, menuOptionsCarSuperIntendent, menuOptionsEventSuperintendent, menuOptionsSlot]
    profiles[Constants.USER_KIND['ADM']] = [menuOptionsCondo, menuOptionsSindico]

    return (
        <View style={styles.container}>
            <Greeting
                user={user}
            />
            <FlatList
                data={profiles[user.user_kind]}
                numColumns={3}
                renderItem={(obj) => {
                    return (
                        <TouchableOpacity style={styles.menuItem} onPress={() => { props.navigation.navigate(obj.item.screen, { user: user, backgroundColor: obj.item.backgroundColor }) }}>
                            <View style={[styles.menuIcon, { backgroundColor: obj.item.backgroundColor }]}>
                                <Icon name={obj.item.icon} size={55} color='white' />
                            </View>
                            <Text style={styles.menuItemText}>{obj.item.menuName}</Text>
                        </TouchableOpacity>
                    )
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
        paddingBottom: 10
    },
    menuItem: {
        width: '30%',
        height: 140,
        marginLeft: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    menuIcon: {
        width: '100%',
        height: '80%',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuItemText: {
        marginTop: 5,
        fontWeight: '700',
        fontSize: 13
    }
})

export default Dashboard;