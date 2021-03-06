import React from 'react';
import { View, ActivityIndicator } from 'react-native'

const Spinner = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#666"/>
        </View>
    );
};

export default Spinner;