import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import THEME from '../../services/theme'
import * as Utils from '../../services/util'
import PicUser from '../PicUser'
import ModalPhoto from '../ModalPhoto'
import ActionButtons from '../ActionButtons'
import { useAuth } from '../../contexts/auth'
import * as Constants from '../../services/constants'

const VisitorsView = (props) => {
  const { user } = useAuth()
  const [isModalPhotoActive, setIsModalPhotoActive] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  let beginOfDay = new Date()
  beginOfDay.setHours(0)
  beginOfDay.setMinutes(0)
  beginOfDay.setSeconds(0)
  beginOfDay.setMilliseconds(0)

  const onClickPhotoHandler = async item => {
    if (await Utils.handleNoConnection()) return
    if (!item.photo_id)
      return
    setSelectedUser(item)
    setIsModalPhotoActive(true)
  }

  return (
    <View>
      {(!props.residents || props.residents.length === 0) && <Text style={{ marginTop: 10, textDecorationLine: 'underline' }}>Unidade sem {props.type.toLowerCase()}</Text>}
      {props.residents.length > 0 && <Text style={[styles.subTitle, { fontFamily: THEME.FONTS.r500 }]}>{props.type}:</Text>}
      {
        props.residents.map((res) => {
          return (
            <View key={res.id} style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
              <View style={{ flexDirection: 'row', paddingBottom: 3, marginBottom: 5 }}>
                <TouchableOpacity onPress={() => onClickPhotoHandler(res)}>
                  <PicUser user={res} />
                </TouchableOpacity>
                <View>
                  <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r500 }}>{res.name}</Text>
                  {!!res.identification && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Id: {res.identification}</Text>}
                  {/* {!!res.email && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Email: {res.email}</Text>} */}
                  {!!res.company && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Empresa: {res.company}</Text>}
                  {!!res.initial_date && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Início: {Utils.printDate(new Date(res.initial_date))}</Text>}
                  {!!res.final_date && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Fim: {Utils.printDate(new Date(res.final_date))}</Text>}
                  {!!res.User?.name && <Text style={{ fontSize: 16, marginLeft: 7, fontFamily: THEME.FONTS.r400 }}>Autorizado por: {res.User.name} da Silva Oliveira</Text>}
                  {
                    !!res.final_date ?
                      <View>
                        {
                          new Date(res.final_date) >= beginOfDay ?
                            <Text style={{ fontSize: 16, marginLeft: 7 }}>
                              Status: Válido
                            </Text>
                            :
                            <Text style={{ fontSize: 16, marginLeft: 7, fontWeight: 'bold', color: 'red' }}>
                              Status: Expirado
                            </Text>
                        }
                      </View>
                      :
                      null
                  }
                </View>
              </View>
              {/* <View>
                {
                  user.user_kind === Constants.USER_KIND['SUPERINTENDENT'] || user.user_kind === Constants.USER_KIND['RESIDENT'] ?
                  <ActionButtons
                    editIcon='user-edit'
                    closeIcon='user-slash'
                    iconSize={20}
                    action1={() => props.editUserHandler(res)}
                    action2={() => props.deleteUserHandler(res)}
                  />
                  :
                  null
                }
              </View> */}
            </View>
          )
        })
      }
      <ModalPhoto
        modalVisible={isModalPhotoActive}
        setModalVisible={setIsModalPhotoActive}
        id={selectedUser?.photo_id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    marginLeft: 7
  }
});

export default VisitorsView;