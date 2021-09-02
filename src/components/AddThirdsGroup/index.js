import React, {useState} from 'react';
import Icon from '../Icon';
import InputBox from '../InputBox';
import FooterButtons from '../FooterButtons';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import DateInputBox from '../DateInputBox'
import PicUser from '../PicUser';
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

const AddThirdsGroup = (props) => {
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
                <Icon name='tools' size={40}/>
                <Text>Adicionar Terceirizados</Text>
            </TouchableOpacity>
            {
                props.residents.map(((el, ind)=> (
                    <View key={ind} style={[styles.listItem]}>
                        <View style={{flexDirection: 'row'}}>
                            <PicUser user={el}/>
                            <View style={{marginLeft: 5, marginRight: 5, maxWidth: 210}}>
                                <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Nome:</Text> {el.name}</Text>
                                {!!el.email && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Email:</Text> {el.email}</Text>}
                                {!!el.identification && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Id:</Text> {el.identification}</Text>}
                                {!!el.empresa && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Empresa:</Text> {el.empresa}</Text>}
                                {!!el.initial_date && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Início:</Text> {Utils.printDate(el.initial_date)}</Text>}
                                {!!el.final_date && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Fim:</Text> {Utils.printDate(el.final_date)}</Text>}
                                
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
                        backgroundColor={Constants.backgroundLightColors['Thirds']}
                        borderColor={Constants.backgroundDarkColors['Thirds']}
                        colorInput={Constants.backgroundDarkColors['Thirds']}
                    />
                    <InputBox
                        text="Identidade:"
                        value={props.userBeingAdded.identification}
                        width={295}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, identification: val})}
                        autoCapitalize='characters'
                        backgroundColor={Constants.backgroundLightColors['Thirds']}
                        borderColor={Constants.backgroundDarkColors['Thirds']}
                        colorInput={Constants.backgroundDarkColors['Thirds']}
                    />
                    <InputBox
                        text="Empresa:"
                        value={props.userBeingAdded.empresa}
                        width={295}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, empresa: val})}
                        backgroundColor={Constants.backgroundLightColors['Thirds']}
                        borderColor={Constants.backgroundDarkColors['Thirds']}
                        colorInput={Constants.backgroundDarkColors['Thirds']}
                    />
                    <DateInputBox
                        changed1={(value)=>props.setDateInit({...props.dateInit, day: value})}
                        changed2={(value)=>props.setDateInit({...props.dateInit, month: value})}
                        changed3={(value)=>props.setDateInit({...props.dateInit, year: value})}
                        text='Data inicial*:'
                        backgroundColor={props.backgroundColorInput || Constants.backgroundLightColors['Thirds']}
                        borderColor={props.borderColor || Constants.backgroundDarkColors['Thirds']}
                        colorInput={props.colorInput || Constants.backgroundDarkColors['Thirds']}
                        value1={props.dateInit.day}
                        value2={props.dateInit.month}
                        value3={props.dateInit.year}
                    />
                    <DateInputBox
                        changed1={(value)=>props.setDateEnd({...props.dateEnd, day: value})}
                        changed2={(value)=>props.setDateEnd({...props.dateEnd, month: value})}
                        changed3={(value)=>props.setDateEnd({...props.dateEnd, year: value})}
                        text='Data final*:'
                        backgroundColor={props.backgroundColorInput || Constants.backgroundLightColors['Thirds']}
                        borderColor={props.borderColor || Constants.backgroundDarkColors['Thirds']}
                        colorInput={props.colorInput || Constants.backgroundDarkColors['Thirds']}
                        value1={props.dateEnd.day}
                        value2={props.dateEnd.month}
                        value3={props.dateEnd.year}
                    />
                    <Text style={styles.title}>Foto:</Text>
                    {!props.userBeingAdded.pic &&
                    <View style={[styles.buttonAddPhotoGroup]}>
                        <TouchableOpacity
                            style={[styles.buttonAddphotoIsClicked, {backgroundColor: props.backgroundColor, borderColor: 'white', borderWidth: 1}]}
                            onPress={()=>{props.photoClickHandler()}}
                        >
                            <Icon name="camera" size={18} color='white'/>
                            <Text style={{color: 'white'}}>Câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonAddphotoIsClicked, {marginLeft: 40, backgroundColor: props.backgroundColor, borderColor: 'white', borderWidth: 1}]}
                            onPress={()=>{props.pickImage()}}
                        >
                            <Icon name="paperclip" size={18} color='white'/>
                            <Text style={{color: 'white'}}>Arquivo</Text>
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
                            backgroundColor={props.backgroundColor}
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
        color: '#F77',
        backgroundColor: 'white',
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#F77',
        padding: 5,
    }
})

export default AddThirdsGroup;