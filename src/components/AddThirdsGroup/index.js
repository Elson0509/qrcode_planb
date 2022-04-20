import React from 'react';
import Icon from '../Icon';
import InputBox from '../InputBox';
import FooterButtons from '../FooterButtons';
import * as Constants from '../../services/constants'
import * as Utils from '../../services/util'
import PicUser from '../PicUser';
import { StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native';

const AddThirdsGroup = (props) => {
    const addHandler = async _ => {
        if(await props.addResidentHandler()){
            props.setAddingUser(false)
        }
    }

    const cancelHandler = _ => {
        props.cancelAddResidentHandler();
        props.setAddingUser(false)
    }

    return (
        <View style={[styles.container, {backgroundColor: props.backgroundColor || '#44FFAF'}]}>
            <TouchableOpacity style={[styles.button, {backgroundColor: props.backgroundColorButtons || '#00FF7F'}]} onPress={()=> {props.setAddingUser(true)}}>
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
                                {!!el.company && <Text style={styles.menuItemText}><Text style={styles.menuItemTextPrefix}>Empresa:</Text> {el.company}</Text>}
                            </View>
                        </View>
                        
                        <TouchableOpacity onPress={()=>props.removeResident(ind)}>
                            <Icon name='window-close' size={30}/>
                        </TouchableOpacity>
                    </View>
                )))
            }
            {
                props.addingUser &&
                <View>
                    <InputBox
                        text="Nome*:"
                        value={props.userBeingAdded.name}
                        changed={val=>Utils.testWordWithNoSpecialChars(val) && props.setUserBeingAdded({...props.userBeingAdded, name: val})}
                        autoCapitalize='words'
                        backgroundColor={Constants.backgroundLightColors['Thirds']}
                        borderColor={Constants.backgroundDarkColors['Thirds']}
                        colorInput={Constants.backgroundDarkColors['Thirds']}
                    />
                    <InputBox
                        text="Documento*:"
                        value={props.userBeingAdded.identification}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, identification: val})}
                        autoCapitalize='characters'
                        backgroundColor={Constants.backgroundLightColors['Thirds']}
                        borderColor={Constants.backgroundDarkColors['Thirds']}
                        colorInput={Constants.backgroundDarkColors['Thirds']}
                    />
                    <InputBox
                        text="Empresa*:"
                        value={props.userBeingAdded.company}
                        changed={val=>props.setUserBeingAdded({...props.userBeingAdded, company: val})}
                        backgroundColor={Constants.backgroundLightColors['Thirds']}
                        borderColor={Constants.backgroundDarkColors['Thirds']}
                        colorInput={Constants.backgroundDarkColors['Thirds']}
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
                            title1={props.buttonText || "Adicionar"}
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
        marginBottom: 5,
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