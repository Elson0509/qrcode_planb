import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import THEME from '../../services/theme'
import { useAuth } from '../../contexts/auth';

const Info = () => {
  const { user } = useAuth()

  return (
    <SafeAreaView style={styles.body}>
      {
        !!user.condo.photo_id ?
          <Image
            style={styles.image}
            source={{ uri: `${Constants.PREFIX_IMG_GOOGLE_CLOUD}${user.condo.photo_id}` }}
          />
          :
          <Image style={styles.image} resizeMode="contain" source={require('../../../assets/condo.jpg')} />
      }
      <View style={styles.textBox}>
        <Text style={styles.text}>Condomínio</Text>
        <Text style={styles.text}>{user.condo.name}</Text>
        {!!user.condo.created_at && <Text style={styles.textMember}>Membro desde {Utils.printDate(new Date(user.condo.created_at))}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: Constants.backgroundColors['MyQRCode'],
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    //justifyContent: 'center'
  },
  textBox: {
    paddingTop: 20,
    alignItems: 'center',
  },
  text: {
    fontFamily: THEME.FONTS.r500,
    fontSize: 20,
    textAlign: 'center',
  },
  textMember: {
    paddingTop: 20,
    fontFamily: THEME.FONTS.r300,
    fontSize: 15,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default Info