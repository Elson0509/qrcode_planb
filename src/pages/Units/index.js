import React from 'react';
import {
    StyleSheet,
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

const Units = (props) => {
    const { user } = useAuth()

    return (
        <View style={[styles.container]}>
            <Greeting
                user={user}
            />
            <FlatList
                data={Constants.menuOptions}
                numColumns={2}
                renderItem={(obj) => {
                    return (
                        <TouchableOpacity style={styles.menuItem} onPress={() => { props.navigation.navigate(`Unit${obj.item.screen}`, { user: user }) }}>
                            <View style={[styles.menuIcon, { backgroundColor: Constants.backgroundColors['Units'] }]}>
                                <Icon name={obj.item.icon} size={85} color='white'/>
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
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1
    }
})

export default Units;