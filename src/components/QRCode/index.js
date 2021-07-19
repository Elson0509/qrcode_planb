import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const index = (props) => {
    const logo = require('../../../assets/logo.png')

    return (
        <QRCode
            value={props.value}
            size={300}
            logo={logo}
            backgroundColor='#FFEFFF'
        />
    );
};

export default index;