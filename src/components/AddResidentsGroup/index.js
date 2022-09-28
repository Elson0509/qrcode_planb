import React from 'react';
import Icon from '../Icon';
import InputBox from '../InputBox';
import FooterButtons from '../FooterButtons';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import PicUser from '../PicUser';
import { useAuth } from '../../contexts/auth'
import DOBInputBox from '../DOBInputBox'

const AddResidentsGroup = (props) => {
  const { user } = useAuth()

  const addHandler = async _ => {
    if (await props.addResidentHandler()) {
      props.setAddingUser(false)
    }
  }

  const cancelHandler = _ => {
    props.cancelAddResidentHandler();
    props.setAddingUser(false)
  }

  return (
    <View style={[styles.container, { backgroundColor: props.backgroundColor || '#44FFAF' }]}>
      <TouchableOpacity style={[styles.button, { backgroundColor: props.backgroundColorButtons || '#00FF7F' }]} onPress={() => { props.setAddingUser(true) }}>
        <Icon name='user' size={40} />
        <Text>Adicionar Morador</Text>
      </TouchableOpacity>
      {
        props.residents.map(((el, ind) => (
          <View key={el.name + el.id + el.identification + el.email} style={[styles.listItem]}>
            <View style={{ flexDirection: 'row' }}>
              <PicUser user={el} />
              <View style={{ marginLeft: 5, marginRight: 5, maxWidth: 210 }}>
                <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Nome:</Text> {el.name}</Text>
                {!!el.email && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Email:</Text> {el.email}</Text>}
                {!!el.identification && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Id:</Text> {el.identification}</Text>}
                {!!el.phone && user.condo.resident_has_phone && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Tel:</Text> {el.phone}</Text>}
                {!!el.dob && user.condo.resident_has_dob && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Nascimento:</Text> {Utils.printDate(el.dob)}</Text>}
              </View>
            </View>

            <TouchableOpacity onPress={() => props.removeResident(ind)}>
              <Icon name='window-close' size={30} />
            </TouchableOpacity>
          </View>
        )))
      }
      {
        props.addingUser &&
        <View style={{ marginTop: 15 }}>
          <Text style={{ textAlign: 'center' }}>Dados do novo morador</Text>
          <InputBox
            text="Nome*:"
            value={props.userBeingAdded.name}
            changed={val => Utils.testWordWithNoSpecialChars(val) && props.setUserBeingAdded({ ...props.userBeingAdded, name: val })}
            autoCapitalize='words'
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Identidade:"
            value={props.userBeingAdded.identification}
            changed={val => props.setUserBeingAdded({ ...props.userBeingAdded, identification: val })}
            autoCapitalize='characters'
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          <InputBox
            text="Email:"
            value={props.userBeingAdded.email}
            changed={val => props.setUserBeingAdded({ ...props.userBeingAdded, email: val })}
            keyboard={'email-address'}
            autoCapitalize='none'
            backgroundColor={Constants.backgroundLightColors['Residents']}
            borderColor={Constants.backgroundDarkColors['Residents']}
            colorInput={Constants.backgroundDarkColors['Residents']}
          />
          {
            user.condo.resident_has_phone &&
            <InputBox
              text="Telefone:"
              value={props.userBeingAdded.phone}
              changed={val => props.setUserBeingAdded({ ...props.userBeingAdded, phone: val })}
              autoCapitalize='none'
              placeholder='(XX) 90000-0000'
              backgroundColor={Constants.backgroundLightColors['Residents']}
              borderColor={Constants.backgroundDarkColors['Residents']}
              colorInput={Constants.backgroundDarkColors['Residents']}
            />
          }
          {
            user.condo.resident_has_dob &&
            <DOBInputBox
              changed1={value => props.setDobBeingAdded({ ...props.dobBeingAdded, day: value })}
              changed2={value => props.setDobBeingAdded({ ...props.dobBeingAdded, month: value })}
              changed3={value => props.setDobBeingAdded({ ...props.dobBeingAdded, year: value })}
              text='Nascimento:'
              backgroundColor={props.backgroundColorInput || Constants.backgroundLightColors['Residents']}
              borderColor={props.borderColor || Constants.backgroundDarkColors['Residents']}
              colorInput={props.colorInput || Constants.backgroundDarkColors['Residents']}
              value1={props.dobBeingAdded.day}
              value2={props.dobBeingAdded.month}
              value3={props.dobBeingAdded.year}
            />
          }
          <Text style={styles.title}>Foto:</Text>
          {!props.userBeingAdded.pic &&
            <View style={styles.buttonAddPhotoGroup}>
              <TouchableOpacity
                style={[styles.buttonAddphotoIsClicked]}
                onPress={() => { props.photoClickHandler() }}
              >
                <Icon name="camera" size={18} />
                <Text>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAddphotoIsClicked, { marginLeft: 40 }]}
                onPress={() => { props.pickImage() }}
              >
                <Icon name="paperclip" size={18} />
                <Text>Arquivo</Text>
              </TouchableOpacity>
            </View>
            ||
            <View style={styles.buttonAddPhotoGroup}>
              <Image
                style={{ width: 66, height: 79, }}
                source={{ uri: props.userBeingAdded.pic }}
                resizeMode='contain'
              />
            </View>
          }
          {!!props.errorAddResidentMessage && <Text style={styles.errorMessage}>{props.errorAddResidentMessage}</Text>}
          <View style={styles.buttonAddPhotoGroup}>
            <FooterButtons
              action1={addHandler}
              action2={cancelHandler}
              title1={props.buttonText || "Adicionar"}
              title2="Cancelar"
              buttonPadding={10}
              backgroundColor='#44FFAF'
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
    borderWidth: 0.5,
    // borderStyle: 'dotted'
  },
  button: {
    alignItems: 'center',
    padding: 3,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 10,
  },
  menuItemText: {

  },
  menuItemTextPrefix: {
    fontWeight: 'bold',
  },
  listItem: {
    padding: 3,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonAddphotoIsClicked: {
    borderRadius: 8,
    backgroundColor: Constants.backgroundLightColors['Residents'],
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  buttonAddPhotoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'red',
    padding: 5,
  }
})

export default AddResidentsGroup;