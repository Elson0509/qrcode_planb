import React, {useState, useEffect, Fragment} from 'react';
import { StyleSheet, Text, View, Modal, Button, Image, ScrollView, SafeAreaView } from 'react-native';
import api from '../../services/api'
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import FooterButtons from '../../components/FooterButtons';
import Placa from '../../components/Placa';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import PicUser from '../../components/PicUser';

const Scanned = (props) => {
    const [dataFetched, setDataFetched] = useState(null)
    const [backgroundColorScreen, setbackgroundColorScreen] = useState('black')
    const [userType, setUserType] = useState('Residente')
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    const typeData = props.route.params.typeInput
    const idData = props.route.params.dataInput

    const messageError = 'Esse QR Code não é válido ou o usuário não está cadastrado.'

    console.log(props)

    useEffect(()=>{
        if(typeData!=Constants.TYPE_DATA_QRCODE){
            setLoading(false)
            setErrorMessage(messageError)
            return 
        }
        const prefix = idData.substring(0, 4)
        if(prefix != Constants.QR_CODE_PREFIX){
            setLoading(false)
            setErrorMessage(messageError)
            return 
        }
        const dataParts = idData.split(':')
        if(dataParts.length!=2 || !Utils.isUUID(dataParts[1])){
            setLoading(false)
            setErrorMessage(messageError)
            return 
        }

        api.get(`api/reading/${dataParts[1]}`)
            .then(res=>{
                setErrorMessage('')
                setDataFetched(res.data)
                
                if(res.data.user_kind_id == Constants.USER_KIND['RESIDENT']){
                    setbackgroundColorScreen(Constants.backgroundColors['Residents'])
                    setUserType('Residente')
                }
                if(res.data.user_kind_id == Constants.USER_KIND['SUPERINTENDENT']){
                    setbackgroundColorScreen(Constants.backgroundColors['Residents'])
                    setUserType('Administrador')
                }
                if(res.data.user_kind_id == Constants.USER_KIND['GUARD']){
                    setbackgroundColorScreen(Constants.backgroundColors['Guards'])
                    setUserType('Vigilante')
                }
                if(res.data.unit_kind_id && res.data.unit_kind_id === Constants.USER_KIND['VISITOR']){
                    setbackgroundColorScreen(Constants.backgroundColors['Visitors'])
                    setUserType('Visitantes')
                }
                if(res.data.unit_kind_id && res.data.unit_kind_id === Constants.USER_KIND['THIRD']){
                    setbackgroundColorScreen(Constants.backgroundColors['Thirds'])
                    setUserType('Terceirizados')
                }

                setLoading(false)
            })
            .catch(err=>{
                setErrorMessage(err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (SC1)')
                setLoading(false)
            })
    },[])

    const formatData = () => {
        //user || superintendent
        if(dataFetched && dataFetched.user_kind_id){
            return (
                <View style={{backgroundColor: backgroundColorScreen, alignItems:'center', padding: 10}}>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, textDecorationLine: 'underline'}}>{userType}</Text>
                    <PicUser user={dataFetched} height={240} width={200}/>
                    <Text style={{marginTop: 8, fontSize: 18, fontWeight: 'bold'}}>{dataFetched.name}</Text>
                    {!!dataFetched.Unit?.Bloco?.name && <Text style={{marginTop: 4, fontSize: 18}}>{`Bloco ${dataFetched.Unit.Bloco.name}`}</Text>}
                    {!!dataFetched.Unit?.number && <Text style={{marginTop: 4, fontSize: 18, marginBottom: 20}}>{`Unidade ${dataFetched.Unit.number}`}</Text>}
                    {!dataFetched.Unit?.Vehicles.length && <Text style={{textDecorationLine: 'underline', fontSize: 15,}}>Não há veículos cadastrados.</Text>}
                    {!!dataFetched.Unit?.Vehicles.length && <Text style={{fontSize: 15, marginBottom: 0}}>Veículos cadastrados:</Text>}
                    {!!dataFetched.Unit?.Vehicles.length && 
                        dataFetched.Unit?.Vehicles.map((el, ind)=>{
                            return (
                                <View key={ind} style={{borderBottomWidth: 1, padding: 12}}>
                                    <Text style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{`${el.maker} ${el.model} ${el.color}`}</Text>
                                    <Placa placa={el.plate}/>
                                </View>
                            )
                        })}
                </View>
            )
        }
        //visitor or third
        if(dataFetched && dataFetched.unit_kind_id){
            return (
                <View style={{backgroundColor: backgroundColorScreen, padding: 10}}>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, textDecorationLine: 'underline'}}>{userType}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 0}}>Autorizado por {'\n'} Bloco {dataFetched.Bloco.name} {'\n'} Unidade {dataFetched.number}</Text>
                    {dataFetched.Users.map((el, ind)=>{
                        return(
                            <View key={el.id} style={{flexDirection: 'row', marginVertical: 5, borderWidth: 2, borderColor: '#ddd' ,marginBottom: 4}}>
                                <View>
                                    <PicUser user={el} height={130} width={98}/>
                                </View>
                                <View>
                                    {!!el.name && <Text style={{marginTop: 4, fontSize: 18, fontWeight: 'bold'}}>{el.name}</Text>}
                                    {!!el.company && <Text style={{marginTop: 4, fontSize: 18}}>Empresa: {el.company}</Text>}
                                    {!!el.identification && <Text style={{marginTop: 4, fontSize: 18}}>{`Id: ${el.identification}`}</Text>}
                                </View>
                            </View>
                        )
                    })}
                    
                    <View style={{alignItems:'center', marginTop: 10}}>
                        {!dataFetched.Vehicles.length && <Text style={{textDecorationLine: 'underline', fontSize: 15,}}>Não há veículos cadastrados.</Text>}
                        {!!dataFetched.Vehicles.length && <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 0, letterSpacing: 1, textDecorationLine: 'underline'}}>Veículos cadastrados</Text>}
                        {!!dataFetched.Vehicles.length && 
                            dataFetched.Vehicles.map((el, ind)=>{
                                return (
                                    <View key={ind} style={{borderBottomWidth: 1, padding: 12}}>
                                        <Text style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{`${el.maker} ${el.model} ${el.color}`}</Text>
                                        <Placa placa={el.plate}/>
                                    </View>
                                )
                        })}
                    </View>
                </View>
            )
        }
    }

    if(loading)
        return (
            <SafeAreaView>
                <Spinner/>
            </SafeAreaView>
        )

    if(errorMessage){
        return (
            <ScrollView style={{flex: 1, backgroundColor: Constants.is_not_autorized_backgroundColor}}>
                <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                        <Icon name='exclamation-triangle' color='white' size={100}/>
                    </View>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
                <FooterButtons
                    title1="Escanear"
                    title2="Cancelar"
                    action1={()=> props.navigation.goBack()}
                    action2={()=> props.navigation.navigate('Dashboard')}
                    backgroundColor={Constants.is_not_autorized_backgroundColor}
                />
            </ScrollView>
        )
    }

    return (
        <ScrollView style={{flex: 1, backgroundColor: backgroundColorScreen, paddingTop: 30}}>
            {formatData()}
            <FooterButtons
                title1="Escanear"
                title2="Cancelar"
                action1={()=> props.navigation.goBack()}
                action2={()=> props.navigation.navigate('Dashboard')}
                backgroundColor={backgroundColorScreen}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    errorContainer:{
        backgroundColor:Constants.is_not_autorized_backgroundColor,
        padding: 40,
        paddingTop: 110,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
    },
    errorIcon:{
        marginBottom: 80,
    },
    errorMessage:{
        color: 'white',
        fontSize: 28,
        lineHeight: 42,
        textAlign: 'center',
    }
})

export default Scanned;