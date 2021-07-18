import React, {useContext} from 'react';
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Text,
    Animated,
    Keyboard
    } from 'react-native';
import AuthContext from '../../contexts/auth';

const Dashboard = () => {
    const {signOut} = useContext(AuthContext)

    const handleSignOut = _ =>{
        signOut()
    }

    return (
        <View>
            <TouchableOpacity style={{backgroundColor:'#e456a1', padding: 12}} onPress={handleSignOut}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Dashboard;