import React from 'react';
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
import { useAuth } from '../../contexts/auth';

const Dashboard = () => {
    const {signOut, user} = useAuth()

    const handleSignOut = _ =>{
        signOut()
    }

    return (
        <View>
            <TouchableOpacity style={{backgroundColor:'#e456a1', padding: 12}} onPress={handleSignOut}>
                <Text>Logout</Text>
                
            </TouchableOpacity>
            <Text>{user?.name}</Text>
        </View>
    );
};

export default Dashboard;