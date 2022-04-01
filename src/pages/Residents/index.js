import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList,
} from 'react-native';

import { useAuth } from '../../contexts/auth';
import Icon from '../../components/Icon';
import * as Constants from '../../services/constants'
import Greeting from '../../components/Greeting/Greeting';

const Residents = (props) => {
    const { user } = useAuth()

    const menuOptionsResidents = []

    if (user.user_kind == Constants.USER_KIND['SUPERINTENDENT']) {
        menuOptionsResidents.push({ menuName: "Adicionar", icon: 'plus-square', key: 'plus', screen: 'Add' })
    }
    menuOptionsResidents.push({ menuName: "Listar", icon: 'list-alt', key: 'list', screen: 'List' })

    return (
        <View style={[styles.container]}>
            <Greeting
                user={user}
            />
            <FlatList
                data={menuOptionsResidents}
                numColumns={2}
                renderItem={(obj) => {
                    return (
                        <TouchableOpacity style={styles.menuItem} onPress={() => { props.navigation.navigate(`Resident${obj.item.screen}`, { user: user }) }}>
                            <View style={[styles.menuIcon, { backgroundColor: Constants.backgroundColors['Residents'] }]}>
                                <Icon name={obj.item.icon} size={85} color='white' />
                            </View>
                            <Text style={[{fontFamily: THEME.FONTS.r500}, styles.menuItemText]}>{obj.item.menuName}</Text>
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
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    menuItem: {
        width: '46%',
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
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuItemText: {
        marginTop: 5,
        fontSize: 16,
        letterSpacing: 1
    }
})

export default Residents;