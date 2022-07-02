import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import THEME from '../../services/theme'
import * as Utils from '../../services/util'
import { USER_KIND_NAME } from '../../services/constants'

const AccessItem = (props) => {
  const getAccess = _ => {
    return (
      <View style={styles.AccessDetails}>
        <Text style={{ fontFamily: THEME.FONTS.r700 }}>Usuários</Text>
        {
          props.access.UserAccesses.map((ac, ind) => {
            return (
              <View style={{ marginBottom: 3 }} key={`us${ind}`}>
                <Text>{ind+1}. {ac.name}</Text>
                {!!ac.identification &&<Text>ID: {ac.identification}</Text>}
                {!!ac.company &&<Text>Empresa: {ac.company}</Text>}
              </View>
            )
          })
        }
        {!!props.access.VehicleAccesses?.length && <Text style={{ fontFamily: THEME.FONTS.r700, marginTop: 5 }}>Veículos</Text>}
        {
          !!props.access.VehicleAccesses?.length && props.access.VehicleAccesses.map((va, ind)=> {
            return (
              <View style={{ marginBottom: 3 }} key={`veh${ind}`}>
                <Text>{ind+1}.{va.maker} {va.model} {va.color}</Text>
                <Text>Placa: {va.plate}</Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
    <View style={styles.Item}>
      <Text><Text style={{ fontFamily: THEME.FONTS.r700 }}>{props.index}. Data: </Text>{Utils.printDateAndHour(new Date(props.access.updatedAt))}</Text>
      <Text><Text style={{ fontFamily: THEME.FONTS.r700 }}>Registro: </Text>{props.access.TypeAccess.type}</Text>
      <Text><Text style={{ fontFamily: THEME.FONTS.r700 }}>Tipo: </Text>{USER_KIND_NAME[props.access.user_kind_id]}</Text>
      <Text><Text style={{ fontFamily: THEME.FONTS.r700 }}>Unidade: </Text>Bloco {props.access.bloco_name} Unidade {props.access.unit_number}</Text>
      <Text><Text style={{ fontFamily: THEME.FONTS.r700 }}>Controlador de acesso: </Text>{props.access.ControllerAccess.name} (<Text style={{ fontFamily: THEME.FONTS.r400i }}>{USER_KIND_NAME[props.access.ControllerAccess.user_kind_id]}</Text>)</Text>
      {/* <Text style={{ fontFamily: THEME.FONTS.r700, marginTop: 5 }}>Acesso: </Text> */}
      {getAccess()}
    </View>
  );
};

const styles = StyleSheet.create({
  Item:{
    padding: 10,
    borderBottomWidth: 1,
  },
  AccessDetails:{
    marginTop: 10,
  }
});

export default AccessItem;