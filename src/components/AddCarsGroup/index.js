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
} from 'react-native';

const AddCarsGroup = (props) => {
    const [addingVehicle, setAddingVehicle] = useState(false)

    console.log(props)

    const addHandler = _ => {
        if(props.addVehicleHandler()){
            setAddingVehicle(false)
        }
    }

    const cancelHandler = _ => {
        props.cancelVehicleHandler();
        setAddingVehicle(false)
    }

    const changePlate = val =>{
        if(val.length>7)
            return
        const vehicle = {...props.vehicleBeingAdded, plate: val}
        props.setVehicleBeingAdded(vehicle)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={()=> {setAddingVehicle(true)}}>
                <Icon name='car' size={40}/>
                <Text>Adicionar Veículo</Text>
            </TouchableOpacity>
            {
                props.data.map((el, ind)=> (
                    <View key={ind} style={[styles.listItem]}>
                        <View style={{marginRight: 5, maxWidth: 210}}>
                            <Text style={styles.menuItemText}>{el.maker} {el.model} {el.color}</Text>
                            <Text style={styles.menuItemText}>Placa: {el.plate}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>removeVehicle(ind)}>
                            <Icon name='window-close' size={30}/>
                        </TouchableOpacity>
                    </View>
                ))
            }
            {
                addingVehicle && 
                <View>
                    <InputBox
                        text="Fabricante*:"
                        value={props.vehicleBeingAdded.maker}
                        width={295}
                        changed={val=>props.setVehicleBeingAdded({...props.vehicleBeingAdded, maker: val})}
                        autoCapitalize='words'
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    <InputBox
                        text="Modelo*:"
                        value={props.vehicleBeingAdded.model}
                        width={295}
                        changed={val=>props.setVehicleBeingAdded({...props.vehicleBeingAdded, model: val})}
                        autoCapitalize='words'
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    <InputBox
                        text="Cor*:"
                        value={props.vehicleBeingAdded.color}
                        width={295}
                        changed={val=>props.setVehicleBeingAdded({...props.vehicleBeingAdded, color: val})}
                        autoCapitalize='words'
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    <InputBox
                        text="Placa*:"
                        value={props.vehicleBeingAdded.plate}
                        width={295}
                        changed={changePlate}
                        autoCapitalize='characters'
                        autoCorrect={false}
                        backgroundColor={Constants.backgroundLightColors['Residents']}
                        borderColor={Constants.backgroundDarkColors['Residents']}
                        colorInput={Constants.backgroundDarkColors['Residents']}
                    />
                    {!!props.errorAddVehicleMessage && <Text style={styles.errorMessage}>{props.errorAddVehicleMessage}</Text>}
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
        backgroundColor: '#44FFAF',
        padding: 20,
        marginTop: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderStyle: 'dotted',
        marginBottom: 20,
    },
    button:{
        backgroundColor: '#00FF7F',
        alignItems: 'center',
        padding: 3,
        borderRadius: 15,
        borderWidth: 2,
        marginBottom: 10,
    },
    listItem:{
        padding: 3,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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

export default AddCarsGroup;