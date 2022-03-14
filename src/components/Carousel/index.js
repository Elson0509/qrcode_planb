import React, { useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from '../Icon';

const CarouselImg = (props) => {

  const closeHandle = index =>{
    props.removePhoto(index)
    carousel.snapToItem(0)
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <ImageBackground source={{ uri: item }} resizeMode="contain" style={styles.image}>
        </ImageBackground>
        <Text style={{ color: 'white', textAlign: 'center' }}>Imagem {index + 1} de {props.images.length}</Text>
        <TouchableOpacity style={styles.CloseButton} onPress={() => closeHandle(index)}>
          <Icon name='window-close' size={30} color='red' />
        </TouchableOpacity>
      </View>
    )
  }

  let carousel = useRef(null)

  return (
    <Carousel
      layout="tinder"
      ref={ref => carousel = ref}
      data={props.images}
      sliderWidth={400}
      itemWidth={300}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderRadius: 5,
    height: 150,
    marginTop: 20,
  },
  image: {
    flex: 1,
  },
  CloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  }
});

export default CarouselImg;