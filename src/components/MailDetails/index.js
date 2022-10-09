import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import THEME from '../../services/theme'
import { useAuth } from '../../contexts/auth';

const style = {
  width: 69,
  height: 92,
  marginRight: 5
}

const MailDetails = props => {
  const { user } = useAuth()

  return (
    <View style={styles.menuItem}>
      {/* <View>
        <ActionButtons
          flexDirection='row'
          editIcon='reply'
          action1={() => replyHandler(obj.item)}
          action2={() => delOvernight(obj.item)}
        />
      </View> */}
      <View style={{ 
          flexDirection: 'column', 
          paddingBottom: 3, 
          marginBottom: 5, 
          borderColor: Constants.backgroundDarkColors["Cars"] 
          }}>
        <View style={styles.image}>
          {
            props.mail.photo_id ?
              <Image
                style={style}
                source={{ uri: Constants.PREFIX_IMG_GOOGLE_CLOUD + props.mail.photo_id }}
                resizeMode='contain'
              />
              :
              <Image
                style={style}
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
  image:{
    alignItems: 'center',
  }
});

export default MailDetails;