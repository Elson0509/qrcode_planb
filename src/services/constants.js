import Toast from 'react-native-root-toast';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker'

const { manifest } = Constants

export const apiurlPrefix = 'http://'
//export const apiurl = `qrcondoapp.herokuapp.com`
//lt --port 3333

export const apiurl = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev ? manifest.debuggerHost.split(`:`).shift().concat(`:3333`) : `api.example.com`;//*/

export const borderTextInputWidth = 0

export const ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
}

//scan qr code
export const QR_CODE_PREFIX = 'epw:'
export const TYPE_DATA_QRCODE = 256
export const MAX_COMMENT_SIZE = 500
export const is_autorized_backgroundColor = '#00B924'
export const is_not_autorized_backgroundColor = '#FF726F'

export const MIN_PASSWORD_SIZE = 6
export const MIN_NAME_SIZE = 7

export const PREFIX_IMG_GOOGLE_CLOUD = 'https://drive.google.com/uc?export=view&id='

export const genericProfilePic = require('../../assets/pics/generic-profile.png')

export const logoPic = require('../../assets/icon.png')

export const menuOptions = [
    { menuName: "Adicionar", icon: 'plus-square', key: 'plus', screen: 'Add' },
    { menuName: "Listar", icon: 'list-alt', key: 'list', screen: 'List' },
]

export const configToast = {
    duration: Toast.durations.LONG,
    animation: true,
    hideOnPress: true,
}

export const USER_KIND_NAME = {
    1: 'Morador',
    2: 'Guarda',
    3: 'Administrador',
    4: 'Visitante',
    5: 'Terceirizado',
    6: 'Sócio',
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
    "Cars":'#00CCEE',
    "Dashboard":'#00AAEE',
    "Events":'#FF7AC5',
    "Guards":'#CCCC00',
    "Info":'#F699CD',
    "MyQRCode":'#C1C1C1',
    "Residents":'#80E0B0',
    "Scan":'#FED8B1',
    "Slot": "#FFC55C",
    "Survey": '#5DBB63',
    "Thirds":'#FF7F7F',
    "Units":'#DEB887',
    "Visitors":'#9E8EEA',
    "Access": '#8E7B6C',
}

export const backgroundLightColors = {
    "Cars":'#8AFFFF',
    "Events":'#FF9CE7',
    "Guards":'#FFFF99',
    "Info":'#FEC5E5',
    "MyQRCode":'#EEEEEE',
    "Residents":'#DDFFDD',
    "Scan":'#FEE9C2',
    "Slot": "#FFD68A",
    "Survey": '#99EDC3',
    "Thirds":'#FFBFBF',
    "Units":'#FFEBCD',
    "Visitors":'#CFBFFF',
    "Access": '#DEBF8F',
}

export const backgroundDarkColors = {
    "Cars":'#00A2A2',
    "Dashboard":'#0088CC',
    "Events":'#DD58A3',
    "Guards":'#999900',
    "Info":'#FD5DA8',
    "MyQRCode":'#AAAAAA',
    "Residents":'#66CAB0',
    "Scan":'#DEB690',
    "Slot": "#FFB52E",
    "Survey": '#028A0F',
    "Thirds":'#CC5C5C',
    "Units":'#CD853F',
    "Visitors":'#7C6CC8',
    "Access": '#A85D4F',
}