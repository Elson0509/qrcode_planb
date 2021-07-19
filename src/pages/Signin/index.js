import React, {useState, useEffect} from 'react';
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

  const [offset, setOffset] = useState(new Animated.ValueXY({x:0, y:90}))
  const [opacity] = useState(new Animated.Value(0))
  const { signed, signIn } = useAuth()

  console.log(signed)

  const handleSignIn = async _ =>{
    signIn()
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
          autoCorrect={false}
          onChangeText={()=>{}}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCorrect={false}
          onChangeText={()=>{}}
        />

        <TouchableOpacity style={styles.btnSubmit} onPress={handleSignIn}>
          <Text  style={styles.txtSubmit}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnForgetPassword}>
          <Text  style={styles.txtForgetPassword}>Esqueci minha senha</Text>
        </TouchableOpacity>
        
      </Animated.View>
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
  }
});
