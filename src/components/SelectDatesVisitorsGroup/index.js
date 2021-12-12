import React, {useState} from 'react';
import Icon from '../Icon';
import InputBox from '../InputBox';
import FooterButtons from '../FooterButtons';
import * as Constants from '../../services/constants'
import DateInputBox from '../DateInputBox'
import { StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';

const SelectDatesVisitorsGroup = (props) => {
    const addHandler = _ => {
        if(props.selectDatesHandler()){
            props.setAddingDates(false)
        }
    }

    const cancelHandler = _ => {
        props.cancelDatesHandler();
        props.setAddingDates(false)
    }

    return (
        <View style={[styles.container, {backgroundColor: props.backgroundColor || '#44FFAF'}]}>
            <TouchableOpacity style={[styles.button, {backgroundColor: props.backgroundColorButtons || '#00FF7F'}]} onPress={()=> {props.setAddingDates(true)}}>
                <Icon name='calendar-alt' size={40}/>
                <Text>Selecionar Prazo</Text>
            </TouchableOpacity>
            {     
                !!props.selectedDateInit && !!props.selectedDateEnd &&
                <View style={[styles.listItem]}>
                    <View>
                        <Text>Início: {props.selectedDateInit}</Text>
                        <Text>Fim: {props.selectedDateEnd}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>props.cancelDatesHandler()}>
                        <Icon name='window-close' size={30}/>
                    </TouchableOpacity>
                </View>
            }
            {
                props.addingDates &&
                <View>
                   <DateInputBox
                        changed1={(value)=>props.setDateInit({...props.dateInit, day: value})}
                        changed2={(value)=>props.setDateInit({...props.dateInit, month: value})}
                        changed3={(value)=>props.setDateInit({...props.dateInit, year: value})}
                        text='Data inicial*:'
                        backgroundColor={props.backgroundColorInput || Constants.backgroundLightColors['Visitors']}
                        borderColor={props.borderColor || Constants.backgroundDarkColors['Visitors']}
                        colorInput={props.colorInput || Constants.backgroundDarkColors['Visitors']}
                        value1={props.dateInit.day}
                        value2={props.dateInit.month}
                        value3={props.dateInit.year}
                    />
                    <DateInputBox
                        changed1={(value)=>props.setDateEnd({...props.dateEnd, day: value})}
                        changed2={(value)=>props.setDateEnd({...props.dateEnd, month: value})}
                        changed3={(value)=>props.setDateEnd({...props.dateEnd, year: value})}
                        text='Data final*:'
                        backgroundColor={props.backgroundColorInput || Constants.backgroundLightColors['Visitors']}
                        borderColor={props.borderColor || Constants.backgroundDarkColors['Visitors']}
                        colorInput={props.colorInput || Constants.backgroundDarkColors['Visitors']}
                        value1={props.dateEnd.day}
                        value2={props.dateEnd.month}
                        value3={props.dateEnd.year}
                    />
                    {!!props.errorMessage && <Text style={styles.errorMessage}>{props.errorMessage}</Text>}
                    <View style={styles.buttonAddPhotoGroup}>
                        <FooterButtons
                            action1={addHandler}
                            action2={cancelHandler}
                            title1="Confirmar"
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

export default SelectDatesVisitorsGroup;