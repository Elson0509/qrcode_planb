import React from 'react';
import { StyleSheet, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import * as Constants from '../../services/constants'

const ModalPhoto = (props) => {
  return (
    <Modal
      visible={props.modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => props.setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        {
          !!props.id && <Image
            style={{ width: '100%', height: '100%' }}
            source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${props.id}` }}
            resizeMode='contain'
          />
        }
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 10,
          left: '42%',
          padding: 10,
          backgroundColor: 'white'
        }}
        onPress={() => props.setModalVisible(false)}
      >
        <Icon name="window-close" color="red" size={40} />
      </TouchableOpacity>
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

export default ModalPhoto;