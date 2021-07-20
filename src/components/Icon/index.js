import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons'

const Icon = (props) => {
    return (
        <FontAwesome5
            name={props.name}
            size={props.size || 24}
            color={props.color || 'black'}
        />
    );
};

export default Icon;