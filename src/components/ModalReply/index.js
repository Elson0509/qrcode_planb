import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import CommentBox from '../CommentBox';
import ModalGeneric from '../ModalGeneric';
import InputBox from '../InputBox'

const index = (props) => {
    return (
        <ModalGeneric
              modalVisible={props.modal}
              setModalVisible={props.setModal}
              btn1Text='Enviar'
              btn2Text='Cancelar'
              btn1Pressed={props.sendHandler}
            >
              <InputBox
                text='Assunto'
                value={props.subject}
                changed={props.setSubject}
                width={250}
              />
              <CommentBox
                text="Resposta"
                setValue={props.setReplyMessage}
                value={props.replyMessage}
              />
        </ModalGeneric>
    );
};

export default index;