import React from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import THEME from '../../services/theme'
import { useAuth } from '../../contexts/auth'
import FooterButtons from '../../components/FooterButtons';

const MailDetails = props => {
  const { user } = useAuth()

  return (
    <View style={styles.menuItem}>
      <View style={{ 
          flexDirection: 'column', 
          paddingBottom: 3, 
          marginBottom: 5, 
          borderColor: Constants.backgroundDarkColors["Cars"] 
          }}>
        <View style={styles.imageView}>
          {
            props.mail.photo_id ?
              <Image
                style={styles.image}
                source={{ uri: Constants.PREFIX_IMG_GOOGLE_CLOUD + props.mail.photo_id }}
                resizeMode='contain'
              />
              :
              <Image
                style={styles.image}
                source={Constants.genericParcel}
                resizeMode='contain'
              />
          }
        </View>
        <View>
          <Text style={styles.textDetail}><Text style={styles.textField}>Rastreio:</Text> {props.mail.tracking_code}</Text>
          <Text style={styles.textDetail}><Text style={styles.textField}>Data:</Text> {Utils.printDateAndHour(new Date(props.mail.createdAt))}</Text>
          {
            !!props.mail.notes ?
              <Text style={styles.textDetail}><Text style={styles.textField}>Obs:</Text> {props.mail.notes}</Text>
              :
              null
          }
          {
            user.user_kind != Constants.USER_KIND['RESIDENT'] &&
            <Text style={styles.textDetail}><Text style={styles.textField}>Obs:</Text> Bloco {props.mail.Unit.Bloco.name} Unidade {props.mail.Unit.number}</Text>
          }
        </View>
        {
          (user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] || user.user_kind === Constants.USER_KIND['GUARD']) &&
          props.mail.status === Constants.MAIL_STATUS['Em espera'] && !props.noFooter &&
          <View> 
            <FooterButtons
              title1='Dar Baixa'
              title2='Excluir'
              buttonPadding={12}
              fontSize={15}
              viewPadding={0}
              marginButton={0}
              borderRadius={10}
              action1={() => props.classifyMailHandler(props.mail)}
              action2={() => props.deleteMailHandler(props.mail)}
            />
          </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  textDetail: {
    fontSize: 12,
    marginLeft: 7,
    fontFamily: THEME.FONTS.r400,
  },
  textField: {
    fontFamily: THEME.FONTS.r700,
  },
  imageView:{
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200
  }
});

export default MailDetails;