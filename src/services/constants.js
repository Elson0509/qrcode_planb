import Toast from 'react-native-root-toast';

export const borderTextInputWidth = 3

export const QR_CODE_PREFIX = 'epw:'
export const TYPE_DATA_QRCODE = 256

export const is_autorized_backgroundColor = '#00B924'
export const is_not_autorized_backgroundColor = '#FF726F'
import Constants from 'expo-constants';
const { manifest } = Constants

export const apiurlPrefix = 'http://'
//export const apiurl = `purple-goose-66.loca.lt`

export const apiurl = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? manifest.debuggerHost.split(`:`).shift().concat(`:3333`)
  : `api.example.com`;//*/

export const genericProfilePic = require('../../assets/pics/generic-profile.png')

export const menuOptions = [
    { menuName: "Adicionar", icon: 'plus-square', key: 'plus', screen: 'Add' },
    { menuName: "Listar", icon: 'list-alt', key: 'list', screen: 'List' },
]

// export const menuOptions = [
//     { menuName: "Adicionar", icon: 'user-plus', key: 'plus', screen: 'Add' },
//     { menuName: "Listar", icon: 'users', key: 'list', screen: 'List' },
// ]

export const configToast = {
    duration: Toast.durations.SHORT,
    animation: true,
    hideOnPress: true,
}

export const USER_KIND = {
    'RESIDENT': 1,
    'GUARD': 2,
    'SUPERINTENDENT': 3,
    'VISITOR': 4,
    'THIRD': 5,
    'ADM': 6,
}

export const backgroundColors = {
    "Dashboard":'#00AAEE',
    "MyQRCode":'#C1C1C1',
    "Units":'#DEB887',
    "Scan":'#FED8B1',
    "Residents":'#80E0B0',
    "Visitors":'#9E8EEA',
    "Thirds":'#FF7F7F',
    "Info":'#F699CD',
}
export const backgroundLightColors = {
    "MyQRCode":'#EEEEEE',
    "Scan":'#FEE9C2',
    "Units":'#FFEBCD',
    "Residents":'#DDFFDD',
    "Visitors":'#CFBFFF',
    "Thirds":'#FFBFBF',
    "Info":'#FEC5E5',
}
export const backgroundDarkColors = {
    "Dashboard":'#0088CC',
    "MyQRCode":'#AAAAAA',
    "Scan":'#DEB690',
    "Units":'#CD853F',
    "Residents":'#66CAB0',
    "Visitors":'#7C6CC8',
    "Thirds":'#CC5C5C',
    "Info":'#FD5DA8',
}
