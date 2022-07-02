import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Utils from '../../services/util'
import ModalGeneric from '../ModalGeneric'
import DateInputBox from '../DateInputBox'
import { Picker } from '@react-native-picker/picker'
import THEME from '../../services/theme'

const ModalEventsFilter = props => {
  const [errorMessage, setErrorMessage] = useState('')

  const confirmHandler = _ => {
    if (!Utils.isValidDate(props.dateInit.day, props.dateInit.month, props.dateInit.year)) {
      return setErrorMessage('Data inicial não é válida.')
    }
    if (!Utils.isValidDate(props.dateEnd.day, props.dateEnd.month, props.dateEnd.year)) {
      return setErrorMessage('Data final não é válida.')
    }
    const dateInicial = new Date(props.dateInit.year, props.dateInit.month - 1, props.dateInit.day)
    const dateFinal = new Date(props.dateEnd.year, props.dateEnd.month - 1, props.dateEnd.day)

    if (dateFinal < dateInicial) {
      return setErrorMessage('Data final precisa ser após a data inicial')
    }
    setErrorMessage('')
    props.selectedDatesHandler()
  }

  return (
    <ModalGeneric
      modalVisible={props.modal}
      setModalVisible={props.setModal}
      btn1Text='Enviar'
      btn2Text='Cancelar'
      btn1Pressed={confirmHandler}
      title='Filtro de eventos'
    >
      <DateInputBox
        changed1={(value) => props.setDateInit({ ...props.dateInit, day: value })}
        changed2={(value) => props.setDateInit({ ...props.dateInit, month: value })}
        changed3={(value) => props.setDateInit({ ...props.dateInit, year: value })}
        text='Data inicial'
        borderColor={'black'}
        value1={props.dateInit.day}
        value2={props.dateInit.month}
        value3={props.dateInit.year}
        borderWidth={1}
      />
      <DateInputBox
        changed1={(value) => props.setDateEnd({ ...props.dateEnd, day: value })}
        changed2={(value) => props.setDateEnd({ ...props.dateEnd, month: value })}
        changed3={(value) => props.setDateEnd({ ...props.dateEnd, year: value })}
        text='Data final'
        borderColor={'black'}
        value1={props.dateEnd.day}
        value2={props.dateEnd.month}
        value3={props.dateEnd.year}
        borderWidth={1}
      />
      <View>
        <Text style={[styles.labelStyle, { color: 'black', fontSize: 13, marginBottom: 5, marginLeft: 5, fontFamily: THEME.FONTS.r900}]}>Tipo de ocorrência</Text>
        <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 5, padding: 0 }}>
          <Picker
            selectedValue={props.selectedOccorrenceType}
            onValueChange={(itemValue) =>
              props.setSelectedOccorrenceType(itemValue)
            }>
              <Picker.Item label="Todos" value={0} />
              {
                props.occurrenceTypes.map((occurrenceType) => {
                  return <Picker.Item key={occurrenceType.id} label={occurrenceType.type} value={occurrenceType.id} />
                })
              }            
          </Picker>
        </View>
      </View>
      {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </ModalGeneric>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    color: '#F77',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#F77',
    padding: 2,
  },
})

export default ModalEventsFilter;