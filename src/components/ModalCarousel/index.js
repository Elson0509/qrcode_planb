import React, { useRef } from 'react';
import { StyleSheet, Text, View, Modal, ImageBackground, FlatList, TouchableOpacity, Image, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import { PREFIX_IMG_GOOGLE_CLOUD } from '../../services/constants'
import Carousel from 'react-native-snap-carousel';

const ModalCarousel = (props) => {
    const carouselItems = _ => {
        return props.carouselImages.map(el => (
            {
                img: { uri: PREFIX_IMG_GOOGLE_CLOUD + el.photo_id }
            }
        ))
    }

    const renderItem = ({ item, index }) => {
        return (
            <View style={{
                backgroundColor: 'black',
                borderRadius: 5,
                flex: 1,
            }}>
                <ImageBackground source={item.img} resizeMode="contain" style={styles.image}>

                </ImageBackground>
            </View>

        )
    }

    let carousel = useRef(null)
    return (
        <Modal
            visible={props.modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => props.setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Carousel
                        layout={"default"}
                        ref={ref => carousel = ref}
                        data={carouselItems()}
                        sliderWidth={400}
                        itemWidth={300}
                        renderItem={renderItem}
                    />


                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
});

export default ModalCarousel;