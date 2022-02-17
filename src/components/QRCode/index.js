import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const index = (props) => {
    const logo = require('../../../assets/logo.jpeg')

    return (
        <QRCode
            value={props.value}
            size={300}
            logo={logo}
            quietZone={30}
            logoBackgroundColor={props.backgroundColor || '#FFFFFF'}
            backgroundColor={props.backgroundColor || '#FFFFFF'}
        />
    );
};

export default index;