import React from 'react'
import Icon from '../Icon'
import InputBox from '../InputBox'
import FooterButtons from '../FooterButtons'
import * as Constants from '../../services/constants'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

const AddCarsGroup = (props) => {
  const addHandler = async _ => {
    if (await props.addVehicleHandler()) {
      props.setAddingVehicle(false)
    }
  }

  const cancelHandler = _ => {
    props.cancelVehicleHandler();
    props.setAddingVehicle(false)
  }

  const changePlate = val => {
    if (val.length > 7)
      return
    const vehicle = { ...props.vehicleBeingAdded, plate: val }
    props.setVehicleBeingAdded(vehicle)
  }

  return (
    <View style={[styles.container, { backgroundColor: props.backgroundColor || '#44FFAF' }]}>
      <TouchableOpacity style={[styles.button, { backgroundColor: props.backgroundColorButtons || '#00FF7F' }]} onPress={() => { props.setAddingVehicle(true) }}>
        <Icon name='car' size={40} />
        <Text>Adicionar Veículo</Text>
      </TouchableOpacity>
      {
        props.data.map((el, ind) => (
          <View key={ind} style={[styles.listItem]}>
            <View style={{ marginRight: 5, maxWidth: 210 }}>
              <Text style={styles.menuItemText}>{el.maker} {el.model} {el.color}</Text>
              <Text style={styles.menuItemText}>Placa: {el.plate.toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={() => props.removeVehicle(ind)}>
              <Icon name='window-close' size={30} />
            </TouchableOpacity>
          </View>
        ))
      }
      {
        props.addingVehicle &&
        <View>
          <InputBox
            text="Fabricante*:"
            value={props.vehicleBeingAdded.maker}
            changed={val => props.setVehicleBeingAdded({ ...props.vehicleBeingAdded, maker: val })}
            autoCapitalize='words'
            backgroundColor={props.backgroundLightColor || Constants.backgroundLightColors['Residents']}
            borderColor={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
            colorInput={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Modelo*:"
            value={props.vehicleBeingAdded.model}
            changed={val => props.setVehicleBeingAdded({ ...props.vehicleBeingAdded, model: val })}
            autoCapitalize='words'
            backgroundColor={props.backgroundLightColor || Constants.backgroundLightColors['Residents']}
            borderColor={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
            colorInput={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Cor*:"
            value={props.vehicleBeingAdded.color}
            changed={val => props.setVehicleBeingAdded({ ...props.vehicleBeingAdded, color: val })}
            autoCapitalize='words'
            backgroundColor={props.backgroundLightColor || Constants.backgroundLightColors['Residents']}
            borderColor={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
            colorInput={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Placa*:"
            value={props.vehicleBeingAdded.plate}
            changed={changePlate}
            autoCapitalize='characters'
            autoCorrect={false}
            backgroundColor={props.backgroundLightColor || Constants.backgroundLightColors['Residents']}
            borderColor={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
            colorInput={props.backgroundDarkColor || Constants.backgroundDarkColors['Residents']}
          />
          {!!props.errorAddVehicleMessage && <Text style={styles.errorMessage}>{props.errorAddVehicleMessage}</Text>}
          <View>
            <FooterButtons
              action1={addHandler}
              action2={cancelHandler}
              title1="Incluir veículo"
              title2="Cancelar"
              buttonPadding={10}
              backgroundColor={props.backgroundColor || '#44FFAF'}
              fontSize={18}
            />
          </View>
        </View>
      }
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dotted',
  },
  button: {
    alignItems: 'center',
    padding: 3,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 10,
  },
  listItem: {
    padding: 3,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorMessage: {
    color: '#F77',
    backgroundColor: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#F77',
    padding: 5,
  }
})

export default AddCarsGroup;