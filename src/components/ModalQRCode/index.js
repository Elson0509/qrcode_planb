import React, {useRef, useState} from 'react';
import { StyleSheet, Modal, Text, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import FooterButtons from '../FooterButtons';

const ModalQRCode = (props) => {
    const logo = require('../../../assets/logo.png')
    let myQrCode = useRef()
    
    const shareQRCode = _ => {
        myQrCode.toDataURL((dataURL)=>{
          const filename = FileSystem.documentDirectory + 'qrcode.png'
          FileSystem.writeAsStringAsync(filename, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
          }).then(()=>{
            Sharing.shareAsync(filename)
          });
        })
    }

    return (
        <Modal
          visible={props.modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={()=> props.setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            {!!props.text && <Text style={{textAlign: 'center', fontSize: 17, fontWeight: 'bold'}}>{props.text}</Text>}
              <QRCode
                getRef={ref=> (myQrCode = ref)}
                value={[{data: props.value, mode:'byte'}]}
                size={300}
                quietZone={30}
                logo={logo}
                logoBackgroundColor={props.backgroundColor || '#FFFFFF'}
                backgroundColor={props.backgroundColor || '#FFFFFF'}
              />
              <TouchableOpacity 
                onPress={()=>shareQRCode()}
                style={{backgroundColor: 'green',}}
              >
              <FooterButtons
                title1='Compartilhar'
                title2='Fechar'
                buttonPadding={16}
                fontSize={16}
                action1={()=>shareQRCode()}
                action2={()=> props.setModalVisible(false)}
              />
              </TouchableOpacity>
          </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'white'
    },
});

export default ModalQRCode;