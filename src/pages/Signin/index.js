import React, {useState, useEffect} from 'react';
import ModalForgetPassword from '../../components/ModalForgetPassword';
import ModalGeneric from '../../components/ModalGeneric'
import { useAuth } from '../../contexts/auth';
import { StyleSheet,
   TextInput,
   View,
   KeyboardAvoidingView,
   Image,
   TouchableOpacity,
   Text,
   Animated,
   Keyboard
   } from 'react-native';

export default function Signin() {

  const [offset] = useState(new Animated.ValueXY({x:0, y:90}))
  const [opacity] = useState(new Animated.Value(0))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgetPasswordModal, setForgetPasswordModal] = useState(false)
  const { signIn, errorMessage } = useAuth()

  const handleSignIn = async _ =>{
    Keyboard.dismiss()
    signIn(email, password)
  }

  useEffect(()=>{
    Animated.parallel([
      Animated.spring(offset.y, {
        useNativeDriver: true,
        toValue: 0,
        speed: 4,
        bounciness: 20
      }),
      Animated.timing(opacity, {
        useNativeDriver: true,
        toValue: 1,
        duration: 500,
      })
    ]).start()
  }, [])

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image style={styles.logo}
          source={require('../../../assets/logo.png')}
          resizeMode='contain'
        />
      </View>
      <Animated.View style={[
        styles.container,
        {
          transform: [
            {
              translateY: offset.y,
            }
          ],
          opacity: opacity
        }
        ]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize={'none'}
          autoCorrect={false}
          value={email}
          onChangeText={val=>{setEmail(val)}}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={val=>{setPassword(val)}}
        />

        <TouchableOpacity style={styles.btnSubmit} onPress={handleSignIn}>
          <Text  style={styles.txtSubmit}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnForgetPassword} onPress={()=>setForgetPasswordModal(true)}>
          <Text style={styles.txtForgetPassword}>Esqueci minha senha</Text>
        </TouchableOpacity>
        {!!errorMessage && <Text style={styles.txtErrorMessage}>{errorMessage}</Text>}
      </Animated.View>
      <ModalForgetPassword
        modalVisible={forgetPasswordModal}
        setModalVisible={setForgetPasswordModal}
      >
        <Text>Teste</Text>
      </ModalForgetPassword>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo:{
    flex: 1,
    justifyContent: 'center',

  },
  logo:{
    //width: 150
    //height: 155,
  },
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%'
  },
  input:{
    backgroundColor: '#fff',
    width: '90%',
    marginBottom:15,
    color: '#222',
    fontSize: 17,
    borderRadius: 7,
    padding: 10
  },
  btnSubmit:{
    backgroundColor:'#35AAFF',
    width: '90%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  txtSubmit:{
    color: '#fff',
    fontSize: 18
  },
  btnForgetPassword:{
    width: '90%',
    marginTop: 22
  },
  txtForgetPassword:{
    color: '#fff',
    fontSize: 13,
  },
  txtErrorMessage:{
    color: '#f77',
    fontWeight: '500',
    marginTop: 12,
    fontSize: 13,
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#ccc'
  }
});
