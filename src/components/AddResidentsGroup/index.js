import React, {useState} from 'react';
import Icon from '../Icon';
import InputBox from '../InputBox';
import FooterButtons from '../FooterButtons';
import * as Constants from '../../services/constants'
import { StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Text,
    FlatList,
    Animated,
    Keyboard,
    Button,
} from 'react-native';
import PicUser from '../PicUser';

const AddResidentsGroup = (props) => {
    const [addingUser, setAddingUser] = useState(false)

    const addHandler = _ => {
        if(props.addResidentHandler()){
            setAddingUser(false)
        }
    }

    const cancelHandler = _ => {
        props.cancelAddResidentHandler();
        setAddingUser(false)
    }

    return (
        <View style={[styles.container, {backgroundColor: props.backgroundColor || '#44FFAF'}]}>
            <TouchableOpacity style={[styles.button, {backgroundColor: props.backgroundColorButtons || '#00FF7F'}]} onPress={()=> {setAddingUser(true)}}>
                <Icon name='user' size={40}/>
                <Text>Adicionar Morador</Text>
            </TouchableOpacity>
            {
                props.residents.map(((el, ind)=> (
                    <View key={el.name+el.id+el.identification+el.email} style={[styles.listItem]}>
                        <View style={{flexDirection: 'row'}}>
                            <PicUser user={el}/>
                            <View style={{marginLeft: 5, marginRight: 5, maxWidth: 210}}>
                                <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Nome:</Text> {el.name}</Text>
                                <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Email:</Text> {el.email}</Text>
                                {!!el.identification && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Id:</Text> {el.identification}</Text>}
                            </View>
                        </View>
                        
                        <TouchableOpacity onPress={()=>props.removeResident(ind)}>
                            <Icon name='window-close' size={30}/>
                        </TouchableOpacity>
                    </View>
                )))
            }
            {
                addingUser &&
                <View>
                    <InputBox
                        text="Nome*:"
                        value={props.userBeingAdded.name}
                        width={295}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, name: val})}
                        autoCapitalize='words'
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    <InputBox
                        text="Identidade:"
                        value={props.userBeingAdded.identification}
                        width={295}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, identification: val})}
                        autoCapitalize='characters'
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    <InputBox
                        text="Email*:"
                        value={props.userBeingAdded.email}
                        width={295}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, email: val})}
                        keyboard={'email-address'}
                        autoCapitalize='none'
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    <Text style={styles.title}>Foto:</Text>
                    {!props.userBeingAdded.pic &&
                    <View style={styles.buttonAddPhotoGroup}>
                        <TouchableOpacity
                            style={[styles.buttonAddphotoIsClicked]}
                            onPress={()=>{props.photoClickHandler()}}
                        >
                            <Icon name="camera" size={18}/>
                            <Text>Câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonAddphotoIsClicked, {marginLeft: 40}]}
                            onPress={()=>{props.pickImage()}}
                        >
                            <Icon name="paperclip" size={18}/>
                            <Text>Arquivo</Text>
                        </TouchableOpacity>
                    </View>
                    ||
                    <View style={styles.buttonAddPhotoGroup}>
                        <Image
                            style={{width: 66, height: 79,}}
                            source={{uri: props.userBeingAdded.pic}}
                        />
                    </View>
                    }
                    {!!props.errorAddResidentMessage && <Text style={styles.errorMessage}>{props.errorAddResidentMessage}</Text>}
                    <View style={styles.buttonAddPhotoGroup}>
                        <FooterButtons
                            action1={addHandler}
                            action2={cancelHandler}
                            title1="Adicionar"
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
    container:{
        padding: 20,
        marginTop: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderStyle: 'dotted'
    },
    button:{
        alignItems: 'center',
        padding: 3,
        borderRadius: 15,
        borderWidth: 2,
        marginBottom: 10,
    },
    menuItemText: {

    },
    menuItemTextPrefix:{
        fontWeight: 'bold',
    },
    listItem:{
        padding: 3,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonAddphotoIsClicked:{
        borderRadius: 8,
        backgroundColor: '#90EE90',
        marginTop: 15,
        padding: 15,
        alignItems: 'center',
      },
    buttonAddPhotoGroup:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18
    },
    errorMessage:{
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