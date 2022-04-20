import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Placa from '../Placa';
import THEME from '../../services/theme'

const InfoCars = (props) => {
  return (
    <View>
      {props.vehicles?.length > 0 && <Text style={[styles.subTitle, { fontFamily: THEME.FONTS.r500 }]}>Veículos:</Text>}
      {(!props.vehicles || props.vehicles.length === 0) && <Text style={{ marginTop: 10, fontFamily: THEME.FONTS.r300 }}>Sem veículos cadastrados</Text>}
      {
        props.vehicles?.map((car, ind) => {
          return (
            <View key={ind} style={styles.plateDiv}>
              <Text style={{ fontFamily: THEME.FONTS.r500 }}>{`${car.maker} ${car.model} ${car.color}`}</Text>
              <Placa placa={car.plate} />
            </View>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center'
  },
  plateDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10
  }
});

export default InfoCars;